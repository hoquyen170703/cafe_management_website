import { Routes } from '@angular/router';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouteGuardService } from '../service/route-guard.service';


export const MaterialRoutes: Routes = [
    {
        path: 'category',
        component: ManageCategoryComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    }
];
