
export const checkHealth = async () => {
 
  return {
    success: true,
    data: {
      status: "Backend no disponible - Modo de prueba activado",
      message: "El backend no está disponible, pero la aplicación funciona en modo de prueba"
    }
  }
}
