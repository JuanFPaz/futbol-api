import { RequestCreateView, RequestUpdateView } from "../types/view.types.js";
import {
  PATH_DIR_VIEW,
  PATH_READ_RAW,
  PATH_READ_VIEW,
  PATH_WRITE_VIEW,
} from "../utils/paths.js";
import { FixtureMatch } from "../types/raw.types.js";
import {
  esClausuraApertura,
  esCopaDeLaLiga,
  esEmpate,
  esLigaProfesional,
  esPartidoFinalizado,
  esTemporada,
  esVictoriaLocal,
  esVictoriaVisitante,
} from "../helpers/condicionales.js";
import { RawRepository } from "../repository/raw.repository.js";
import { ViewRepository } from "../repository/view.repository.js";
import {
  sumatoriaEmpate,
  sumatoriaVictoriaLocal,
  sumatoriaVictoriaVisitante,
} from "../helpers/sumatoria.js";
import {
  filtrarRondasArg2025,
  filtrarRondasArg2026,
  armarFixtureRegularPlayoffs,
  armarFixtureRegular,
  armarDesempate,
  PLAYOFF_OCTAVOS,
  PLAYOFF_CUARTOS,
} from "../helpers/rondas.js";
type Team = {
  rank: number;
  points: number;
  goalsDiff: number;
  group: string;
  team: {
    id: number;
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

type Standing = Team[];

type Fase = {
  fase: string;
  total: number;
  rondas: [
    {
      ronda: string;
      partidos: FixtureMatch[];
    },
  ];
};

type Fixture = {
  format: string;
  fases: Fase[];
};

export default class ViewService {
  //Renombre guardarFixture a guardarArchivo, ya que funciona para createStanding tmb.
  private static async guardarArchivo(
    storage: RequestCreateView["storage"],
    fixture: object,
  ) {
    await ViewRepository.createFile(
      PATH_DIR_VIEW(storage),
      PATH_WRITE_VIEW(storage),
      fixture,
    );
  }

  static async createFixture({ path, storage }: RequestCreateView) {
    const { country, league, season, tournament } = storage.directory;

    const FIXTURE_PATH = PATH_READ_RAW(path);
    const FIXTURE_ROUNDS_PATH = PATH_READ_RAW({
      ...path,
      filename: `fixture-rounds-${path.league}.json`,
    });

    const ROUND_DATA =
      await RawRepository.readFixture<string[]>(FIXTURE_ROUNDS_PATH);
    const FIXTURE_DATA =
      await RawRepository.readFixture<FixtureMatch[]>(FIXTURE_PATH);

    switch (country) {
      case "arg": {
        // Apertura / Clausura (2025 y 2026)
        if (esClausuraApertura(tournament)) {
          let rondas = ROUND_DATA;

          if (esTemporada(season!, 2026)) {
            rondas = filtrarRondasArg2026(ROUND_DATA, tournament!);
          }
          if (esTemporada(season!, 2025)) {
            rondas = filtrarRondasArg2025(ROUND_DATA, tournament!);
          }

          console.log(rondas);

          const FIXTURE = armarFixtureRegularPlayoffs(
            rondas,
            FIXTURE_DATA,
            PLAYOFF_OCTAVOS,
          );
          await ViewService.guardarArchivo(storage, FIXTURE);
          return;
        }

        if (esCopaDeLaLiga(league)) {
          if (esTemporada(season!, 2022) || esTemporada(season!, 2021)) {
            const rondas = ROUND_DATA.filter((r) => r.startsWith("1st Phase"));
            const FIXTURE = armarFixtureRegularPlayoffs(
              rondas,
              FIXTURE_DATA,
              PLAYOFF_CUARTOS,
            );
            await ViewService.guardarArchivo(storage, FIXTURE);
            return;
          }

          if (esTemporada(season!, 2023)) {
            const FIXTURE = armarFixtureRegularPlayoffs(
              ROUND_DATA,
              FIXTURE_DATA,
              PLAYOFF_CUARTOS,
            );
            // 2023 tiene una fase más: el desempate por el descenso
            FIXTURE.fases.push({
              fase: "relegation",
              rondas: armarDesempate(ROUND_DATA, FIXTURE_DATA),
            });
            await ViewService.guardarArchivo(storage, FIXTURE);
            return;
          }

          if (esTemporada(season!, 2024)) {
            const FIXTURE = armarFixtureRegularPlayoffs(
              ROUND_DATA,
              FIXTURE_DATA,
              PLAYOFF_CUARTOS,
            );
            await ViewService.guardarArchivo(storage, FIXTURE);
            return;
          }
        }

        if (esLigaProfesional(league)) {
          let rondas = ROUND_DATA;

          if (esTemporada(season!, 2022) || esTemporada(season!, 2021)) {
            rondas = ROUND_DATA.filter((r) => r.startsWith("2nd Phase"));
          }

          const FIXTURE = armarFixtureRegular(rondas, FIXTURE_DATA);
          await ViewService.guardarArchivo(storage, FIXTURE);
          return;
        }
      }
      default: {
        throw new Error("No se llego a crear absolutamende nada");
      }
    }
  }

  static async createTablas({ path, storage }: RequestCreateView) {
    const { country, league, season, tournament } = storage.directory;

    const STANDING_PATH = PATH_READ_RAW(path);

    let STANDING_DATA =
      await RawRepository.readStanding<Standing[]>(STANDING_PATH);

    switch (country) {
      case "arg": {
        if (esClausuraApertura(tournament)) {
          let tabla;
          if (esTemporada(season!, 2026)) {
            tabla = STANDING_DATA.flatMap((standing) => {
              let tablaFiltrada = standing.filter((team) =>
                team.group.toLowerCase().startsWith(tournament),
              );
              return tablaFiltrada as Standing;
            })
              .sort((teamA, teamB) => {
                if (teamA.team.name > teamB.team.name) return 1;
                if (teamA.team.name < teamB.team.name) return -1;
                return 0;
              })
              .map((team, idx) => {
                return {
                  ...team,
                  rank: idx + 1,
                  points: 0,
                  goalsDiff: 0,
                  description: null,
                  all: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  home: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  away: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  group: "Liga Profesional Argentina - Tabla anual",
                };
              });

            await ViewService.guardarArchivo(storage, tabla);
          }
          if (esTemporada(season!, 2025)) {
            tabla = STANDING_DATA.flat()
              .sort((teamA, teamB) => {
                if (teamA.team.name > teamB.team.name) return 1;
                if (teamA.team.name < teamB.team.name) return -1;
                return 0;
              })
              .map((team, idx) => {
                return {
                  ...team,
                  rank: idx + 1,
                  points: 0,
                  goalsDiff: 0,
                  description: null,
                  all: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  home: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  away: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  group: "Liga Profesional Argentina - Tabla anual",
                };
              });

            await ViewService.guardarArchivo(storage, tabla);
          }
          return;
        }

        if (esCopaDeLaLiga(league)) {
          let tabla;

          if (esTemporada(season!, 2024) || esTemporada(season!, 2023)) {
            tabla = STANDING_DATA.flat()
              .sort((teamA, teamB) => {
                if (teamA.team.name > teamB.team.name) return 1;
                if (teamA.team.name < teamB.team.name) return -1;
                return 0;
              })
              .map((team, idx) => {
                return {
                  ...team,
                  rank: idx + 1,
                  points: 0,
                  goalsDiff: 0,
                  description: null,
                  all: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  home: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  away: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  group: "Copa Liga Profesional Argentina - Tabla anual",
                };
              });

            await ViewService.guardarArchivo(storage, tabla);
          }

          if (esTemporada(season!, 2022) || esTemporada(season!, 2021)) {
            tabla = STANDING_DATA[0]
              .sort((teamA, teamB) => {
                if (teamA.team.name > teamB.team.name) return 1;
                if (teamA.team.name < teamB.team.name) return -1;
                return 0;
              })
              .map((team, idx) => {
                return {
                  ...team,
                  rank: idx + 1,
                  points: 0,
                  goalsDiff: 0,
                  description: null,
                  all: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  home: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  away: {
                    played: 0,
                    win: 0,
                    draw: 0,
                    lose: 0,
                    goals: { for: 0, against: 0 },
                  },
                  group: "Copa Liga Profesional Argentina - Tabla anual",
                };
              });
            await ViewService.guardarArchivo(storage, tabla);
          }

          return;
        }

        if (esLigaProfesional(league)) {
          let tabla;
          tabla = STANDING_DATA[0]
            .sort((teamA, teamB) => {
              if (teamA.team.name > teamB.team.name) return 1;
              if (teamA.team.name < teamB.team.name) return -1;
              return 0;
            })
            .map((team, idx) => {
              return {
                ...team,
                rank: idx + 1,
                points: 0,
                goalsDiff: 0,
                description: null,
                all: {
                  played: 0,
                  win: 0,
                  draw: 0,
                  lose: 0,
                  goals: { for: 0, against: 0 },
                },
                home: {
                  played: 0,
                  win: 0,
                  draw: 0,
                  lose: 0,
                  goals: { for: 0, against: 0 },
                },
                away: {
                  played: 0,
                  win: 0,
                  draw: 0,
                  lose: 0,
                  goals: { for: 0, against: 0 },
                },
                group: "Liga Profesional Argentina - Tabla anual",
              };
            });
          await ViewService.guardarArchivo(storage, tabla);

          return;
        }
      }

      default: {
        throw new Error("Miau miau");
      }
    }
  }

  static async updateTablas({ path, storage }: RequestUpdateView) {
    const { country, league, season, tournament } = storage.directory;

    switch (country) {
      case "arg": {
        let STANDING_PATH: string = "";
        let FIXTURE_PATH: string = "";

        if (esClausuraApertura(tournament)) {
          STANDING_PATH = PATH_READ_VIEW({
            ...path,
            tournament: "apertura",
            filename: "tabla-anual-apertura.json",
          });

          FIXTURE_PATH = PATH_READ_VIEW({
            ...path,
            filename: `fixture-${path.tournament}.json`,
          });

          //harcodeadisimo
          const FIXTURE_REGULAR =
            await ViewRepository.readFixtureRegular<Fase>(FIXTURE_PATH);

          const STANDINGS_ANUAL =
            await ViewRepository.readStandingAnual<Standing>(STANDING_PATH);

          FIXTURE_REGULAR.rondas.forEach(({ partidos }) => {
            partidos.forEach((p) => {
              if (esPartidoFinalizado(p.fixture.status.long)) {
                const teamHome = STANDINGS_ANUAL.find(
                  (st) => st.team.id === p.teams.home.id,
                )!;
                const teamAway = STANDINGS_ANUAL.find(
                  (st) => st.team.id === p.teams.away.id,
                )!;

                if (esVictoriaLocal(p.teams.home)) {
                  sumatoriaVictoriaLocal(teamHome, teamAway, p);
                }

                if (esVictoriaVisitante(p.teams.away)) {
                  sumatoriaVictoriaVisitante(teamHome, teamAway, p);
                }

                if (esEmpate(p.teams.home, p.teams.away)) {
                  sumatoriaEmpate(teamHome, teamAway, p);
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

          const PATH_WRITE = PATH_WRITE_VIEW(storage);

          await ViewRepository.updateFile(PATH_WRITE, STANDINGS_ANUAL);

          return;
        }

        //Para el año 2023, primero se jugo la liga profesional, y luego la copa de liga
        if (
          (esCopaDeLaLiga(league) && esTemporada(season!, 2023)) ||
          (esLigaProfesional(league) && esTemporada(season!, 2023))
        ) {
          STANDING_PATH = PATH_READ_VIEW({
            ...path,
            league: "lpf",
            filename: "tabla-anual-lpf.json",
          });

          FIXTURE_PATH = PATH_READ_VIEW({
            ...path,
            filename: `fixture-${path.league}.json`,
          });

          //harcodeadisimo
          const FIXTURE_REGULAR =
            await ViewRepository.readFixtureRegular<Fase>(FIXTURE_PATH);

          const STANDINGS_ANUAL =
            await ViewRepository.readStandingAnual<Standing>(STANDING_PATH);

          FIXTURE_REGULAR.rondas.forEach(({ partidos }) => {
            partidos.forEach((p) => {
              if (esPartidoFinalizado(p.fixture.status.long)) {
                const teamHome = STANDINGS_ANUAL.find(
                  (st) => st.team.id === p.teams.home.id,
                )!;
                const teamAway = STANDINGS_ANUAL.find(
                  (st) => st.team.id === p.teams.away.id,
                )!;

                if (esVictoriaLocal(p.teams.home)) {
                  sumatoriaVictoriaLocal(teamHome, teamAway, p);
                }

                if (esVictoriaVisitante(p.teams.away)) {
                  sumatoriaVictoriaVisitante(teamHome, teamAway, p);
                }

                if (esEmpate(p.teams.home, p.teams.away)) {
                  sumatoriaEmpate(teamHome, teamAway, p);
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

          const PATH_WRITE = PATH_WRITE_VIEW(storage);

          await ViewRepository.updateFile(PATH_WRITE, STANDINGS_ANUAL);

          return;
        }

        // Salvo en el 2023, primero se jugo copa de liga y despues liga profesional
        if (
          (esCopaDeLaLiga(league) && !esTemporada(season!, 2023)) ||
          (esLigaProfesional(league) && !esTemporada(season!, 2023))
        ) {
          STANDING_PATH = PATH_READ_VIEW({
            ...path,
            league: "copa-lpf",
            filename: "tabla-anual-copa-lpf.json",
          });

          FIXTURE_PATH = PATH_READ_VIEW({
            ...path,
            filename: `fixture-${path.league}.json`,
          });

          //harcodeadisimo
          const FIXTURE_REGULAR =
            await ViewRepository.readFixtureRegular<Fase>(FIXTURE_PATH);

          const STANDINGS_ANUAL =
            await ViewRepository.readStandingAnual<Standing>(STANDING_PATH);

          FIXTURE_REGULAR.rondas.forEach(({ partidos }) => {
            partidos.forEach((p) => {
              if (esPartidoFinalizado(p.fixture.status.long)) {
                const teamHome = STANDINGS_ANUAL.find(
                  (st) => st.team.id === p.teams.home.id,
                )!;
                const teamAway = STANDINGS_ANUAL.find(
                  (st) => st.team.id === p.teams.away.id,
                )!;

                if (esVictoriaLocal(p.teams.home)) {
                  sumatoriaVictoriaLocal(teamHome, teamAway, p);
                }

                if (esVictoriaVisitante(p.teams.away)) {
                  sumatoriaVictoriaVisitante(teamHome, teamAway, p);
                }

                if (esEmpate(p.teams.home, p.teams.away)) {
                  sumatoriaEmpate(teamHome, teamAway, p);
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

          const PATH_WRITE = PATH_WRITE_VIEW(storage);

          await ViewRepository.updateFile(PATH_WRITE, STANDINGS_ANUAL);

          return;
        }
      }

      default: {
        throw new Error("ASDADS");
      }
    }
    /**
     * Sea clausura o apertura,
     * siempre vamos a buscar primero la tabla anual del apertura.
     * Ya que la sumatoria de puntos, arranca desde el apertura hasta el clausura
     * Por ende, cuando queramos sumar los puntos del clausura, vamos sumando desde los puntos del apertura.
     * Muy redundante la explicacion (?)
     * */

    if (storage.directory.country === "arg") {
    }
  }
}
