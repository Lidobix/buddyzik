import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { HomepageComponent } from './homepage/homepage.component';

import { MybuddiesComponent } from './mybuddies/mybuddies.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SearchbuddyComponent } from './searchbuddy/searchbuddy.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './guards/auth.guards';

const routes: Routes = [
  {
    path: '',
    // component: HomepageComponent,
    component: LoginPageComponent,
  },
  {
    path: 'auth/login',
    // component: HomepageComponent,
    component: LoginPageComponent,
  },
  {
    path: 'registration',
    component: EditProfileComponent,
  },
  {
    path: 'profile/:uuid',
    component: ProfilePageComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: HomepageComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'mybuddies',
    component: MybuddiesComponent,
    // canActivate: [AuthGuard],
  },

  {
    path: 'searchbuddy',
    component: SearchbuddyComponent,
    // canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
