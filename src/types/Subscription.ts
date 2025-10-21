// roshi_fit/src/types/Subscription.ts
export type SubscriptionStatus = 'activa' | 'vencida' | 'cancelada' | 'suspendida';

export interface Subscription {
  id: number;
  usuario_id: number;
  plan_id: number;
  fecha_inicio: string; // ISO
  fecha_fin: string; // ISO
  estado_suscripcion: SubscriptionStatus;
}

export interface SubscriptionWithUserPlan extends Subscription {
  usuario: { id: number; nombre_completo: string; email: string; telefono?: string | null };
  plan: { id: number; nombre: string; precio_q: string; duracion_dias: number };
  dias_restantes: number;
  computed_estado: SubscriptionStatus;
}
