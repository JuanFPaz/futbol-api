import { writeFile, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const PATH_MAIN = join(process.cwd(), "src", "api");
const PATH_DATA = join(process.cwd(), "src", "data");

type Team = {
  rank: number;
  points: number;
  goalsDiff: number;
  group: string;
  team: {
    name: string;
  };
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
};

type ResponseAPI = {
  response: [
    {
      league: {
        standings: [
          [
            {
              group: string;
            },
          ],
        ];
      };
    },
  ];
};
export default async function miau(
  country: string,
  season: string,
  league: string,
  tournament?: string,
) {
  // Primero ir al directorio que buscamos leer
  const DIR_PATH = join(PATH_MAIN, country, season, league);

  const STANDINGS_PATH = join(DIR_PATH, "standings.json");

  let STANDINGS: Team[];
  try {
    const STANDING_FILE = await readFile(STANDINGS_PATH, "utf-8");
    //renombramos la propiedad response del JSON como rounds.
    const {
      response: [
        {
          league: { standings },
        },
      ],
    }: ResponseAPI = JSON.parse(STANDING_FILE);

    STANDINGS = standings.flatMap((st) => {
      const stFilter = st
        .filter((stt) => stt.group.toLowerCase().startsWith(tournament!))
        .map((stt) => {
          return { ...stt, group: "Liga Profesional Argentina - Tabla Anual" };
        });
      return stFilter;
    }) as Team[];
  } catch (error) {
    console.error("Ocurrio un error leyendo el dir " + STANDINGS_PATH);
    console.error(error);
    process.exit(0);
  }

  //SORT de la tabla:
  STANDINGS.sort((teamA, teamB) => {
    if (teamA.team.name > teamB.team.name) return 1;
    if (teamA.team.name < teamB.team.name) return -1;
    return 0;
  }).forEach((team, idx) => {
    team.rank = idx + 1;
    team.points = 0;
    team.goalsDiff = 0;
    team.description = null;
    team.all = {
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goals: { for: 0, against: 0 },
    };
    team.home = {
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goals: { for: 0, against: 0 },
    };
    team.away = {
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goals: { for: 0, against: 0 },
    };
  });

  const PATH_WRITE = join(
    PATH_DATA,
    country,
    season,
    league,
    tournament!,
    `tabla-anual-${tournament ?? league}.json`,
  );
  await writeFile(PATH_WRITE, JSON.stringify(STANDINGS));
}

export async function tablaAnualDos(
  country: string,
  season: string,
  league: string,
  tournament?: string,
) {
  // Primero ir al directorio que buscamos leer
  const DIR_PATH = join(PATH_MAIN, country, season, league);

  const STANDINGS_PATH = join(DIR_PATH, "standings.json");

  let STANDINGS: Team[];

  let STANDING_ANUAL: Team[];
  let STANDING_ZONA_A: Team[];
  let STANDING_ZONA_B: Team[];
  try {
    const STANDING_FILE = await readFile(STANDINGS_PATH, "utf-8");
    //Destructuramos el respondes para directamente quedarnos con los STANDINGS.
    const {
      response: [
        {
          league: { standings },
        },
      ],
    }: ResponseAPI = JSON.parse(STANDING_FILE);

    STANDINGS = standings.flatMap((st) => {
      st.forEach((stt) => {
        stt.group = "Liga Profesional Argentina - Tabla Anual";
      });
      return st;
    }) as Team[];
  } catch (error) {
    console.error("Ocurrio un error leyendo el dir " + STANDINGS_PATH);
    console.error(error);
    process.exit(0);
  }

  //SORT de la tabla:
  STANDINGS.sort((teamA, teamB) => {
    if (teamA.team.name > teamB.team.name) return 1;
    if (teamA.team.name < teamB.team.name) return -1;
    return 0;
  }).forEach((team, idx) => {
    team.rank = idx + 1;
    team.points = 0;
    team.goalsDiff = 0;
    team.description = null;
    team.all = {
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goals: { for: 0, against: 0 },
    };
    team.home = {
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goals: { for: 0, against: 0 },
    };
    team.away = {
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goals: { for: 0, against: 0 },
    };
  });

  const PATH_WRITE = join(
    PATH_DATA,
    country,
    season,
    league,
    tournament!,
    `tabla-anual-${tournament ?? league}.json`,
  );
  await writeFile(PATH_WRITE, JSON.stringify(STANDINGS));
}
