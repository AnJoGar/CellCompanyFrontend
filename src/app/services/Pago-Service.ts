import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoCredito} from '../interfaces/Pago';

import { ReporteInterface } from '../interfaces/reporte';
import{ environment } from '../../environments/environment';
import { ResponseApi } from '../interfaces/response-api';
@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  // Asumiendo que tu urlApi termina en /api/
  private urlApi: string = environment.endpoint + "Credito/"; 

  constructor(private http: HttpClient) { }

  registrarPago(pago: PagoCredito): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}RegistrarPago`, pago);
  }
}