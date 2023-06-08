export const Direction = {
  Left: 'left',
  Right: 'right'
} as const
export type Direction = (typeof Direction)[keyof typeof Direction]
