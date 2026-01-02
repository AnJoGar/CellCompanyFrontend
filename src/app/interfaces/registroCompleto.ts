export interface UsuarioRegistro {
  id: number;
  nombreApellidos: string;
  correo: string;
  rolId: number;
  rolDescripcion: string;
  clave: string;
  esActivo: number;
  cliente: ClienteRegistro;
}

export interface ClienteRegistro {
  id: number;
  usuarioId: number;
  detalleClienteID: number;
  detalleCliente: DetalleCliente;
  tiendaApps: TiendaApp[];
  creditos: CreditoRegistro[];
}

export interface DetalleCliente {
  id: number;
  numeroCedula: string;
  nombreApellidos: string;
  nombrePropietario: string;
  telefono: string;
  direccion: string;
}

export interface TiendaApp {
  id: number;
  cedulaEncargado: string;
  estadoDeComision: string;
  fechaRegistro: string;
  clienteId: number;
  
}

export interface CreditoRegistro {
  id: number;
  entrada: number;
  montoTotal: number;
  montoPendiente: number;
  plazoCuotas: number;
  frecuenciaPago: string;
  diaPago: string;
  valorPorCuota: number;
  proximaCuota: string;
  proximaCuotaStr: string;
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
  fechaCreacion: string;
  clienteId: number;
  tiendaAppId: number | null;
}