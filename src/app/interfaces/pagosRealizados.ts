export interface PagoRealizado {
    id: number;
    creditoId: number;
    montoPagado: number;
    metodoPago: string;
    fechaPagoStr: string; // El string formateado que viene del API
    nombreCliente: string;
}