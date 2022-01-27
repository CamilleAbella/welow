import * as app from "../app"

export type ClassName = "warrior"

export type CLass = (player: app.Player) => Partial<app.FighterStats>

export const classes: Record<ClassName, CLass> = {
  warrior: () => ({
    hp: 0,
  }),
}

export function getClassStats(player: app.Player) {
  return classes[player.class](player)
}

export function randomClassName(): ClassName {
  const names = Object.keys(classes)
  return names[Math.floor((names.length - 1) * Math.random())] as ClassName
}
