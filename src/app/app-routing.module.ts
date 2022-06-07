import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MybuddiesComponent } from './mybuddies/mybuddies.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SearchbuddyComponent } from './searchbuddy/searchbuddy.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    // component: LandingPageComponent
  },
  {
    path: 'login',
    // component: HomepageComponent,
    component: LandingPageComponent,
  },
  {
    path: 'registration',
    component: EditProfileComponent,
  },
  {
    path: 'profile/:uuId',
    component: ProfilePageComponent,
  },
  {
    path: 'home',
    component: HomepageComponent,
  },
  {
    path: 'mybuddies',
    component: MybuddiesComponent,
  },

  {
    path: 'searchbuddy',
    component: SearchbuddyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
