import { PATH_DIR_RAW, PATH_WRITE_RAW } from "../utils/paths.js";
import {
  RequestLeagueRaw,
  RequestGenericRaw
} from "../types/raw.types.js";
import { axiosApi } from "../utils/axiosApi.js";
import { RawRepository } from "../repository/raw.repository.js";

export default class RawService {
  static async CreateLeague({ params, storage }: RequestLeagueRaw) {
    const data  = await axiosApi(`/leagues?country=${params.country}`)
    const PATH_DIR = PATH_DIR_RAW(storage)
    const PATH_WRITE = PATH_WRITE_RAW(storage);
    await RawRepository.createFile(PATH_DIR,PATH_WRITE,data)
  }

  static async CreateTeams({ params, storage }: RequestGenericRaw) {
    const data = await axiosApi(`/teams?league=${params.league}&season=${params.season}`)
    const PATH_DIR = PATH_DIR_RAW(storage)
    const PATH_WRITE = PATH_WRITE_RAW(storage);
    await RawRepository.createFile(PATH_DIR,PATH_WRITE,data)
  }

  static async CreateStandings({ params, storage }: RequestGenericRaw) {
    const data = await axiosApi(`/standings?league=${params.league}&season=${params.season}`)
    const PATH_DIR = PATH_DIR_RAW(storage)
    const PATH_WRITE = PATH_WRITE_RAW(storage);
    await RawRepository.createFile(PATH_DIR,PATH_WRITE,data)
  }

  static async CreateFixtures({ params, storage }: RequestGenericRaw) {
    const data = await axiosApi(`/fixtures?league=${params.league}&season=${params.season}`)
    const PATH_DIR = PATH_DIR_RAW(storage)
    const PATH_WRITE = PATH_WRITE_RAW(storage);
    await RawRepository.createFile(PATH_DIR,PATH_WRITE,data)
  }

  static async CreateFixturesRounds({ params, storage }: RequestGenericRaw) {
    const data = await axiosApi(`/fixtures/rounds?league=${params.league}&season=${params.season}`)
    const PATH_DIR = PATH_DIR_RAW(storage)
    const PATH_WRITE = PATH_WRITE_RAW(storage);
    await RawRepository.createFile(PATH_DIR,PATH_WRITE,data)
  }
}
