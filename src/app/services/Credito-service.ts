import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Credito } from '../interfaces/credito';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  private urlApi: string = environment.endpoint + "Credito/";

  constructor(private http: HttpClient) { }

  // Obtener todos los créditos
  GetAllCreditos(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`);
  }

  // Crear un nuevo crédito
  CreateCredito(modelo: Credito): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, modelo);
  }

  // Editar crédito existente
  UpdateCredito(modelo: Credito): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, modelo);
  }

  // Eliminar crédito (El método que te pasé anteriormente)
  DeleteCredito(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }

  obtenerHistorialPagosRealizados(creditoId: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}historial-pagos/${creditoId}`);
}
}