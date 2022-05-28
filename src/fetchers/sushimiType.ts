import { readFileSync, writeFileSync } from "fs";
import fetch from "isomorphic-fetch";
import path from "path";
import "dotenv/config";

import { ALL_SUSHIMI_TYPES } from "../constants";

type SushimiTypes = typeof ALL_SUSHIMI_TYPES[number];
type SushimiTypesMap = Map<number, SushimiTypes | undefined>;

function readMap() {
  const json = JSON.parse(
    readFileSync(path.resolve("./SushimiTypes.json"), {
      encoding: "utf-8",
    })
  );

  const map = new Map() as SushimiTypesMap;
  Object.keys(json).map((key) => {
    map.set(Number(key), json[key]);
  });

  return map;
}

function writeMap(map: SushimiTypesMap) {
  const json: Record<any, any> = {};
  map.forEach((value, key) => {
    json[key] = value;
  });

  writeFileSync(
    path.resolve("./SushimiTypes.json"),
    JSON.stringify(json, null, 2)
  );
}

const SushimiTypesInMemory = readMap();

export async function getType(id: number) {
  let type = SushimiTypesInMemory.get(id);

  // If exists, return
  if (type) return type;

  // If doesn't exist, fetch
  try {
    const metadata = await fetch(
      `${process.env.SUSHIMI_BASE_URL}${id}.json`
    ).then((data: any) => data.json());

    const type: SushimiTypes = metadata.attributes.find(
      ({ trait_type }: { trait_type: string }) => trait_type === "Type"
    )?.value;

    if (!type) throw new Error("No type");

    SushimiTypesInMemory.set(id, type);
    writeMap(SushimiTypesInMemory);

    return type;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
