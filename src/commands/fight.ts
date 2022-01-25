// view and manage stuff

import { SlashCommandBuilder } from "@discordjs/builders"

export default new SlashCommandBuilder()
  .setName("fight")
  .setDescription("Start ranked fight")
  .addSubcommand((sub) =>
    sub
      .setName("friendly")
      .setDescription("Start friendly fight")
      .addUserOption((option) =>
        option
          .setName("friend")
          .setDescription("Friend to fight")
          .setRequired(true)
      )
  )
