import { AppContext } from "./context/app";

declare global {
  var context: AppContext;
}

globalThis.context = new AppContext();

import "./apps/discord";
import "./apps/express";
