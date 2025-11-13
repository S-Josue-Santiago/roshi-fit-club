// roshi_fit/src/types/Testimonial.ts
export interface Testimonial {
  id: number;
  testimonio: string;
  nombre_mostrar: string | null;
  avatar: string | null;
  rating: number | null;
}

// roshi_fit/src/types/Testimonial.ts
export interface ClientTestimonial {
  id: number;
  testimonio: string;
  rating: number;
  visible: boolean;
  estado: 'activo' | 'inactivo' | 'desabilitado';
  creacion_fecha: string;
  modificacion_fecha: string;
}

export interface CreateTestimonialData {
  usuario_id: number;
  testimonio: string;
  rating: number;
}

export interface UpdateTestimonialData {
  testimonio: string;
  rating: number;
}