import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, // <--- NECESARIO para el router-outlet
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
correoUsuario: string = "";

  constructor(private router: Router) { // Inyecta el Router para el logout
    // Revisa cómo guarda la sesión tu 'RolNavegacionService'
    // Si el servicio usa la clave 'usuario', cámbiala aquí:
    const sesion = localStorage.getItem('usuario'); 
    
    if (sesion) {
      const objetoUsuario = JSON.parse(sesion);
      // Según tu log anterior, la propiedad es 'correo'
      this.correoUsuario = objetoUsuario.correo; 
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuario'); // Limpia la sesión
    this.router.navigate(['/login']);    // Redirige al login
  }
}