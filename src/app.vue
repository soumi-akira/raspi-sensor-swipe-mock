<script setup lang="ts">
import { io } from 'socket.io-client'
import { ref } from 'vue'
import { Direction } from './dir'

const left = ref(false)
const right = ref(false)

const animationClass = ref('')

const stateHistory = ref<{ dir: Direction; value: boolean; time: number }[]>([])

const socket = io('http://localhost:3000')
socket.on('connect', () => {
  console.log('connected')
})
socket.on('changed', (res: { left: boolean; right: boolean }) => {
  const time = Date.now()
  if (left.value !== res.left) {
    left.value = res.left
    stateHistory.value.unshift({
      dir: Direction.Left,
      value: left.value,
      time
    })
  }
  if (right.value !== res.right) {
    right.value = res.right
    stateHistory.value.unshift({
      dir: Direction.Right,
      value: right.value,
      time
    })
  }
  if (stateHistory.value.length < 2 || animationClass.value !== '') return
  const lastAction = stateHistory.value[0]
  const checkAction = stateHistory.value[1]
  if (
    lastAction.dir !== checkAction.dir &&
    !lastAction.value &&
    !checkAction.value &&
    lastAction.time - checkAction.time < 500
  ) {
    animationClass.value = lastAction.dir
    setTimeout(() => {
      animationClass.value = ''
    }, 500)
  }
  while (stateHistory.value.length > 5) stateHistory.value.pop()
})
</script>

<template lang="pug">
.app
  video.plane(
    :class="animationClass"
    src="@/assets/movie.mp4"
    autoplay
    loop
    muted
  )
  .state-list
    .state(
      :class="{ on: left }"
    )
    .state(
      :class="{ on: right }"
    )
</template>

<style lang="sass">
body
  margin: 0
  cursor: none
</style>

<style lang="sass" scoped>
@keyframes left
  0%
    opacity: 1
    transform: translateX(0px)
  50%
    opacity: 0
    transform: translateX(-50px)
  51%
    opacity: 0
    transform: translateX(50px)
  100%
    opacity: 1
    transform: translateX(0px)

@keyframes right
  0%
    opacity: 1
    transform: translateX(0px)
  50%
    opacity: 0
    transform: translateX(50px)
  51%
    opacity: 0
    transform: translateX(-50px)
  100%
    opacity: 1
    transform: translateX(0px)

.app
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 100vw
  height: 100vh
  background: rgb(96,211,235)
  background: linear-gradient(45deg, rgba(96,211,235,1) 0%, rgba(35,148,173,1) 100%)
  // background: rgb(255,255,255)
  // background: linear-gradient(45deg, rgba(255,255,255,1) 0%, rgba(236,243,245,1) 100%)
  .plane
    width: 50vw
    height: 50vh
    box-shadow: 10px 10px 30px rgba(19, 80, 93, 0.2)
    background-color: white
    border: solid 5px white
    object-fit: cover
    &.left
      animation: left 0.5s
    &.right
      animation: right 0.5s
  .state-list
    display: flex
    margin-top: 50px
    .state
      width: 20px
      height: 20px
      border-radius: 20px
      background-color: #bdd9df
      box-shadow: 5px 5px 10px rgba(19, 80, 93, 0.2)
      &.on
        background-color: #1ecbee
      &:first-child
        margin-right: 10px
</style>
