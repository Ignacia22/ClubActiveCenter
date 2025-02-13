
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function OrdersTable() {
  const { items } = useCart();

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">Últimas Órdenes</h2>
      </div>
      
      <table className="w-full">
        <thead className="bg-gray-900/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Cantidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {items.map((item) => (
            <tr key={`${item.id}`} className="hover:bg-gray-700/50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Image
                    className="h-10 w-10 rounded object-cover"
                    src={item.image || '/api/placeholder/40/40'}
                    alt={item.name}
                    width={40}
                    height={40}
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">{item.name}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {item.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                ${Number(item.price || 0).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                ${Number(item.price || 0 * item.quantity).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.State === 'disponible' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.State}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}