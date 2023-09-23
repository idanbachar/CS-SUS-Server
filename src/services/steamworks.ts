import axios from "axios";
import { ISteamPlayer } from "../interfaces/ISteamWorks";

const API_KEY = process.env.API_KEY;
const STEAM_BASE_URL = process.env.STEAM_BASE_URL;

export const checkIsSteamProfileValid = (steamURL: string) => {
  const regex =
    /^https:\/\/steamcommunity\.com\/(id\/[a-zA-Z0-9_-]+|profiles\/[0-9]{17})\/?$/;
  return regex.test(steamURL);
};

async function resolveVanityURL(vanityName: string) {
  const endpoint = `${STEAM_BASE_URL}/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${vanityName}`;

  try {
    const response = await axios.get(endpoint);
    if (response.data.response.success === 1) {
      return response.data.response.steamid;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error resolving vanity URL:", error);
    return null;
  }
}

export const getSteamIDFromURL = async (steamURL: string) => {
  const regex =
    /^https:\/\/steamcommunity\.com\/(id\/([a-zA-Z0-9_-]+)|profiles\/([0-9]{17}))\/?$/;
  const match = steamURL.match(regex);

  let steamID64: string | null = null;
  let vanityName: string | null = null;

  if (match) {
    vanityName = match[2];
    steamID64 = match[3];
  }

  if (!steamID64 && vanityName) {
    const steamId = await resolveVanityURL(vanityName);
    return steamId;
  }
  return "";
};

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
