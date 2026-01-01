export interface Credito {
    id: number;
    entrada: number;
    montoTotal: number;
    montoPendiente: number;
    plazoCuotas: number;
    frecuenciaPago: string;
    diaPago: string | Date;
    valorPorCuota: number;
    proximaCuota: string | Date;
    estado: string;
    metodoPago: string;
    marca: string;
    modelo: string;
    imei: string;
    tipoProducto: string;
    capacidad: number;
    abonadoTotal: number;
    abonadoCuota: number;
    estadoCuota: string;
    clienteId: number;
    tiendaAppId?: number;
}