import { writeFile, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const PATH_MAIN = join(process.cwd(), "src", "api");
const PATH_DATA = join(process.cwd(), "src", "data");

export interface FixtureMatch {
  fixture: FixtureInfo;
  league: FixtureLeague;
  teams: FixtureTeams;
  goals: Goals;
  score: Score;
}

export interface FixtureInfo {
  id: number;
  referee: string | null;
  timezone: string;
  date: string; // ISO 8601
  timestamp: number; // segundos (Unix)
  periods: Periods;
  venue: Venue;
  status: FixtureStatus;
}

export interface Periods {
  first: number | null;
  second: number | null;
}

export interface Venue {
  id: number | null;
  name: string | null;
  city: string | null;
}

export interface FixtureStatus {
  long: string; // "Match Finished"
  short: string; // "FT", "NS", "1H", etc.
  elapsed: number | null;
  extra: number | null;
}

export interface FixtureLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
  round: string; // "Apertura - 1"
  standings: boolean;
}

export interface FixtureTeams {
  home: FixtureTeam;
  away: FixtureTeam;
}

export interface FixtureTeam {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null; // null en empate o si no se jugó
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}

export default async function main(
  country: string,
  season: string,
  league: string,
  tournament?: string,
) {
  // Primero ir al directorio que buscamos leer
  const DIR_PATH = join(PATH_MAIN, country, season, league);

  const FIXTURE_PATH = join(DIR_PATH, "fixture.json");

  const FIXTURE_ROUNDS_PATH = join(DIR_PATH, "fixture-rounds.json");

  let FIXTURE;
  try {
    const ROUNDS_FILE = await readFile(FIXTURE_ROUNDS_PATH, "utf-8");
    //renombramos la propiedad response del JSON como rounds.
    const { response }: { response: string[] } = JSON.parse(ROUNDS_FILE);
    FIXTURE = response.filter((r) => r.toLowerCase().startsWith(tournament!));
  } catch (error) {
    console.error("Ocurrio un error leyendo el dir " + FIXTURE_ROUNDS_PATH);
    console.error(error);
    process.exit(0);
  }

  let matchs: FixtureMatch[];
  try {
    const FIXTURES_FILE = await readFile(FIXTURE_PATH, "utf-8");
    const { response } = JSON.parse(FIXTURES_FILE);
    matchs = response;
  } catch (error) {
    console.error("Ocurrio un error leyendo el dir " + FIXTURE_PATH);
    console.error(error);
    process.exit(0);
  }

  const esFaseRegular = (r: string) => / - \d+$/.test(r);

  const aperturaRegu = FIXTURE.filter(esFaseRegular);
  const aperturaPlayoffs = FIXTURE.filter((ap) => !esFaseRegular(ap));

  const rondasRegu = aperturaRegu.map((ap, idx) => {
    const partidos = matchs.filter((m) => m.league.round === ap);
    return { ronda: `Fecha ${idx + 1}`, partidos: partidos };
  });

  const rondasPlayoffs = aperturaPlayoffs.map((ap, idx) => {
    const rondaName = [
      "Octavos de Final",
      "Cuartos de Final",
      "Semifinal",
      "Final",
    ];
    const partidos = matchs.filter((m) => m.league.round === ap);
    return { ronda: rondaName[idx], partidos: partidos };
  });

  const PATH_WRITE = join(
    PATH_DATA,
    country,
    season,
    league,
    tournament!,
    `fixture-${tournament ?? league}.json`,
  );

  const FIXTURE_COMPLETO = {
    formato: "regular-playoffs",
    total: 2,
    fases: [
      { fase: "regular", total: rondasRegu.length, rondas: rondasRegu },
      {
        fase: "playoffs",
        total: rondasPlayoffs.length,
        rondas: rondasPlayoffs,
      },
    ],
  };
  await writeFile(PATH_WRITE, JSON.stringify(FIXTURE_COMPLETO));
}

export async function FixtureGeneric(
  country: string,
  season: string,
  league: string,
  tournament: string,
) {
  // Primero ir al directorio que buscamos leer
  const DIR_PATH = join(PATH_MAIN, country, season, league);

  const FIXTURE_PATH = join(DIR_PATH, "fixture.json");

  const FIXTURE_ROUNDS_PATH = join(DIR_PATH, "fixture-rounds.json");

  let FIXTURE;
  try {
    const ROUNDS_FILE = await readFile(FIXTURE_ROUNDS_PATH, "utf-8");
    //renombramos la propiedad response del JSON como rounds.
    const { response }: { response: string[] } = JSON.parse(ROUNDS_FILE);
    FIXTURE = response.filter((r) => r.startsWith(tournament === 'apertura' ? '1st Phase' : '2nd Phase'));
  } catch (error) {
    console.error("Ocurrio un error leyendo el dir " + FIXTURE_ROUNDS_PATH);
    console.error(error);
    process.exit(0);
  }

  let matchs: FixtureMatch[];
  try {
    const FIXTURES_FILE = await readFile(FIXTURE_PATH, "utf-8");
    const { response } = JSON.parse(FIXTURES_FILE);
    matchs = response;
  } catch (error) {
    console.error("Ocurrio un error leyendo el dir " + FIXTURE_PATH);
    console.error(error);
    process.exit(0);
  }

  const esFaseRegular = (r: string) => / - \d+$/.test(r);

  const aperturaRegu = FIXTURE.filter(esFaseRegular);
  const aperturaPlayoffs = FIXTURE.filter((ap) => !esFaseRegular(ap));

  const rondasRegu = aperturaRegu.map((ap, idx) => {
    const partidos = matchs.filter((m) => m.league.round === ap);
    return { ronda: `Fecha ${idx + 1}`, partidos: partidos };
  });

  const rondasPlayoffs = aperturaPlayoffs.map((ap, idx) => {
    const rondaName = [
      "Octavos de Final",
      "Cuartos de Final",
      "Semifinal",
      "Final",
    ];
    const partidos = matchs.filter((m) => m.league.round === ap);
    return { ronda: rondaName[idx], partidos: partidos };
  });

  const PATH_WRITE = join(
    PATH_DATA,
    country,
    season,
    league,
    tournament!,
    `fixture-${tournament}.json`,
  );

  const FIXTURE_COMPLETO = {
    formato: "regular-playoffs",
    total: 2,
    fases: [
      { fase: "regular", total: rondasRegu.length, rondas: rondasRegu },
      {
        fase: "playoffs",
        total: rondasPlayoffs.length,
        rondas: rondasPlayoffs,
      },
    ],
  };
  await writeFile(PATH_WRITE, JSON.stringify(FIXTURE_COMPLETO));
}
