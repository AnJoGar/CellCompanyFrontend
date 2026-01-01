import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoCredito} from '../interfaces/Pago';

import { ReporteInterface } from '../interfaces/reporte';
import{ environment } from '../../environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { UsuarioRegistro } from '../interfaces/registroCompleto';
@Injectable({
  providedIn: 'root'
})
export class UsuarioRegistroService {

  // Asumiendo que tu urlApi termina en /api/
  private urlApi: string = environment.endpoint + "Usuario/"; 

  constructor(private http: HttpClient) { }

 // usuario.service.ts
crearUsuarioCompleto(modelo: UsuarioRegistro): Observable<ResponseApi> {
  return this.http.post<ResponseApi>(`${this.urlApi}Guardar1`, modelo);
}
// En tu UsuarioRegistroService.ts

obtenerRegistroCompleto(idUsuario: number): Observable<ResponseApi> {
  return this.http.get<ResponseApi>(`${this.urlApi}ObtenerCompleto/${idUsuario}`);
}

obtenerRegistroSinId(): Observable<ResponseApi> {
  return this.http.get<ResponseApi>(`${this.urlApi}ObtenerCompletoSinId`);
}


// PUT: Editar registro
  editarCompleto(modelo: UsuarioRegistro): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}EditarCompleto`, modelo);
  }

  // DELETE: Eliminar registro
  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }

}