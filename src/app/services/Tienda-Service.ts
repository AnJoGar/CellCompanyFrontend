import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tienda } from '../interfaces/Tienda';
import { ResponseApi } from '../interfaces/response-api';
@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  private urlApi: string = environment.endpoint + 'Tienda/';

  constructor(private http: HttpClient) { }

  // Coincide con [HttpGet] [Route("Lista")]
  obtenerTiendas(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`);
  }

  // Coincide con [HttpGet] [Route("Lista/{Id}")]
  obtenerTiendaPorId(id: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista/${id}`);
  }

  // Coincide con [HttpPost] (sin ruta específica, usa la base)
  crearTienda(tienda: Tienda): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}`, tienda);
  }

  // Si implementas Editar en el controlador, normalmente es PUT
  editarTienda(tienda: Tienda): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, tienda);
  }

  // Coincide con [HttpDelete("{id:int}")]
  eliminarTienda(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}${id}`);
  }
}