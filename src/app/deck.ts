import * as app from "../app"

export async function getDeck(fighter: app.Fighter): Promise<app.Card[]> {
  return app.knex("card").where({ userId: fighter.id })
}
