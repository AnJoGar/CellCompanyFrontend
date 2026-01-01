import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';

import { ReporteInterface } from '../interfaces/reporte';
import{ environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private urlApi: string=environment.endpoint + "Cliente/";
    private urlApi1: string=environment.endpoint + "Credito/";
  constructor(private http: HttpClient) { }
 
  
 
  reporteCreditos(fechaInicio: string, fechaFin: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
   }

   reporteCreditosSinFecha(): Observable<ResponseApi> {
  return this.http.get<ResponseApi>(`${this.urlApi}Reporte`);
}

 // NUEVO: Método para exportar a Excel
  exportarExcel(fechaInicio?: string, fechaFin?: string): Observable<Blob> {
    let url = `${this.urlApi}reporte-excel`;
    
    // Agregar parámetros si existen
    const params: string[] = [];
    if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
    if (fechaFin) params.push(`fechaFin=${fechaFin}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get(url, { 
      responseType: 'blob' // Importante para archivos
    });
  }


    eliminarCredito(id: number): Observable<ResponseApi> {

    return this.http.delete<ResponseApi>(`${this.urlApi1}Eliminar/${id}`);

  }


}