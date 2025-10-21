// roshi_fit/src/types/Setting.ts
export interface Settings {
  nombre_sitio?: string;
  telefono?: string;
  email_contacto?: string;
  horario_apertura?: string;
  direccion?: string;
  facebook_url?: string;
  instagram_url?: string;
  // Email
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_pass?: string;
  // Pagos
  stripe_key?: string;
  paypal_client_id?: string;
  // Seguridad
  session_timeout?: string;
  password_min_length?: string;
}