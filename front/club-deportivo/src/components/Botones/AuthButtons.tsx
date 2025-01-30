/* eslint-disable @next/next/no-img-element */

"use client"; // Necesario para usar hooks en el App Router

import { useAuth0 } from "@auth0/auth0-react";

export default function AuthButtons() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Iniciar sesión</button>
      ) : (
        <>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Cerrar sesión
          </button>
          <div>
            <h2>Bienvenido, {user?.name}</h2>
            <img src={user?.picture} alt={user?.name} />
          </div>
        </>
      )}
    </div>
  );
}
<div>
  <h1>Mi aplicación con Auth0</h1>
  <AuthButtons />
</div>;
