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
export class MovimientoInventarioService {

   private urlApi: string = environment.endpoint + 'MovimientoInventario/';

  constructor(private http: HttpClient) { }

  // ==================== TRASLADOS ====================
  
  // Coincide con [HttpPost("RegistrarTraslado")]
  registrarTraslado(traslado: TrasladoProducto): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}RegistrarTraslado`, traslado);
  }

  // ==================== ENTRADAS ====================
  
  // Coincide con [HttpPost("RegistrarEntrada")]
  registrarEntrada(entrada: EntradaRequest): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}RegistrarEntrada`, entrada);
  }

  // ==================== CONSULTAS DE HISTORIAL ====================
  
  // Coincide con [HttpGet("Historial")]
  obtenerHistorial(
    productoId?: number,
    tiendaId?: number,
    fechaInicio?: string,
    fechaFin?: string,
    tipoMovimiento?: string
  ): Observable<ResponseApi> {
    let params = new HttpParams();
    
    if (productoId) params = params.set('productoId', productoId.toString());
    if (tiendaId) params = params.set('tiendaId', tiendaId.toString());
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    if (tipoMovimiento) params = params.set('tipoMovimiento', tipoMovimiento);

    return this.http.get<ResponseApi>(`${this.urlApi}Historial`, { params });
  }

  // Coincide con [HttpGet("HistorialPorIMEI/{imei}")]
  obtenerHistorialPorIMEI(imei: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}HistorialPorIMEI/${imei}`);
  }
}