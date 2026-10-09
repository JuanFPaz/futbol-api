import { mkdir, readFile, writeFile } from "node:fs/promises";
export class ViewRepository {
  static async createFile(path_dir: string, path_file: string, data: any) {
    try {
      await mkdir(path_dir, { recursive: true });
      await writeFile(path_file, JSON.stringify(data));
    } catch (error) {
      console.error(error);
      throw (error as Error).message;
    }
  }

  static async updateFile(path_file: string, data: any) {
    try {
      await writeFile(path_file, JSON.stringify(data));
    } catch (error) {
      console.error(error);
      throw (error as Error).message;
    }
  }

  static async readFixtureRegular<T>(path_file: string): Promise<T> {
    try {
      const FILE = await readFile(path_file, "utf-8");
      const {
        fases: [regular],
      } = JSON.parse(FILE);
      return regular;
    } catch (error) {
      console.error(error);
      throw (error as Error).message;
    }
  }

  static async readStandingAnual<T>(path_file: string): Promise<T> {
    try {
      const FILE = await readFile(path_file, "utf-8");
      const data = JSON.parse(FILE);
      return data;
    } catch (error) {
      console.error(error);
      throw (error as Error).message;
    }
  }
}
