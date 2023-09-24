import axios from "axios";
import {
  ISteamFriend,
  ISteamGame,
  ISteamPlayer,
  ISteamPlayerBans,
  ISteamUserInventory,
  ISteamUserStatsForGame,
} from "../interfaces/ISteamWorks";
import { API_KEY, STEAM_BASE_URL } from "./general";
import { IUser } from "../interfaces/IUser";

export const GetFullUserData = async (steamId: string) => {
  try {
    const data = await Promise.all([
      GetPlayerData(steamId),
      GetFriendsList(steamId),
      GetPlayerBans(steamId),
      GetOwnedGames(steamId),
      GetSteamInventory(steamId, "730"),
    ]);

    let fullData: IUser | null = null;
    const playerData = data[0];
    const friendsList = data[1];
    const playerBans = data[2];
    const ownedGames = data[3];
    const steamInventory = data[4];

    if (playerData !== null) {
      fullData = {
        steamid: playerData.steamid,
        personaname: playerData.personaname,
        profileurl: playerData.profileurl,
        avatar: playerData.avatar,
        avatarfull: playerData.avatarfull,
        avatarmedium: playerData.avatarmedium,
        realname: playerData.realname,
        loccountrycode: playerData.loccountrycode,
        timecreated: new Date(+playerData.timecreated * 1000),
        friends:
          friendsList !== null
            ? friendsList.map((friend) => {
                return {
                  ...friend,
                  friend_since: new Date(+friend.friend_since * 1000),
                };
              })
            : null,
        vacBans: playerBans,
        games:
          ownedGames !== null
            ? ownedGames.map((game) => {
                return {
                  ...game,
                  playtime_2weeks: game.playtime_2weeks
                    ? Math.round(game.playtime_2weeks / 60)
                    : undefined,
                  playtime_forever:
                    game.playtime_forever > 0
                      ? Math.round(game.playtime_forever / 60)
                      : 0,
                  playtime_windows_forever:
                    game.playtime_windows_forever > 0
                      ? Math.round(game.playtime_windows_forever / 60)
                      : 0,
                  playtime_mac_forever:
                    game.playtime_mac_forever > 0
                      ? Math.round(game.playtime_mac_forever / 60)
                      : 0,
                  playtime_linux_forever:
                    game.playtime_linux_forever > 0
                      ? Math.round(game.playtime_linux_forever / 60)
                      : 0,
                  rtime_last_played: new Date(+game.rtime_last_played * 1000),
                  img_icon_url: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
                };
              })
            : null,
        inventory:
          steamInventory !== null
            ? steamInventory.descriptions.map((item) => {
                return {
                  icon_url: `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}`,
                  icon_url_large: `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url_large}`,
                  name: item.name,
                  name_color: item.name_color,
                  type: item.type,
                  tradable: item.tradable,
                  marketable: item.marketable,
                  tags: item.tags,
                };
              })
            : null,
      };
    }
    return fullData;
  } catch (error) {
    console.log("error", error);
  }
};

export const GetPlayerData = async (steamId: string) => {
  const endpoint = `${STEAM_BASE_URL}/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${steamId}`;
  try {
    const response = await axios.get(endpoint);
    const players = response.data.response.players as ISteamPlayer[];
    if (players && players.length > 0) {
      return players[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching Steam user data:", error);
    return null;
  }
};

export const GetFriendsList = async (steamId: string) => {
  const endpoint = `${STEAM_BASE_URL}/ISteamUser/GetFriendList/v0001/?key=${API_KEY}&steamid=${steamId}&relationship=friend`;
  try {
    const response = await axios.get(endpoint);
    return response.data.friendslist.friends as ISteamFriend[];
  } catch (error) {
    console.error("Error fetching friend list:", error);
    return null;
  }
};

export const GetPlayerBans = async (steamId: string) => {
  const endpoint = `${STEAM_BASE_URL}/ISteamUser/GetPlayerBans/v1/?key=${API_KEY}&steamids=${steamId}`;
  try {
    const response = await axios.get(endpoint);
    return response.data.players[0] as ISteamPlayerBans;
  } catch (error) {
    console.error("Error fetching player bans:", error);
    return null;
  }
};

export const GetOwnedGames = async (steamId: string) => {
  const endpoint = `${STEAM_BASE_URL}/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamId}&include_appinfo=1`;
  try {
    const response = await axios.get(endpoint);
    return response.data.response.games as ISteamGame[];
  } catch (error) {
    console.error("Error fetching owned games:", error);
    return null;
  }
};

export const GetUserStatsForGame = async (appId: string, steamId: string) => {
  const endpoint = `${STEAM_BASE_URL}/ISteamUserStats/GetUserStatsForGame/v0002/?key=${API_KEY}&appid=${appId}&steamid=${steamId}`;
  try {
    const response = await axios.get(endpoint);
    return response.data.playerstats as ISteamUserStatsForGame[];
  } catch (error) {
    console.error("Error fetching game schema:", error);
    return null;
  }
};

export const GetSteamInventory = async (steamId: string, appID: string) => {
  const endpoint = `https://steamcommunity.com/inventory/${steamId}/${appID}/2?l=english&count=5000`;
  try {
    const response = await axios.get(endpoint);
    return response.data as ISteamUserInventory;
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    return null;
  }
};
