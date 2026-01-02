import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{ environment } from '../../environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { ForgotPasswordDTO, ResetPasswordDTO } from '../interfaces/password';
@Injectable({ providedIn: 'root' })
export class PasswordService {
 // Ajusta tu URL
private urlApi: string = environment.endpoint + "Password/"; 
  constructor(private http: HttpClient) {}

forgotPassword(request: ForgotPasswordDTO): Observable<any> {
    return this.http.post(`${this.urlApi}forgot-passwordAdmin`, request, { responseType: 'text' as 'json' });
  }

  resetPassword(request: ResetPasswordDTO): Observable<any> {
    return this.http.post(`${this.urlApi}reset-passwordAdmin`, request, { responseType: 'text' as 'json' });
  }
}