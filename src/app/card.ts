import * as app from "../app"

export interface Card {
  userId: app.Snowflake | null
  rank: number
  shop: boolean | null
  /**
   * action patterns separated by semicolon.
   * @example attack plant 2
   */
  actions: app.ActionPattern<app.ActionName>
}
