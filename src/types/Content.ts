// roshi_fit/src/types/Content.ts
export type ContenidoTipo = 'hero' | 'about'; // Añade todos los valores que uses


export interface SiteContent {
  tipo_contenido: string;
  titulo: string;
  subtitulo: string | null;
  contenido: string;
  url_imagen: string | null;
  texto_boton: string;
  enlace_boton: string;
  orden_muestra: number;
}

export interface ContactContent {
  titulo: string | null;
  subtitulo: string | null;
  contenido: string | null; // Puede contener JSON o texto plano
}