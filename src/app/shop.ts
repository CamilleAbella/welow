import * as app from "../app"

export async function getShopCards(): Promise<app.Card[]> {
  return app.knex("card").where({ shop: true })
}
