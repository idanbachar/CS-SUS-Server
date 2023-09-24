export interface ISteamPlayer {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatarfull: string;
  realname: string;
  timecreated: number;
  personastateflags: number;
  loccountrycode: string;
}

export interface ISteamFriend {
  steamid: string;
  relationship: string;
  friend_since: number;
}

export interface ISteamPlayerBans {
  SteamId: string;
  CommunityBanned: boolean;
  VACBanned: boolean;
  NumberOfVACBans: number;
  DaysSinceLastBan: number;
  NumberOfGameBans: number;
  EconomyBan: string;
}

export interface ISteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  rtime_last_played: number;
  content_descriptorids: number[];
  playtime_disconnected: number;
}

export interface ISteamUserStatsForGame {
  steamID: string;
  gameName: string;
  stats: [
    {
      name: string;
      value: number;
    }
  ];
}
