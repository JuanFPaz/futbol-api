
import type { StoragePath } from "./storage.types.js";

export type RequestLeagueRaw = {
  params: {
    country: string;
  };
  storage: StoragePath;
};

export type RequestGenericRaw = {
  params: {
    league: number;
    season: number;
  };
  storage: StoragePath;
};

// Tipos de los objetos de los Raw!!

export type FixtureMatch = {
  fixture: FixtureInfo;
  league: FixtureLeague;
  teams: FixtureTeams;
  goals: Goals;
  score: Score;
}

export type FixtureInfo = {
  id: number;
  referee: string | null;
  timezone: string;
  date: string; // ISO 8601
  timestamp: number; // segundos (Unix)
  periods: Periods;
  venue: Venue;
  status: FixtureStatus;
}

export type Periods = {
  first: number | null;
  second: number | null;
}

export type Venue = {
  id: number | null;
  name: string | null;
  city: string | null;
}

export type FixtureStatus = {
  long: string; // "Match Finished"
  short: string; // "FT", "NS", "1H", etc.
  elapsed: number | null;
  extra: number | null;
}

export type FixtureLeague = {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
  round: string; // "Apertura - 1"
  standings: boolean;
}

export type FixtureTeams = {
  home: FixtureTeam;
  away: FixtureTeam;
}

export type FixtureTeam = {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null; // null en empate o si no se jugó
}

export type Goals = {
  home: number | null;
  away: number | null;
}

export type Score = {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}
