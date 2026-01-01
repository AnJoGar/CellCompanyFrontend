// ubicacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ubicacion } from '../interfaces/ubicacion';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private urlApi: string = environment.endpoint + 'Ubicacion';

  constructor(private http: HttpClient) { }

  // Obtener ubicaciones de un usuario
  obtenerUbicacionesPorUsuario(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/ListarUltimasUbicaciones`);
  }
}