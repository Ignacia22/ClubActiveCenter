import { useState } from "react";
import { Activity } from "@/interface/IActivity";
import { Edit, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

interface ActivitiesTableProps {
  activities: Activity[];
  onCancel: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onCreateClick: () => void;
}

export const ActivitiesTable: React.FC<ActivitiesTableProps> = ({
  activities,
  onCancel,
  onEdit,
  onCreateClick,
}) => {
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const handleCancelActivity = async (id: string) => {
    try {
      const confirmCancel = window.confirm(
        "¿Estás seguro de que quieres cancelar esta actividad?"
      );

      if (confirmCancel) {
        setIsDeletingId(id);
        await onCancel(id);
        alert("Actividad cancelada con éxito");
      }
    } catch (error) {
      console.error("Error al cancelar actividad:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cancelar actividad",
        text: "Por favor, intenta de nuevo más tarde.",
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Lista de Actividades</h2>
        <button
          onClick={onCreateClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" /> Crear Actividad
        </button>
      </div>

      <table className="w-full">
        <thead className="bg-gray-900/50">
          <tr>
            {["TÍTULO", "DESCRIPCIÓN", "IMAGEN", "ACCIONES"].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {activities.map((activity) => (
            <tr
              key={activity.id}
              className={`hover:bg-gray-700/50 ${
                isDeletingId === activity.id ? "opacity-50" : ""
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {activity.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {activity.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {activity.file ? (
                  <Image
                    src={URL.createObjectURL(activity.file)}
                    alt={activity.title}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : activity.img ? (
                  <Image
                    src={activity.img}
                    alt={activity.title}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-500">Sin imagen</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(activity.id)}
                    className="hover:text-white"
                    disabled={!activity.status}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleCancelActivity(activity.id)}
                    className={`text-red-500 hover:text-red-700 ${
                      !activity.status ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!activity.status}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <span
                    className={`px-2 py-1 rounded ${
                      activity.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {activity.status ? "Activa" : "Cancelada"}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
