import {
  ISteamGame,
  ISteamPlayer,
  ISteamPlayerBans,
  ISteamStatsDictionary,
  ISteamUserStatsForGame,
} from "../interfaces/ISteamWorks";
import { IUser } from "../interfaces/IUser";
import { GetTimeStampInHours } from "./dateService";

const GetCounterStrike2Game = (
  ownedGames: ISteamGame[] | null | undefined,
  cs2Stats: ISteamUserStatsForGame | null
) => {
  if (ownedGames === null || ownedGames === undefined) return null;
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
  if (stats.stats === null || stats.stats === undefined) return null;
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

const GetSusInfo = (fullData: IUser) => {
  let totalScore = 0;
  const ban_perc = 100;
  const friends_perc = 10;
  const badges_perc = 10;
  const games_perc = 40;
  const level_perc = 20;
  const years_perc = 15;
  const wins_perc = 20;
  const headshots_perc = 15;
  const kills_perc = 12;
  const total_play_perc = 40;

  const years_of_service =
    new Date().getFullYear() - fullData.timecreated.getFullYear();
  if (fullData.vacBans !== null) {
    if (
      fullData.vacBans.NumberOfVACBans > 0 ||
      fullData.vacBans.NumberOfGameBans > 0
    ) {
      totalScore += ban_perc;

      return totalScore;
    }
  }

  if (
    // fullData.inventory === null &&
    fullData.games === null &&
    fullData.friends === null &&
    fullData.totalBadges === null
  ) {
    totalScore += 95;
    return totalScore;
  }

  if (fullData.cs2 === null && fullData.games !== null) {
    return totalScore;
  }

  if (years_of_service < 3) {
    totalScore += years_perc;
  }

  if (fullData.total_games === null) {
    totalScore += years_perc;
  } else {
    if (fullData.total_games < 3) {
      totalScore += years_perc + games_perc;
    }
  }
  if (fullData.friends === null) {
    totalScore += friends_perc;
  } else {
    if (fullData.friends.length < 5) {
      totalScore += friends_perc;
    }
  }
  if (fullData.games === null) {
    totalScore += games_perc;
  } else {
    if (fullData.games.length < 3) {
      totalScore += games_perc;
    }
  }
  if (fullData.totalBadges === null) {
    totalScore += badges_perc;
  } else {
    if (fullData.totalBadges < 4) {
      totalScore += badges_perc;
    }
  }
  if (fullData.steamLevel === null) {
    totalScore += level_perc;
  } else {
    if (fullData.steamLevel < 5) {
      totalScore += level_perc;
    }
  }
  if (fullData.cs2 !== null) {
    if (fullData.cs2.stats === null) {
      totalScore += (wins_perc + headshots_perc + kills_perc) / 3;
    } else {
      if (wins_perc > 60) {
        totalScore +=
          (wins_perc + headshots_perc + kills_perc + years_perc) / 4;
      }
    }
    if (fullData.cs2.playtime_forever < 600) {
      totalScore += total_play_perc;
    }
  }

  return totalScore > 100 ? 100 : Math.round(totalScore);
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
        ? ownedGames.sort((a, b) => b.playtime_forever - a.playtime_forever)
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
    cheater_percentage: 0,
    steamLevel,
    total_games:
      ownedGames !== null && ownedGames !== undefined
        ? ownedGames.length
        : null,
  } as IUser;

  const cheater_percentage = GetSusInfo(fullData);

  return { ...fullData, cheater_percentage };
};
