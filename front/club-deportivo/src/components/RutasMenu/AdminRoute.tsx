import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin } = useAuth();
  const router = useRouter();

  if (isAdmin) {
    return <>{children}</>;
  } else {
    router.push("/userDashboard");
    return null;
  }
};