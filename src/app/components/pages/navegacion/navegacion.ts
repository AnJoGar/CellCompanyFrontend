import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router'; // Añadido RouterModule
import { CommonModule } from '@angular/common'; // Añadido CommonModule

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import{Menu }from '../../../interfaces/Menu';
import{HttpClient} from '@angular/common/http';
//import{Observable} from 'rxjs';
import{MenuService} from '../../../services/Menu-Service';
import{RolNavegacionService} from '../../../services/rol-navegacion';

@Component({
  selector: 'app-navegacion',
  imports: [CommonModule,     // Para *ngFor y pipes
    RouterModule,     // Para router-outlet y routerLink
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion implements OnInit {

  
 listaMenu:Menu[]=[];
correoUsuario:string="";
rolUsuario:string="";
  isHandset$!: Observable<boolean>; // Usa el operador '!' para indicar que se inicializará después

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private _menuServicio: MenuService,
    private _rolUsuario: RolNavegacionService,
    private cdr: ChangeDetectorRef
  ) {
    // Inicializa isHandset$ dentro del constructor
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }


ngOnInit(): void {
    console.log("Iniciando NavegacionComponent...");

    const usuario = this._rolUsuario.obtenerSession();
    
    if (usuario != null) {
      console.log("Usuario recuperado de la sesión:", usuario);
      
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;

      // Llamada al servicio de menú
      this._menuServicio.getRoles(usuario.id).subscribe({
        next: (data) => {
          console.log("Respuesta del servidor para el menú:", data);
          
          if (data.status) {
            this.listaMenu = data.value;
            console.log("listaMenu asignada con:", this.listaMenu.length, "elementos.");
            
            // Forzamos la detección de cambios para que el *ngFor reaccione
            this.cdr.detectChanges(); 
          } else {
            console.warn("El servidor respondió con status: false", data.msg);
          }
        },
        error: (e) => {
          console.error("Error al obtener el menú desde el servidor:", e);
        }
      });
    } else {
      console.error("No se encontró sesión de usuario. Redirigiendo al login...");
      this.router.navigate(['login']);
    }
  }

cerrarSession(){

  this._rolUsuario.eliminarSession();
  this.router.navigate(['login']);

}
}
