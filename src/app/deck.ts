import * as app from "../app"

export async function getDeck(player: app.Player): Promise<app.Card[]> {
  return app.knex("card").where({ userId: player.id })
}
