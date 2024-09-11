import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'add-user',
    loadChildren: () => import('./add-user/add-user.module').then( m => m.AddUserPageModule)
  },
  {
    path: 'all-aplications',
    loadChildren: () => import('./all-aplications/all-aplications.module').then( m => m.AllAplicationsPageModule)
  },
  {
    path: 'all-users',
    loadChildren: () => import('./all-users/all-users.module').then( m => m.AllUsersPageModule)
  },
  {
    path: 'cv-modal',
    loadChildren: () => import('./cv-modal/cv-modal.module').then( m => m.CvModalPageModule)
  },
  {
    path: 'decline-modal',
    loadChildren: () => import('./decline-modal/decline-modal.module').then( m => m.DeclineModalPageModule)
  },
  {
    path: 'ga-validation',
    loadChildren: () => import('./ga-validation/ga-validation.module').then( m => m.GaValidationPageModule)
  },
  {
    path: 'employment-page',
    loadChildren: () => import('./employment-page/employment-page.module').then( m => m.EmploymentPagePageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'placed',
    loadChildren: () => import('./placed/placed.module').then( m => m.PlacedPageModule)
  },
  {
    path: 'recommended',
    loadChildren: () => import('./recommended/recommended.module').then( m => m.RecommendedPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
  },
  {
    path: 'reset-p',
    loadChildren: () => import('./reset-p/reset-p.module').then( m => m.ResetPPageModule)
  },
  {
    path: 'staffprofile',
    loadChildren: () => import('./staffprofile/staffprofile.module').then( m => m.StaffprofilePageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'view',
    loadChildren: () => import('./view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'wil-page',
    loadChildren: () => import('./wil-page/wil-page.module').then( m => m.WilPagePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
