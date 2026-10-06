import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import axios from "axios";
import configAxios from "../helpers/configAxios.js";

export default class CreateService {
  static async CreateLeague(country: string, abbr:string ,file_name: string) {
    const { data } = await axios(configAxios(`/leagues?country=${country}`));
    const PATH = join(
    process.cwd(),
    "src",
    "api",
    abbr,
    file_name,
  );
    await writeFile(PATH, JSON.stringify(data))
  }
}
