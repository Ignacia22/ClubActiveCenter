// services.js o services.ts (según corresponda)
export const fetchSpaces = async () => {
  try {
    const response = await fetch("http://localhost:3001/space/allSpaces", {
      // Ajusta la URL si es necesario
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text(); // Obtener la respuesta como texto
      console.error("Respuesta del servidor:", errorText);
      throw new Error(`Error al cargar los espacios: ${response.status}`);
    }

    const spaces = await response.json(); // Convertir la respuesta en JSON
    console.log("Espacios obtenidos del backend:", spaces); // Ver la data recibida
    return spaces; // Devuelve los espacios obtenidos del backend
  } catch (error) {
    console.error("Error al cargar los espacios:", error); // Log completo del error
    throw new Error(
      error.message || "Hubo un problema al cargar los espacios."
    );
  }
};
