import { readFile, mkdir, writeFile } from "node:fs/promises";

export class RawRepository {
  static async createFile(path_dir: string, path_file: string, data: any) {
    try {
      await mkdir(path_dir, { recursive: true });
      await writeFile(path_file, JSON.stringify(data));
    } catch (error) {
      console.error(error);
      throw (error as Error).message;
    }
  }

  static async readFixture<T>(path: string): Promise<T> {
    try {
      const FILE = await readFile(path, "utf-8");
      const { response } = JSON.parse(FILE);
      return response;
    } catch (error) {
      console.error(error);
      throw (error as Error).message;
    }
  }

  static async readStanding<T>(path: string): Promise<T> {
    try {
      const FILE = await readFile(path, "utf-8");
      const {
        response: [
          {
            league: { standings },
          },
        ],
      } = JSON.parse(FILE);
      return standings;
    } catch (error) {
      console.error(error);
      throw (error as Error).message;
    }
  }
}
