import { Client } from "discord.js";
import { ALL_SUSHIMI_TYPES, SERVER_ID } from "../constants";
import { getNftsByHolders } from "../fetchers/sushimiHolders";
import { getType as getSushimiType } from "../fetchers/sushimiType";
import { getUsersAdresses } from "../fetchers/userAddresses";

export async function updateRoles(userId: string) {
  const client = globalThis.context.discordClient!;

  const addressesOfUser = getUsersAdresses(userId) || [];
  const nftsOfUser = await getNftsByHolders({ holders: addressesOfUser });
  const newRolesOfUser = Array.from(
    new Set(await Promise.all(nftsOfUser.map((nft) => getSushimiType(nft))))
  );

  const guild = await client.guilds.fetch(SERVER_ID);
  const member = await guild.members.fetch(userId);
  await guild.roles.fetch();

  for (const type of ALL_SUSHIMI_TYPES) {
    const role = guild.roles.cache.find((role) => role.name === type);
    if (!role) {
      console.log(`Role ${type} doesn't exist!`);
      continue;
    } else if (newRolesOfUser.includes(type)) {
      await member.roles.add(role);
    } else {
      await member.roles.remove(role);
    }
  }
}
