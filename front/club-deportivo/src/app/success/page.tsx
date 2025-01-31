import { getPaymentStatus } from "@/service/striperService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    getPaymentStatus(sessionId)
      .then(setPaymentStatus)
      .catch((error) =>
        console.error("Error al obtener el estado del pago:", error)
      );
  }, [sessionId]);

  return <div>Estado del pago: {paymentStatus || "Cargando..."}</div>;
};

export default SuccessPage;
