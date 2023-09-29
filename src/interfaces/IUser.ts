import {
  IInventoryItem,
  ISteamGame,
  ISteamPlayer,
  ISteamPlayerBans,
  ISteamStatsDictionary,
} from "./ISteamWorks";

export interface IUser {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarfull: string;
  avatarmedium: string;
  realname: string;
  timecreated: Date;
  loccountrycode: string | null;
  country_image: string | null;
  friends: ISteamPlayer[] | null;
  vacBans: ISteamPlayerBans | null;
  games: ISteamGame[] | null;
  cs2: ICS2 | null;
  inventory: IInventoryItem[] | null;
  totalBadges: number | null;
  steamLevel: number | null;
  total_games: number | null;
  cheater_percentage: number;
}
export interface ICS2 {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  stats: {
    total_wins: number;
    total_kills_headshot: number;
    headshot_precentage: number;
    total_kills: number;
  } | null;
}
