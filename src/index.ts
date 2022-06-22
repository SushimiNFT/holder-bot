import { AppContext } from "./context/app";
import { readSetting, writeSetting } from "./fetchers/settings";

declare global {
  var context: AppContext;
}

globalThis.context = new AppContext();

import "./apps/discord";
import "./apps/express";
