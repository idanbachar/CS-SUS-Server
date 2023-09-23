import axios from "axios";
import { ISteamPlayer } from "../interfaces/ISteamWorks";
import { API_KEY, STEAM_BASE_URL } from "./general";

export const GetPlayerSummaries = async (steamId: string) => {
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
