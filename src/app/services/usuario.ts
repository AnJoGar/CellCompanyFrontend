import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { ResponseApi } from '../interfaces/response-api';
import { environment } from '../../environments/environment';
import { Login } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlApi: string = environment.endpoint + "UsuarioAdmin/";
   private urlApi1: string = environment.endpoint + "EmailValidation/";
  constructor(private http: HttpClient) {


  }

  ObtenerIniciarSesion(request: Login): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.urlApi}IniciarSesion`, request)
  }

  ObtenerUsuarios(): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)

  }

  ObtenerUsuarioId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlApi}${id}`);
  }

  GuardarUsuario(request: Usuario): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)

  }

  GuardarUsuarioSinV(request: Usuario): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.urlApi}GuardarASinVer`, request)

  }

  EditarUsuario(request: Usuario): Observable<ResponseApi> {

    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)

  }

  EliminarUsuario(id: number): Observable<ResponseApi> {

    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);

  }

  // Paso 1: Enviar datos y disparar el correo
guardarAdmin(usuario: Usuario): Observable<ResponseApi> {
  return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, usuario);
}

// Paso 2: Validar el código y confirmar la creación real
ValidarCodigoAdmin(request: { correo: string, codigo: string }): Observable<ResponseApi> {
  return this.http.post<ResponseApi>(`${this.urlApi1}ValidarCodigoAdmin`, request);
}
}