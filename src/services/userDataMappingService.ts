import {
  ISteamGame,
  ISteamPlayer,
  ISteamPlayerBans,
  ISteamStatsDictionary,
  ISteamUserStatsForGame,
} from "../interfaces/ISteamWorks";
import { GetTimeStampInHours } from "./dateService";

interface ICreateUserParams {
  playerData: ISteamPlayer | null;
  friendsList: ISteamPlayer[] | null;
  playerBans: ISteamPlayerBans | null;
  ownedGames: ISteamGame[] | null;
  steamLevel: number | null;
  totalBadges: number | null;
  csgoStats: ISteamUserStatsForGame | null;
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
    csgoStats,
    steamInventory,
  } = props;
  if (playerData === null) return null;

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
            .slice(0, 5)
            .map((game) => {
              return {
                ...game,
                playtime_2weeks: GetTimeStampInHours(game.playtime_2weeks),
                playtime_forever: GetTimeStampInHours(game.playtime_forever),
                playtime_windows_forever: GetTimeStampInHours(
                  game.playtime_windows_forever
                ),
                playtime_mac_forever: GetTimeStampInHours(
                  game.playtime_mac_forever
                ),
                playtime_linux_forever: GetTimeStampInHours(
                  game.playtime_linux_forever
                ),
                rtime_last_played: new Date(+game.rtime_last_played * 1000),
                img_icon_url: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/capsule_231x87.jpg`,
              };
            })
            .sort((a, b) => {
              return b.playtime_forever - a.playtime_forever;
            })
        : null,
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
    csgoStats:
      csgoStats !== null && csgoStats !== undefined
        ? csgoStats.stats.reduce((result: ISteamStatsDictionary, stat) => {
            result[stat.name] = stat.value;
            return result;
          }, {})
        : null,
    total_games:
      ownedGames !== null && ownedGames !== undefined
        ? ownedGames.length
        : null,
  };
  return fullData;
};
