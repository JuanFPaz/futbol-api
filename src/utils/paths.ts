import { join } from "node:path";
import { PathFileRaw, PathFileView, PathStorage } from "../types/path.types.js";

const PATH_MAIN = () => join(process.cwd(), "src", "data");

const PATH_RAW = () => join(PATH_MAIN(), "raw");

const PATH_VIEW = () => join(PATH_MAIN(), "view");

/**
 * Encargada crear la ruta de los directorios de /data/raw
 * Necesaria para verificar si los directorios existen
 * Si no existen, RawRepository.createFile() se encarga de crearlos,
 * para posteriormente guardar el archivo de PATH_WRITE_RAW()
 * @param
 * @returns string
 */
export const PATH_DIR_RAW = ({ directory }: PathStorage) =>
  join(
    PATH_RAW(),
    directory.country,
    directory.season ?? "",
    directory.league ?? "",
  );

/**
 * Encargada crear la ruta de los directorios de /data/raw
 * Necesaria para verificar si los directorios existen
 * Si no existen, ViewRepository.createFile() se encarga de crearlos,
 * para posteriormente guardar el archivo de PATH_WRITE_VIEW()
 * @param
 * @returns string
 */
export const PATH_DIR_VIEW = ({ directory }: PathStorage) =>
  join(
    PATH_VIEW(),
    directory.country,
    directory.season ?? "",
    directory.league ?? "",
    directory.tournament ?? "",
  );

export const PATH_WRITE_RAW = ({ directory, filename }: PathStorage) =>
  join(
    PATH_RAW(),
    directory.country,
    directory.season ?? "",
    directory.league ?? "",
    filename,
  );

export const PATH_READ_RAW = ({
  country,
  season,
  league,
  filename,
}: PathFileRaw) =>
  join(PATH_RAW(), country, season ?? "", league ?? "", filename);

export const PATH_WRITE_VIEW = ({ directory, filename }: PathStorage) =>
  join(
    PATH_VIEW(),
    directory.country,
    directory.season ?? "",
    directory.league ?? "",
    directory.tournament ?? "",
    filename,
  );

export const PATH_READ_VIEW = ({
  country,
  season,
  league,
  tournament,
  filename,
}: PathFileView) =>
  join(
    PATH_VIEW(),
    country,
    season ?? "",
    league ?? "",
    tournament ?? "",
    filename,
  );
