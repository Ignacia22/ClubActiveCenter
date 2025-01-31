import { getProducts } from "./getProducts";

export default async function getProduct(id: string) {
    const products = await getProducts()
    const product = products.find((p) => p.id === id)
    if(!product) throw Error("Product not found")
        return product
}