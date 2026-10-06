import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";

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
const PATH_MAIN = join(process.cwd(), "src", "data");

export default async function main(
  country: string,
  season: string,
  league: string,
  tournament: string,
) {
  // Primero ir al directorio que buscamos leer
  const DIR_STANDING_PATH = join(
    PATH_MAIN,
    country,
    season,
    league,
    "apertura",
  );
  const DIR_FIXTURE = join(PATH_MAIN, country, season, league, tournament);

  const STANDINGS_ANUAL_PATH = join(
    DIR_STANDING_PATH,
    `tabla-anual-apertura.json`,
  );

  let STANDINGS_ANUAL: [
    {
      rank: number;
      points: number;
      goalsDiff: number;
      group: string;
      team: { id: number; name: string };
      description: string | null;
      all: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: { for: number; against: number };
      };
      home: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: { for: number; against: number };
      };
      away: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: { for: number; against: number };
      };
    },
  ];
  try {
    const STANDING_FILE = await readFile(STANDINGS_ANUAL_PATH, "utf-8");
    STANDINGS_ANUAL = JSON.parse(STANDING_FILE);
  } catch (error) {
    console.error("Ocurrio un error leyendo el dir " + STANDINGS_ANUAL_PATH);
    console.error(error);
    process.exit(0);
  }

  const FIXTURE_PATH = join(DIR_FIXTURE, `fixture-${tournament}.json`);

  let FIXTURE_REGU: {
    fase: string;
    total: number;
    rondas: [
      {
        ronda: string;
        partidos: FixtureMatch[];
      },
    ];
  };

  try {
    const FIXTURE_FILE = await readFile(FIXTURE_PATH, "utf-8");
    const { fases } = JSON.parse(FIXTURE_FILE) as {
      fases: [
        {
          fase: string;
          total: number;
          rondas: [
            {
              ronda: string;
              partidos: FixtureMatch[];
            },
          ];
        },
      ];
    };
    const [filterFase] = fases.filter((f) => f.fase === "regular");
    FIXTURE_REGU = filterFase;
  } catch (error) {
    console.error("Ocurrio un error leyendo el dir " + FIXTURE_PATH);
    console.error(error);
    process.exit(0);
  }

  //Comenzamos la sumatoria:
  //Por cada Ronda (fecha), vamos a ver los partidos:

  FIXTURE_REGU.rondas.forEach(({ partidos }) => {
    partidos.forEach((p) => {
      if (p.fixture.status.long === "Match Finished") {
        const teamHome = STANDINGS_ANUAL.find(
          (st) => st.team.id === p.teams.home.id,
        )!;
        const teamAway = STANDINGS_ANUAL.find(
          (st) => st.team.id === p.teams.away.id,
        )!;

        if (p.teams.home.winner === true) {
          teamHome.points += 3;
          teamHome.goalsDiff += p.goals.home! - p.goals.away!;
          teamHome.all.played += 1;
          teamHome.all.win += 1;
          teamHome.all.goals.for += p.goals.home!;
          teamHome.all.goals.against += p.goals.away!;
          teamHome.home.played += 1;
          teamHome.home.win += 1;
          teamHome.home.goals.for += p.goals.home!;
          teamHome.home.goals.against += p.goals.away!;
        }

        if (p.teams.home.winner === false) {
          teamHome.points += 0;
          teamHome.goalsDiff += p.goals.home! - p.goals.away!;
          teamHome.all.played += 1;
          teamHome.all.lose += 1;
          teamHome.all.goals.for += p.goals.home!;
          teamHome.all.goals.against += p.goals.away!;
          teamHome.home.played += 1;
          teamHome.home.lose += 1;
          teamHome.home.goals.for += p.goals.home!;
          teamHome.home.goals.against += p.goals.away!;
        }

        if (p.teams.away.winner === true) {
          teamAway.points += 3;
          teamAway.goalsDiff += p.goals.away! - p.goals.home!;
          teamAway.all.played += 1;
          teamAway.all.win += 1;
          teamAway.all.goals.for += p.goals.away!;
          teamAway.all.goals.against += p.goals.home!;
          teamAway.away.played += 1;
          teamAway.away.win += 1;
          teamAway.away.goals.for += p.goals.away!;
          teamAway.away.goals.against += p.goals.home!;
        }

        if (p.teams.away.winner === false) {
          teamAway.points += 0;
          teamAway.goalsDiff += (p.goals.away! - p.goals.home!);
          teamAway.all.played += 1;
          teamAway.all.lose += 1;
          teamAway.all.goals.for += p.goals.away!;
          teamAway.all.goals.against += p.goals.home!;
          teamAway.away.played += 1;
          teamAway.away.lose += 1;
          teamAway.away.goals.for += p.goals.away!;
          teamAway.away.goals.against += p.goals.home!;
        }

        if (p.teams.home.winner === null && p.teams.away.winner === null) {
          teamHome.points += 1;
          teamHome.goalsDiff += p.goals.home! - p.goals.away!;
          teamHome.all.played += 1;
          teamHome.all.draw += 1;
          teamHome.all.goals.for += p.goals.home!;
          teamHome.all.goals.against += p.goals.away!;
          teamHome.home.played += 1;
          teamHome.home.draw += 1;
          teamHome.home.goals.for += p.goals.home!;
          teamHome.home.goals.against += p.goals.away!;

          teamAway.points += 1;
          teamAway.goalsDiff += p.goals.away! - p.goals.home!;
          teamAway.all.played += 1;
          teamAway.all.draw += 1;
          teamAway.all.goals.for += p.goals.away!;
          teamAway.all.goals.against += p.goals.home!;
          teamAway.away.played += 1;
          teamAway.away.draw += 1;
          teamAway.away.goals.for += p.goals.away!;
          teamAway.away.goals.against += p.goals.home!;
        }

        const homeIndex = STANDINGS_ANUAL.findIndex(
          (item) => item.team.id === teamHome.team.id,
        );
        const awayIndex = STANDINGS_ANUAL.findIndex(
          (item) => item.team.id === teamAway.team.id,
        );

        if (homeIndex !== -1) STANDINGS_ANUAL[homeIndex] = teamHome;
        if (awayIndex !== -1) STANDINGS_ANUAL[awayIndex] = teamAway;

        STANDINGS_ANUAL.sort((teamA, teamB) => {
          if (teamA.points < teamB.points) return 1;

          if (teamA.points > teamB.points) return -1;

          if (teamA.goalsDiff < teamB.goalsDiff) return 1;

          if (teamA.goalsDiff > teamB.goalsDiff) return -1;

          return 0;
        }).forEach((team, idx) => {
          team.rank = idx + 1;
        });
      }
    });
  });

  const PATH_WRITE = join(
    PATH_MAIN,
    country,
    season,
    league,
    tournament,
    `tabla-anual-${tournament ?? league}.json`,
  );
  await writeFile(PATH_WRITE, JSON.stringify(STANDINGS_ANUAL));
}
