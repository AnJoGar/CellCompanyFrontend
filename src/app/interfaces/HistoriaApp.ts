export interface HistoriaApp {
  id: number;
  proximaCuotaStr: string;
  montoPendiente: number;
  abonadoCuota: number;
  estadoCuota: string;
  clienteId: number;
  tiendaId?: number;
  creditoId: number;
}


export interface CalendarioPagosResponse {
  status: boolean;
  value: HistoriaApp[];
  msg?: string;
}