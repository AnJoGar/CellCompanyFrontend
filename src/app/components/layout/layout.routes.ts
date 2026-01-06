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
import{RegistrarBodegaComponent} from '../pages/registrar-bodega-component/registrar-bodega-component';
import{EditarBodegaComponent} from '../pages/editar-bodega-component/editar-bodega-component';
import{DasboardComponent} from '../pages/dasboard-component/dasboard-component';
import{InventarioTiendaComponent} from '../pages/inventario-tienda-component/inventario-tienda-component';
export const LAYOUT_ROUTES: Routes = [
    {
        path: '',
        component: Navegacion, 
        children: [
            // 1. Redirección inicial (Apuntando a Dashboard por defecto)
            { path: '', redirectTo: 'reportes-generales', pathMatch: 'full' },

            // 2. Rutas Principales (Nivel 1)
            { path: 'panel-control', component: DasboardComponent },
            { path: 'gestion-administradores', component: UsuarioComponent }, // Usuarios Admin
            { path: 'gestion-pagos', component: PagosComponent },
            { path: 'geolocalizacion-tiendas', component: UbicacionComponent },
            { path: 'historial-movimientos', component: InventarioTiendaComponent }, // Historial
            { path: 'reportes-generales', component: ReporteComponent },

            // 3. Rutas de Inventario / Registro (Nivel 2)
            { 
                path: 'registro-usuarios-app', 
                children: [
                    // Coincide con MenuAdmin Url: "bodega/registrar"
                    { path: 'nuevo', component: RegistroCompletoComponent }, 
                    // Coincide con MenuAdmin Url: "bodega/editar"
                   
                ]
            },
             { 
                path: 'inventario', 
                children: [
                    // Coincide con MenuAdmin Url: "bodega/registrar"
                    { path: 'registro-bodega', component: RegistrarBodegaComponent }, 
                    // Coincide con MenuAdmin Url: "bodega/editar"
                    { path: 'configuracion-bodega', component: EditarBodegaComponent }    
                ]
            },
            { 
                path: 'gestion-tiendas', 
                children: [
                    // Coincide con MenuAdmin Url: "tienda/registrar"
                    { path: 'nueva-sucursal', component: TiendaComponent }
                ]
            }
        ]
    }
];