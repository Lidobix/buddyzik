import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

import { MybuddiesComponent } from './mybuddies/mybuddies.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SearchbuddyComponent } from './searchbuddy/searchbuddy.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guards';
import { EmptyToMyProfileComponent } from './empty-to-my-profile/empty-to-my-profile.component';

import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';

const routes: Routes = [
  {
    path: '',
    component: EmptyToMyProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'lostpassword',
    component: ResetPwdComponent,
  },
  {
    path: 'auth/login',
    component: LoginPageComponent,
  },
  {
    path: 'registration',
    component: EditProfileComponent,
  },

  {
    path: 'edition',
    component: EditProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:uuid',
    component: ProfilePageComponent,
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
    path: 'blankprofile',
    component: EmptyToMyProfileComponent,
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
