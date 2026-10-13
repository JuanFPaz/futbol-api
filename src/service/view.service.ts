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
  esFasePlayoff,
  esFaseRegular,
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
  static async createFixture({ path, storage }: RequestCreateView) {
    const FIXTURE_PATH = PATH_READ_RAW(path);
    const FIXTURE_ROUNDS_PATH = PATH_READ_RAW({
      ...path,
      filename: `fixture-rounds-${path.league}.json`,
    });

    let ROUND_DATA =
      await RawRepository.readFixture<string[]>(FIXTURE_ROUNDS_PATH);
    let FIXTURE_DATA =
      await RawRepository.readFixture<FixtureMatch[]>(FIXTURE_PATH);

    switch (storage.directory.country) {
      case "arg": {
        if (esClausuraApertura(storage.directory.tournament)) {
          if (esTemporada(storage.directory.season!, 2026)) {
            /* Para season 2026, tenemos un array tipo:
             *['apertura - 1', 'apertura - 2', 'apertura - round of 16', 'clausura - 1', etc.. ]
             * Como nosotros en este service vamos a crear un fixture o de 'Apertura' o 'Clausura'
             * vamosa  a filtrar del archivo de fixtures-rounds, de la propiedad storage.tournament,
             * todo los elementos que empiezen con el nombre 'apertura' o 'clausura'
             * * */
            ROUND_DATA = ROUND_DATA.filter((fx) =>
              fx.toLowerCase().startsWith(storage.directory.tournament!),
            );
          }
          if (esTemporada(storage.directory.season!, 2025)) {
            const esApertura = storage.directory.tournament === "apertura";
            /* NOTA Season 2025, tenemos un array tipo:
             *['1st Phase - 1', '1st Phase - 2', '1st Phase - round of 16', '1st Phase - 1', etc.. ]
             * Como nosotros en este service vamos a crear un fixture de 'Apertura' o 'Clausura'
             * vamos a filtrar del archivo de fixtures-rounds, de la propiedad storage.tournament,
             * Si el storage.tournament es apertura, filtramos los que empiecen con 1st Phase
             * Si el storage.tournament es clausura, filtramos los que empiecen con 2nd Phase
             * * */
            ROUND_DATA = ROUND_DATA.filter((ronda) => {
              if (esApertura) return ronda.startsWith("1st Phase");

              /*
               * NOTA Clausura: la fase regular tiene prefijo 2nd Phase, los playoffs vienen sin prefijo
               * Ej: [2nd Phase - 16, Round of 16, Quarter-finals, Semis, Final]
               * * */
              return (
                ronda.startsWith("2nd Phase") || !ronda.includes("Phase") // "Round of 16", "Quarter-finals", etc.
              );
            });
          }
          let RONDA_REGULAR = ROUND_DATA.filter(esFaseRegular);
          let RONDA_PLAYOFF = ROUND_DATA.filter(esFasePlayoff);
          const PARTIDOS_REGU = RONDA_REGULAR.map((ronda, idx) => {
            const partidos = FIXTURE_DATA.filter(
              (fixture) => fixture.league.round === ronda,
            );
            return { ronda: `Fecha ${idx + 1}`, partidos };
          });

          const PARTIDOS_PLAYOFF = RONDA_PLAYOFF.map((ronda, idx) => {
            const rondaName = [
              "Octavos de Final",
              "Cuartos de Final",
              "Semifinal",
              "Final",
            ];
            const partidos = FIXTURE_DATA.filter(
              (fixture) => fixture.league.round === ronda,
            );
            return { ronda: rondaName[idx], partidos: partidos };
          });

          const FIXTURE_COMPLETO = {
            formato: "regular-playoffs",
            fases: [
              {
                fase: "regular",
                rondas: PARTIDOS_REGU,
              },
              {
                fase: "playoffs",
                rondas: PARTIDOS_PLAYOFF,
              },
            ],
          };

          const PATH_DIR = PATH_DIR_VIEW(storage);
          const PATH_WRITE = PATH_WRITE_VIEW(storage);
          await ViewRepository.createFile(
            PATH_DIR,
            PATH_WRITE,
            FIXTURE_COMPLETO,
          );
          return;
        }
        if (esCopaDeLaLiga(storage.directory.league)) {
          if (
            esTemporada(storage.directory.season!, 2022) ||
            esTemporada(storage.directory.season!, 2021)
          ) {
            ROUND_DATA = ROUND_DATA.filter((ronda) =>
              ronda.startsWith("1st Phase"),
            );
            let RONDA_REGULAR = ROUND_DATA.filter(esFaseRegular);
            let RONDA_PLAYOFF = ROUND_DATA.filter(esFasePlayoff);
            const PARTIDOS_REGU = RONDA_REGULAR.map((ronda, idx) => {
              const partidos = FIXTURE_DATA.filter(
                (fixture) => fixture.league.round === ronda,
              );
              return { ronda: `Fecha ${idx + 1}`, partidos };
            });

            const PARTIDOS_PLAYOFF = RONDA_PLAYOFF.map((ronda, idx) => {
              const rondaName = ["Cuartos de Final", "Semifinal", "Final"];
              const partidos = FIXTURE_DATA.filter(
                (fixture) => fixture.league.round === ronda,
              );
              return { ronda: rondaName[idx], partidos: partidos };
            });

            const FIXTURE_COMPLETO = {
              formato: "regular-playoffs",
              fases: [
                {
                  fase: "regular",
                  rondas: PARTIDOS_REGU,
                },
                {
                  fase: "playoffs",
                  rondas: PARTIDOS_PLAYOFF,
                }
              ],
            };

            const PATH_DIR = PATH_DIR_VIEW(storage);
            const PATH_WRITE = PATH_WRITE_VIEW(storage);
            await ViewRepository.createFile(
              PATH_DIR,
              PATH_WRITE,
              FIXTURE_COMPLETO,
            );
            return;
          }

          if (esTemporada(storage.directory.season!, 2023)) {
            let RONDA_REGULAR = ROUND_DATA.filter(esFaseRegular);
            let RONDA_PLAYOFF = ROUND_DATA.filter(esFasePlayoff);

            console.log(RONDA_PLAYOFF);

            const PARTIDOS_REGU = RONDA_REGULAR.map((ronda, idx) => {
              const partidos = FIXTURE_DATA.filter(
                (fixture) => fixture.league.round === ronda,
              );
              return { ronda: `Fecha ${idx + 1}`, partidos };
            });
            const PARTIDOS_PLAYOFF = RONDA_PLAYOFF.map((ronda, idx) => {
              const rondaName = ["Cuartos de Final", "Semifinal", "Final"];
              const partidos = FIXTURE_DATA.filter(
                (fixture) => fixture.league.round === ronda,
              );
              return { ronda: rondaName[idx], partidos: partidos };
            });
            let RONDA_RELEGATION = ROUND_DATA.filter(
              (fase) => fase === "Relegation Decider",
            );
            const PARTIDOS_RELEGATION = RONDA_RELEGATION.map((ronda, idx) => {
              const partidos = FIXTURE_DATA.filter(
                (fixture) => fixture.league.round === ronda,
              );
              return { ronda: `Partido Desempate`, partidos };
            });
            const FIXTURE_COMPLETO = {
              formato: "regular-playoffs",
              fases: [
                {
                  fase: "regular",
                  rondas: PARTIDOS_REGU,
                },
                {
                  fase: "playoffs",
                  rondas: PARTIDOS_PLAYOFF,
                },
                {
                  fase: "relegation",
                  rondas: PARTIDOS_RELEGATION,
                },
              ],
            };

            const PATH_DIR = PATH_DIR_VIEW(storage);
            const PATH_WRITE = PATH_WRITE_VIEW(storage);
            await ViewRepository.createFile(
              PATH_DIR,
              PATH_WRITE,
              FIXTURE_COMPLETO,
            );
            return;
          }

          if (esTemporada(storage.directory.season!, 2024)) {
            let RONDA_REGULAR = ROUND_DATA.filter(esFaseRegular);
            let RONDA_PLAYOFF = ROUND_DATA.filter(esFasePlayoff);
            const PARTIDOS_REGU = RONDA_REGULAR.map((ronda, idx) => {
              const partidos = FIXTURE_DATA.filter(
                (fixture) => fixture.league.round === ronda,
              );
              return { ronda: `Fecha ${idx + 1}`, partidos };
            });

            const PARTIDOS_PLAYOFF = RONDA_PLAYOFF.map((ronda, idx) => {
              const rondaName = ["Cuartos de Final", "Semifinal", "Final"];
              const partidos = FIXTURE_DATA.filter(
                (fixture) => fixture.league.round === ronda,
              );
              return { ronda: rondaName[idx], partidos: partidos };
            });

            const FIXTURE_COMPLETO = {
              formato: "regular-playoffs",
              fases: [
                {
                  fase: "regular",
                  rondas: PARTIDOS_REGU,
                },
                {
                  fase: "playoffs",
                  rondas: PARTIDOS_PLAYOFF,
                },
              ],
            };

            const PATH_DIR = PATH_DIR_VIEW(storage);
            const PATH_WRITE = PATH_WRITE_VIEW(storage);
            await ViewRepository.createFile(
              PATH_DIR,
              PATH_WRITE,
              FIXTURE_COMPLETO,
            );
            return;
          }
        }
        if (esLigaProfesional(storage.directory.league)) {
          if (esTemporada(storage.directory.season!, 2022) && esTemporada(storage.directory.season!, 2021)) {
            ROUND_DATA = ROUND_DATA.filter((fx) =>
              fx.toLowerCase().startsWith("2nd Phase"),
            );
          }
          const PARTIDOS_REGU = ROUND_DATA.map((ronda, idx) => {
            const partidos = FIXTURE_DATA.filter(
              (fixture) => fixture.league.round === ronda,
            );
            return { ronda: `Fecha ${idx + 1}`, partidos };
          });

          const FIXTURE_COMPLETO = {
            formato: "regular",
            fases: [
              {
                fase: "regular",
                rondas: PARTIDOS_REGU,
              },
            ],
          };

          const PATH_DIR = PATH_DIR_VIEW(storage);
          const PATH_WRITE = PATH_WRITE_VIEW(storage);
          await ViewRepository.createFile(
            PATH_DIR,
            PATH_WRITE,
            FIXTURE_COMPLETO,
          );
          return;
        }
      }
      default: {
        throw new Error("No se llego a crear absolutamende nada");
      }
    }
  }

  static async createTablas({ path, storage }: RequestCreateView) {
    const STANDING_PATH = PATH_READ_RAW(path);

    let STANDING_DATA =
      await RawRepository.readStanding<Standing[]>(STANDING_PATH);

    let STANDING_ANUAL = STANDING_DATA.flatMap((standing) => {
      const tablaFiltrada = standing.filter((team) => {
        if (esTemporada(storage.directory.season!, 2026))
          return team.group
            .toLowerCase()
            .startsWith(storage.directory.tournament!);
        return true;
      });

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

    const PATH_DIR = PATH_DIR_VIEW(storage);
    const PATH_WRITE = PATH_WRITE_VIEW(storage);

    await ViewRepository.createFile(PATH_DIR, PATH_WRITE, STANDING_ANUAL);
  }

  static async updateTablas({ path, storage }: RequestUpdateView) {
    /**
     * Sea clausura o apertura,
     * siempre vamos a buscar primero la tabla anual del apertura.
     * Ya que la sumatoria de puntos, arranca desde el apertura hasta el clausura
     * Por ende, cuando queramos sumar los puntos del clausura, vamos sumando desde los puntos del apertura.
     * Muy redundante la explicacion (?)
     * */

    try {
      if (storage.directory.country === "arg") {
        const STANDING_PATH = PATH_READ_VIEW({
          ...path,
          tournament: "apertura",
          filename: "tabla-anual-apertura.json",
        });

        const FIXTURE_PATH = PATH_READ_VIEW({
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
      }
    } catch (error) {
      console.error(error);
    }
  }
}
