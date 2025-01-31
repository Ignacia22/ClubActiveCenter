import { IProducts } from "@/interface/IProducts";
import axios from "axios";

export const getProducts = async (): Promise<IProducts[]> => {
  const fetch = await axios.get(`${process.env.API_URL}/products`);
  return fetch.data;
};