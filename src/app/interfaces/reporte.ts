export interface ReporteInterface {
  // ===== CLIENTE =====
   codigoUnico:string;
  clienteId: number;
  nombreCliente: string;
  cedula: string;
  telefonoCliente: string;
  direccionCliente: string;
  fotoClienteUrl: string;

  // ===== TIENDA =====
  tiendaId?: number; // El '?' indica que permite nulos (int?)
  nombreTienda: string;
  encargadoTienda: string;
  telefonoTienda: string;
  estadoDeComision:string;

  // ===== CRÉDITO =====
  creditoId: number;
  marca: string;
  modelo: string;
  fotoContrato: string;
  fotoCelularEntregadoUrl: string;

  entrada: number;
  montoTotal: number;
  montoPendiente: number;
  plazoCuotas: number;
  frecuenciaPago: string;
  valorPorCuota: number;
  proximaCuota: string | Date; // Puede ser string si viene con formato ISO o Date
  estadoCredito: string;

  estadoCuota: string;
  abonadoTotal: number;
  abonadoCuota: number;

  // ===== FECHAS =====
  fechaCreditoStr: string;
}