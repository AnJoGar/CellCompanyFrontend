import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { ProductoBodega } from '../interfaces/Bodega';

@Injectable({
  providedIn: 'root'
})
export class ProductoBodegaService {

  private urlApi: string = environment.endpoint + "ProductoBodega/"; 

  constructor(private http: HttpClient) { }

  lista(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`);
  }

  obtenerPorId(id: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Obtener/${id}`);
  }

  crear(producto: Partial<ProductoBodega>): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Crear`, producto);
  }

  editar(producto: ProductoBodega): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, producto);
  }

  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }
}