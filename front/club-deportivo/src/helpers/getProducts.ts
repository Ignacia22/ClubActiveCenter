import { products } from "@/app/data/products";
import { IProducts } from "@/app/Interfaces/IProducts";

export const getProducts = async (): Promise<IProducts[]> => {
  return products;
};
