import express from "express";
import bodyParser from "body-parser";
import { utils } from "ethers";
import "dotenv/config";
import { updateRoles } from "../functions/roles";
import { addUserAddress } from "../fetchers/userAddresses";

const app = express();

const jsonParser = bodyParser.json();

app.post("/submitMessage", jsonParser, async (req, res) => {
  try {
    const { message, signature } = req.body;

    const { address, timestamp, discordId } = JSON.parse(message);

    // If timestamp + 1 hour is still older than current date
    if (timestamp + 3600 < Math.floor(Date.now() / 1000))
      throw new Error("Signature too old.");

    const signerAddress = utils.verifyMessage(message, signature).toLowerCase();
    if (address !== signerAddress) throw new Error("Signature invalid.");

    const removedUserIdFrom = await addUserAddress(discordId, address);

    if (!globalThis.context.discordClient)
      throw new Error("Discord client unavailable.");

    if (!!removedUserIdFrom) {
      await updateRoles(removedUserIdFrom, globalThis.context.discordClient);
    }

    await updateRoles(discordId, globalThis.context.discordClient);
  } catch (err) {
    res.status(500).send(err);
    return;
  }
  res.sendStatus(200);
});

app.listen(process.env.EXPRESS_PORT);
