import { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;

export default function configAxios(url: string): AxiosRequestConfig {
  return {
    method: "get",
    url: `https://v3.football.api-sports.io${url}`,
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": "v3.football.api-sports.io",
    },
  };
}
