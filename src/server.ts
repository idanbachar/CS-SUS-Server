import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { GetFullUserData, GetSteamInventory } from "./services/steamworks";
import {
  checkIsSteamProfileValid,
  getSteamIDFromURL,
} from "./services/validation";

const app = express();
app.use("/", express.static("public"));
app.use(cors());

const PORT = 4000;

app.get("/getUser", (req: Request, res: Response) => {
  (async () => {
    const { steamUrl } = req.query;
    if (steamUrl) {
      const isSteamProfileValid = checkIsSteamProfileValid(steamUrl.toString());

      if (isSteamProfileValid) {
        const steamId = await getSteamIDFromURL(steamUrl.toString());
        const playerData = await GetFullUserData(steamId);

        res.json(playerData);
      } else {
        res.status(500).send("<h1>Error 505 Invalid steam URL</h1>");
      }
    }
  })();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
