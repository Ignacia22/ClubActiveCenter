export const fetchSpaces = async () => {
  try {
    const response = await fetch(
      "https://active-center-db-3rfj.onrender.com/space/allSpaces",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Respuesta del servidor:", errorText);
      throw new Error(`Error al cargar los espacios: ${response.status}`);
    }

    const spaces = await response.json();
    console.log("Espacios obtenidos del backend:", spaces);
    return spaces;
  } catch (error: unknown) {
    // Verificación de tipo para manejar correctamente el error
    if (error instanceof Error) {
      console.error("Error al cargar los espacios:", error.message);
      throw new Error(
        error.message || "Hubo un problema al cargar los espacios."
      );
    } else {
      console.error("Error desconocido:", error);
      throw new Error("Hubo un problema al cargar los espacios.");
    }
  }
};
