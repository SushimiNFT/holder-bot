import { readFileSync, writeFileSync } from "fs";
import fetch from "isomorphic-fetch";
import path from "path";
import "dotenv/config";

type UserAddressesMap = Map<string, string[]>;

function readMap() {
  const json = JSON.parse(
    readFileSync(path.resolve("./UserAddresses.json"), {
      encoding: "utf-8",
    })
  );

  const map = new Map() as UserAddressesMap;
  Object.keys(json).map((key) => {
    map.set(key, json[key]);
  });

  return map;
}

function writeMap(map: UserAddressesMap) {
  const json: Record<any, any> = {};
  map.forEach((value, key) => {
    json[key] = value;
  });

  writeFileSync(
    path.resolve("./UserAddresses.json"),
    JSON.stringify(json, null, 2)
  );
}

const UserAddressesInMemory = readMap();

export async function addUserAddress(userId: string, address: string) {
  address = address.toLowerCase();

  UserAddressesInMemory.forEach((value, key) => {
    if (value.includes(address)) {
      UserAddressesInMemory.set(
        key,
        value.filter((addy) => addy !== address)
      );
    }
  });

  UserAddressesInMemory.set(userId, [
    ...(UserAddressesInMemory.get(userId) || []),
    address,
  ]);

  writeMap(UserAddressesInMemory);
}

export function getUsersAdresses(userId: string) {
  return UserAddressesInMemory.get(userId);
}
