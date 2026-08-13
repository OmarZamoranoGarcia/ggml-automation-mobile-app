export const Colors = {
  // Colores base
  background: {
    primary: "#0b0f14", // Fondo principal
    secondary: "#293343", // Fondo de formulario
    input: "#0d1218", // Fondo de inputs
    button: "#d0aa68", // Fondo de botón
  },
  text: {
    primary: "#ffffff", // Texto principal (blanco)
    secondary: "#8995a7", // Texto secundario (gris)
    button: "#ffffff", // Texto del botón
  },
  border: {
    focused: "#ffd700", // Borde cuando input está enfocado (amarillo)
  },
  // Colores específicos para estados
  status: {
    focus: "#ffd700", // Amarillo para focus
  },
} as const;
