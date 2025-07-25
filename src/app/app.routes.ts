import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page.component'), //? Defecto
        children: [

            {
                path: 'trending',
                loadComponent: () => import('./gifs/pages/trending-page/trending-page.component') //? Defecto
            },

            {
                path: 'search',
                loadComponent: () => import('./gifs/pages/search-page/search-page.component') //? Defecto
            },
            {
                path: '**',
                redirectTo: 'trending' //!  Redirige a la página de trending si la ruta no coincide con ninguna de las anteriores
            }
        ]
    },

    {
        path: '**',
        redirectTo: 'dashboard' //!  Redirige a la página de dashboard si la ruta no coincide con ninguna de las anteriores
    }
];
