import { Routes } from '@angular/router';
import { LoginComponent} from '../login/login';
import { Dashboard } from '../pages/dashboard/dashboard/dashboard';
import { UsuarioComponent } from '../pages/usuario-component/usuario-component';
import { VerificarCodigoModel } from '../pages/modal/verificar-codigo-model/verificar-codigo-model';
import {Layout} from './layout/layout';
import { Navegacion } from '../pages/navegacion/navegacion';
import{ReporteComponent} from '../pages/reporte/reporte';
import{UbicacionComponent} from '../pages/ubicacion-component/ubicacion-component';
import{TiendaComponent} from '../pages/tienda-component/tienda-component';
import{PagosComponent} from '../pages/pagos-component/pagos-component';
import{RegistroCompletoComponent} from '../pages/registro-completo-component/registro-completo-component';

import{DasboardComponent} from '../pages/dasboard-component/dasboard-component';


export const LAYOUT_ROUTES: Routes = [
    {
       
        path: '',
        component: Navegacion, // <--- AQUÍ DEBE IR EL DISEÑO, NO EL LOGIN
        children: [
            { path: '', redirectTo: 'RegistrarBodega', pathMatch: 'full' },
            { path: 'dashboard1S', component: Dashboard },
            { path: 'movimientos', component: UsuarioComponent },
            { path: 'reportes', component: ReporteComponent },  
            { path: 'ubicacion', component: UbicacionComponent },
            {path: 'pagos',component: PagosComponent},
        {path: 'dashboard',component: DasboardComponent},
           // 🆕 Agrupación para /pages/tienda/registrar
            // Estructura que coincide con tu MenuAdmin
           { 
                path: 'tienda',  // ← SIN "pages/"
                children: [
                    { path: 'registrar', component: TiendaComponent }
                    
                ]
            },
            { 
                path: 'bodega',  // ← SIN "pages/"
                children: [
                    { path: 'registrar', component: RegistroCompletoComponent }
                    
                ]
            }
        ]
    }
];