// view and manage stuff

import { SlashCommandBuilder } from "@discordjs/builders"

export default new SlashCommandBuilder()
  .setName("stuff")
  .setDescription("Show stuff")
  .addSubcommand((sub) => sub.setName("sell").setDescription("Sell stuff"))
  .addSubcommand((sub) => sub.setName("remove").setDescription("Remove stuff"))
