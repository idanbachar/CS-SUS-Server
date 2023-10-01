import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import {
  GetFullUserData,
  GetPlayerBans,
  GetPlayersData,
} from "./services/steamworks";
import {
  checkIsSteamProfileValid,
  getSteamIDFromURL,
} from "./services/validation";
import passport from "passport";
import { Strategy } from "passport-steam";
import { API_KEY, DOMAIN, TOKEN } from "./services/general";
import session from "express-session";
const PORT = 4000;
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

// require("crypto").randomBytes(48, function (err: any, buffer: any) {
//   TOKEN = buffer.toString("hex");
// });

const app = express();
app.use("/", express.static("public"));
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

app.post("/sendemail", (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: "",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log(error);
      res.status(500).send("Email sending failed");
    } else {
      res.send("Email sent successfully");
    }
  });
});

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
    const avatar = photos && photos.length ? photos[2].value : null;
    const profileurl = _json.profileurl;

    res.redirect(
      `${DOMAIN}/login-succeed?username=${displayName}&id=${id}&avatar=${avatar}&profileurl=${profileurl}`
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
        const playerData = await GetFullUserData(steamId);
        res.json(playerData);
      } else {
        res.status(500).send("<h1>Error 505 Invalid steam URL</h1>");
      }
    }
  })();
});

app.get("/getUsers", (req: Request, res: Response) => {
  (async () => {
    const { steamUrls } = req.query;
    if (steamUrls) {
      const players = await GetPlayersData(steamUrls.toString());
      let playersData;
      if (players !== null) {
        const ids = players.map((player) => player.steamid);
        const requests = ids.map((id) => {
          return GetPlayerBans(id);
        });

        const vacBans = await Promise.all(requests);
        playersData = [...players].map((player) => {
          return {
            ...player,
            vacBans: vacBans.find((ban) => ban?.SteamId === player.steamid),
          };
        });
      }
      res.json(playersData);
    }
  })();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
