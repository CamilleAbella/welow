import * as app from "../app"

export type Fighter = app.Player &
  app.Stats & {
    actionCharge: number
  }

export function getFighter(player: app.Player): Fighter {
  // generate stats from level
  // apply stuff bonus and malus
  // return fighter
  return {
    ...player,
    ...app.generateStats(player),
    actionCharge: 0,
  }
}
