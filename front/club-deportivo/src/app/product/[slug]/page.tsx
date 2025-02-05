import AddProduct from "@/components/Botones/AddProduct";
import { getProduct } from "@/helpers/getProduct";
import Image from "next/image";

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const decodedSlug = decodeURIComponent((await params).slug);
  console.log("Slug decodificado:", decodedSlug);

  const product = await getProduct(decodedSlug);

  if (!product) {
    return <div>Error: No se pudo cargar el producto</div>;
  }

  // Desestructurar las propiedades del producto
  const { name, price, description, image, stock, State } = product;

  return (
    <div className="max-w-2xl mx-auto py-20 shadow-md rounded-lg flex flex-col sm:flex-row items-center sm:items-center">
      <div className="sm:w-1/2 text-white sm:pr-6">
        <h1 className="text-white text-2xl font-bold mb-2">{name}</h1>
        <h2 className="text-lg text-white mb-4">${price}</h2>
        <p className="text-white mb-4">{description}</p>
        <div className="text-sm text-white">
          <span className="block text-slate-400 font-semibold">Stock: {stock}</span>
          <span className="block text-slate-400 font-semibold">State: {State}</span>
        </div>
        <div className="m-2 p-4">
          <AddProduct product={product} />
        </div>
      </div>

      <div className="relative w-full sm:w-1/2 h-64 sm:h-96 mt-6 sm:mt-0">
        {image && image.trim() !== "" ? (
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">Imagen no disponible</span>
          </div>
        )}
      </div>
    </div>
  );
}