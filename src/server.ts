import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { GetFullUserData } from "./services/steamworks";
import {
  checkIsSteamProfileValid,
  getSteamIDFromURL,
} from "./services/validation";
import passport from "passport";
import { Strategy } from "passport-steam";
import { API_KEY, TOKEN } from "./services/general";
import session from "express-session";
const PORT = 4000;

// require("crypto").randomBytes(48, function (err: any, buffer: any) {
//   TOKEN = buffer.toString("hex");
// });

const app = express();
app.use("/", express.static("public"));
app.use(cors());

app.use(
  session({
    secret: TOKEN!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Strategy(
    {
      returnURL: `http://localhost:${PORT}/auth/steam/return`,
      realm: `http://localhost:${PORT}/`,
      apiKey: API_KEY,
    },
    (identifier: any, profile: any, done: any) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

app.get("/auth/steam", passport.authenticate("steam"));

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", {
    failureRedirect: "/",
  }),
  (req: any, res) => {
    const { displayName, id, photos, _json } = req.user;
    const avatar = photos && photos.length ? photos[0].value : null;
    const profileurl = _json.profileurl;

    res.redirect(
      `http://localhost:3000/login-succeed?username=${displayName}&id=${id}&avatar=${avatar}&profileurl=${profileurl}`
    );
  }
);

app.get("/getUser", (req: Request, res: Response) => {
  (async () => {
    const { steamUrl } = req.query;
    if (steamUrl) {
      const isSteamProfileValid = checkIsSteamProfileValid(steamUrl.toString());

      if (isSteamProfileValid) {
        const steamId = await getSteamIDFromURL(steamUrl.toString());
        console.log("steamId", steamId);

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
