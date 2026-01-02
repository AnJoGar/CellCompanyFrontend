import { ProductoBodega } from "./Bodega";
import { Tienda } from "./Tienda";

export interface MovimientoInventario {
  id: number;
  tipoMovimiento: string; // ENTRADA | SALIDA | TRASLADO | VENTA | DEVOLUCION | AJUSTE
  fechaMovimiento: Date;
  productoId: number;
  producto?: ProductoBodega;
  tiendaOrigenId?: number;
  tiendaOrigen?: Tienda;
  tiendaDestinoId?: number;
  tiendaDestino?: Tienda;
  observacion?: string;
  usuarioRegistro?: string;
  montoVenta?: number;
}

export interface TrasladoProducto {
  productoId: number;
  tiendaOrigenId: number;
  tiendaDestinoId: number;
  observacion?: string;
  usuarioRegistro: string;
}
export interface EntradaRequest {
  productoId: number;
  tiendaDestinoId: number;
  observacion?: string;
}

export interface MovimientoHistorial {
  id: number;
  tipoMovimiento: string;
  fechaMovimiento: Date;
  productoId: number;
  productoNombre?: string;
  imei?: string;
  tiendaOrigenId?: number;
  tiendaOrigenNombre?: string;
  tiendaDestinoId?: number;
  tiendaDestinoNombre?: string;
  observacion?: string;
  usuarioRegistro?: string;
  montoVenta?: number;
}

export interface TiendaDestino {
  id: number;
  nombreTienda: string;
  direccion?: string;
  telefono?: string;
  ciudad?: string;
}

 // 👈 Usa tu interfaz existente

export interface StockBodega {
  tiendaId: number;
  tiendaNombre: string;
  totalProductos: number;
  productos: ProductoBodega[]; // 👈 Usa tu interfaz existente
}