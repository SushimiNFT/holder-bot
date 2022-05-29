import { Client, Intents, MessageActionRow, MessageButton } from "discord.js";
import "dotenv/config";

import { getType as getSushimiType } from "./../fetchers/sushimiType";
import { getNftsByHolders } from "./../fetchers/sushimiHolders";
import { CHANNEL_ID } from "./../constants";
import { updateRoles } from "./../functions/roles";

const client = new Client({
  intents: Object.values(Intents.FLAGS),
});

globalThis.context.discordClient = client;

client.on("ready", async () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
  const verifyChannel = await client.channels.fetch(CHANNEL_ID);
  if (verifyChannel?.isText()) {
    const messages = await verifyChannel.messages.fetch();
    messages
      .filter((message) => message.author.id === client!.user!.id)
      .forEach(async (message) => {
        message.delete();
      });

    const message = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("verify")
          .setLabel("Verify")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("update")
          .setLabel("Update")
          .setStyle("SECONDARY")
      );

    verifyChannel.send({ components: [message] });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "verify") {
      const message = {
        content: "Use this custom link to connect\n",
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setLabel("Connect Wallet")
              .setStyle("LINK")
              .setURL(
                `https://verify.sushimi.org/?userId=${
                  interaction!.member!.user.id
                }`
              )
          ),
        ],
        ephemeral: true,
      };

      await interaction.reply(message);
    }

    if (interaction.customId === "update") {
      await updateRoles(interaction!.user!.id);
      await interaction.deferUpdate();
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
