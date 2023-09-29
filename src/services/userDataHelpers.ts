import {
  ISteamGame,
  ISteamPlayer,
  ISteamPlayerBans,
  ISteamStatsDictionary,
  ISteamUserStatsForGame,
} from "../interfaces/ISteamWorks";
import { GetTimeStampInHours } from "./dateService";

const GetCounterStrike2Game = (
  ownedGames: ISteamGame[] | null,
  cs2Stats: ISteamUserStatsForGame | null
) => {
  if (ownedGames === null) return null;
  const cs2 = ownedGames.find((game) => game.appid === 730);
  if (cs2 === undefined) return null;
  return {
    appid: cs2.appid,
    name: cs2.name,
    playtime_forever: GetTimeStampInHours(cs2.playtime_forever),
    img_icon_url: `https://steamcdn-a.akamaihd.net/steam/apps/${cs2.appid}/capsule_231x87.jpg`,
    stats: GetCounterStrike2Stats(cs2Stats),
  };
};

const GetCounterStrike2Stats = (stats: ISteamUserStatsForGame | null) => {
  if (stats === null) return null;
  const statsDictionary = stats.stats.reduce(
    (result: ISteamStatsDictionary, stat) => {
      result[stat.name] = stat.value;
      return result;
    },
    {}
  );
  return {
    total_wins: statsDictionary["total_wins"],
    total_kills_headshot: statsDictionary["total_kills_headshot"],
    headshot_precentage: Math.round(
      (statsDictionary["total_kills_headshot"] /
        statsDictionary["total_kills"]) *
        100
    ),
    total_kills: statsDictionary["total_kills"],
  };
};

interface ICreateUserParams {
  playerData: ISteamPlayer | null;
  friendsList: ISteamPlayer[] | null;
  playerBans: ISteamPlayerBans | null;
  ownedGames: ISteamGame[] | null;
  steamLevel: number | null;
  totalBadges: number | null;
  cs2Stats: ISteamUserStatsForGame | null;
  steamInventory: null;
}
export const CreateUserForClient = (props: ICreateUserParams) => {
  const {
    playerData,
    friendsList,
    playerBans,
    ownedGames,
    steamLevel,
    totalBadges,
    cs2Stats,
    steamInventory,
  } = props;
  if (playerData === null) return null;

  const cs2 = GetCounterStrike2Game(ownedGames, cs2Stats);

  const fullData = {
    steamid: playerData.steamid,
    personaname: playerData.personaname,
    profileurl: playerData.profileurl,
    avatar: playerData.avatar,
    avatarfull: playerData.avatarfull,
    avatarmedium: playerData.avatarmedium,
    realname: playerData.realname,
    loccountrycode: playerData.loccountrycode,
    country_image: playerData.loccountrycode
      ? `https://flagcdn.com/48x36/${playerData.loccountrycode.toLowerCase()}.png`
      : null,
    timecreated: new Date(+playerData.timecreated * 1000),
    friends: friendsList,
    vacBans: playerBans,
    games:
      ownedGames !== null && ownedGames !== undefined
        ? ownedGames
            .sort((a, b) => b.playtime_forever - a.playtime_forever)
            .sort((a, b) => {
              return b.playtime_forever - a.playtime_forever;
            })
        : null,
    cs2,
    inventory: null,
    // inventory:
    //   steamInventory !== null && steamInventory !== undefined
    //     ? steamInventory.descriptions.map((item) => {
    //         return {
    //           icon_url: `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}`,
    //           icon_url_large: `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url_large}`,
    //           name: item.name,
    //           name_color: item.name_color,
    //           type: item.type,
    //           tradable: item.tradable,
    //           marketable: item.marketable,
    //           tags: item.tags,
    //         };
    //       })
    //     : null,
    totalBadges,
    steamLevel,
    total_games:
      ownedGames !== null && ownedGames !== undefined
        ? ownedGames.length
        : null,
  };
  return fullData;
};
