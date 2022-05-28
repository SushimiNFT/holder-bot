import { Client } from "discord.js";

export class AppContext {
  private _discordClient: Client | undefined = undefined;

  set discordClient(client: Client | undefined) {
    this._discordClient = client;
  }

  get discordClient(): Client | undefined {
    return this._discordClient;
  }
}
