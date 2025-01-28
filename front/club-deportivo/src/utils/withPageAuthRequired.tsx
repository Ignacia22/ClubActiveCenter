// pages/protected.tsx
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const ProtectedPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Ruta protegida</h1>
      <p>¡Sólo usuarios autenticados pueden ver esto!</p>
    </div>
  );
};

// Protege la página con getServerSideProps
export const getServerSideProps = withPageAuthRequired();

export default ProtectedPage;
