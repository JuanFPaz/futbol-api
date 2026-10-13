import { FixtureMatch } from "../types/raw.types.js";
import { esFaseRegular, esFasePlayoff } from "./condicionales.js";

export const PLAYOFF_OCTAVOS = [
  "Octavos de Final",
  "Cuartos de Final",
  "Semifinal",
  "Final",
];
export const PLAYOFF_CUARTOS = ["Cuartos de Final", "Semifinal", "Final"];

/* ---------- Filtros por temporada (qué rondas del raw nos sirven) ---------- */

// 2026: ['apertura - 1', 'apertura - round of 16', 'clausura - 1', ...]
export function filtrarRondasArg2026(rondas: string[], tournament: string) {
  return rondas.filter((ronda) => ronda.toLowerCase().startsWith(tournament));
}

// 2025: ['1st Phase - 1', ..., '2nd Phase - 1', ..., 'Round of 16', 'Quarter-finals', ...]
// Apertura = '1st Phase'.
// Clausura = '2nd Phase' + los playoffs, que vienen sin prefijo.
export function filtrarRondasArg2025(rondas: string[], tournament: string) {
  if (tournament === "apertura") {
    return rondas.filter((ronda) => ronda.startsWith("1st Phase"));
  }
  return rondas.filter(
    (ronda) => ronda.startsWith("2nd Phase") || !ronda.includes("Phase"),
  );
}

/* ---------- Armado de rondas ---------- */

function partidosDeRonda(partidos: FixtureMatch[], ronda: string) {
  return partidos.filter((p) => p.league.round === ronda);
}

// "Fecha 1", "Fecha 2", ...
export function armarFechas(rondas: string[], partidos: FixtureMatch[]) {
  return rondas.map((ronda, idx) => ({
    ronda: `Fecha ${idx + 1}`,
    partidos: partidosDeRonda(partidos, ronda),
  }));
}

// Le ponemos el nombre que corresponde a cada ronda de playoff
export function armarPlayoffs(
  rondas: string[],
  partidos: FixtureMatch[],
  nombres: string[],
) {
  return rondas.map((ronda, idx) => ({
    ronda: nombres[idx] ?? ronda,
    partidos: partidosDeRonda(partidos, ronda),
  }));
}

// Partido desempate por el descenso (Copa de la Liga 2023)
export function armarDesempate(rondas: string[], partidos: FixtureMatch[]) {
  return rondas
    .filter((ronda) => ronda === "Relegation Decider")
    .map((ronda) => ({
      ronda: "Partido Desempate",
      partidos: partidosDeRonda(partidos, ronda),
    }));
}

/* ---------- Fixtures completos ---------- */

export function armarFixtureRegularPlayoffs(
  rondas: string[],
  partidos: FixtureMatch[],
  nombresPlayoff: string[],
) {
  return {
    formato: "regular-playoffs",
    fases: [
      {
        fase: "regular",
        rondas: armarFechas(rondas.filter(esFaseRegular), partidos),
      },
      {
        fase: "playoffs",
        rondas: armarPlayoffs(
          rondas.filter(esFasePlayoff),
          partidos,
          nombresPlayoff,
        ),
      },
    ],
  };
}

export function armarFixtureRegular(rondas: string[], partidos: FixtureMatch[]) {
  return {
    formato: "regular",
    fases: [{ fase: "regular", rondas: armarFechas(rondas, partidos) }],
  };
}