import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import{Sesion} from '../interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class RolNavegacionService {

  constructor( private _snackBar: MatSnackBar) {
   }

   mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });   

  }

  guardarSesionUsuario(usuarioSeccion:Sesion){
    localStorage.setItem("usuario",JSON.stringify(usuarioSeccion));
  }

  obtenerSession(){
    const dataCadena=localStorage.getItem("usuario");
    const usuario =JSON.parse(dataCadena!);
    return usuario;
  }

  eliminarSession(){
    localStorage.removeItem("usuario");
  }
}