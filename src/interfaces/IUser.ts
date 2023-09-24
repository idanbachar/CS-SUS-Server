import {
  ISteamFriend,
  ISteamGame,
  ISteamPlayerBans,
  ISteamUserInventory,
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
  loccountrycode: string;
  friends: ISteamFriend[] | null;
  vacBans: ISteamPlayerBans | null;
  games: ISteamGame[] | null;
  inventory: any | null;
}
