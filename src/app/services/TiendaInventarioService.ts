import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import{ environment } from '../../environments/environment';
import { MovimientoInventario } from '../interfaces/MovimientoInventario';
import { TrasladoProducto } from '../interfaces/MovimientoInventario';
import { EntradaRequest } from '../interfaces/MovimientoInventario';
import { MovimientoHistorial } from '../interfaces/MovimientoInventario';

@Injectable({
  providedIn: 'root'
})
export class TiendaInventarioService {

  private urlApi: string = environment.endpoint + 'TiendaInventario/';

  constructor(private http: HttpClient) { }

  // ==================== TIENDAS DISPONIBLES ====================
  
  // Coincide con [HttpGet("TiendasDisponibles")]
  obtenerTiendasDisponibles(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}TiendasDisponibles`);
  }

  // ==================== INVENTARIO POR TIENDA ====================
  
  // Coincide con [HttpGet("InventarioTienda/{tiendaId}")]
  obtenerInventarioTienda(tiendaId: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}InventarioTienda/${tiendaId}`);
  }

  // ==================== PRODUCTOS POR TIENDA ====================
  
  // Coincide con [HttpGet("ProductosTienda/{tiendaId}")]
  obtenerProductosTienda(tiendaId: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}ProductosTienda/${tiendaId}`);
  }
}