import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { GetPlayerSummaries } from "./services/steamworks";
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
        const data = await GetPlayerSummaries(steamId);
        res.json(data);
      }
    }
  })();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
