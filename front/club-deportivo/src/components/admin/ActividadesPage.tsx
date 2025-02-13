import { useAdmin } from "@/context/AdminContext";
import { UserActivities } from "../userDashboard/userDashboard";



export default function ActividadesPage() {
  const { activities } = useAdmin(); // Obtener actividades del contexto

  return (
    <div>
      <UserActivities activities={activities} />
    </div>
  );
}