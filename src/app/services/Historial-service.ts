// services/Historial-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoriaApp } from '../interfaces/HistoriaApp';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  private urlBase: string = environment.endpoint;

  constructor(private http: HttpClient) { }

  obtenerCalendarioPagos(creditoId: number, clienteId: number): Observable<HistoriaApp[]> {
    return this.http.get<HistoriaApp[]>(
      `${this.urlBase}Credito/calendariosinJWT/${creditoId}?clienteId=${clienteId}`
    );
  }
}