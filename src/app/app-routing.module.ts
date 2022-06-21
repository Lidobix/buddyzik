import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { HomepageComponent } from './homepage/homepage.component';

import { MybuddiesComponent } from './mybuddies/mybuddies.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SearchbuddyComponent } from './searchbuddy/searchbuddy.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guards';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth/login',
    component: LoginPageComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'registration',
    component: EditProfileComponent,
  },
  {
    path: 'profile/:uuid',
    component: ProfilePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: HomepageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mybuddies',
    component: MybuddiesComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'searchbuddy',
    component: SearchbuddyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
