import { products } from "@/app/data/products";
import { IProducts } from "@/interface/IProducts";

export const getProducts = async (): Promise<IProducts[]> => {
  return products;
};
