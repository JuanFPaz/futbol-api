import axios from "axios";
import configAxios from "../helpers/configAxios.js";

export async function axiosApi(url: string) {
  try {
    const { data } = await axios(configAxios(url));

    return data;
  } catch (error) {
    console.error(error);
    throw (error as Error).message;
  }
}
