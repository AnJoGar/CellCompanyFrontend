import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; // ⚠️ Verifica que la ruta de importación sea correcta según tus carpetas

export const routes: Routes = [
    // 1. Si la ruta está vacía, redirigir al login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // 2. La ruta del login carga el componente Login
    { path: 'login', component: LoginComponent },

    // 3. Comentamos esto TEMPORALMENTE hasta que creemos el Dashboard/Layout
    {
        path: 'pages',
        loadChildren: () => import('./components/layout/layout.routes').then(m => m.LAYOUT_ROUTES)
    },

    // 4. Cualquier ruta desconocida redirige al login
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];