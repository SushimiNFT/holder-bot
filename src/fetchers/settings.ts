import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { set as setNested, get as getNested } from "lodash";

const filePath = path.resolve("./database/Settings.json");

export function writeSetting(setting: string, value: any) {
  const settings = JSON.parse(readFileSync(filePath, { encoding: "utf-8" }));

  writeFileSync(
    filePath,
    JSON.stringify(setNested(settings, setting, value), null, 2)
  );
}

export function readSetting(setting: string) {
  const settings = JSON.parse(readFileSync(filePath, { encoding: "utf-8" }));
  return getNested(settings, setting);
}
