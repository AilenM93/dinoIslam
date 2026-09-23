export const typography = {
  display: '"Baloo 2", "Nunito", sans-serif',
  body: '"Nunito", "Trebuchet MS", sans-serif',
} as const;

export async function loadGameFonts(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('700 32px "Baloo 2"', "Isla áéíóúñ¿¡"),
      document.fonts.load('400 20px "Nunito"', "Isla áéíóúñ¿¡"),
      document.fonts.load('700 24px "Nunito"', "Isla áéíóúñ¿¡"),
    ]);
  } catch {
    console.warn("No se pudieron cargar las fuentes; se utilizará la tipografía de reserva.");
  }
}
