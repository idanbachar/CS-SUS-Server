import axios from "axios";
import {
  ISteamFriend,
  ISteamGame,
  ISteamPlayer,
  ISteamPlayerBans,
  ISteamUserStatsForGame,
} from "../interfaces/ISteamWorks";
import { API_KEY, STEAM_BASE_URL } from "./general";

export const GetPlayerData = async (steamId: string) => {
  const url = `${STEAM_BASE_URL}/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${steamId}`;
  try {
    const response = await axios.get(url);
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

// total_planted_bombs;
