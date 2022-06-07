import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import { LoginCardComponent } from './login-card/login-card.component';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { HomepageComponent } from './homepage/homepage.component';

import { MybuddiesComponent } from './mybuddies/mybuddies.component';
import { BuddycardComponent } from './buddycard/buddycard.component';
import { SearchbuddyComponent } from './searchbuddy/searchbuddy.component';
import { NavComponent } from './nav/nav.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginCardComponent,
    LandingPageComponent,
    ProfilePageComponent,
    EditProfileComponent,
    HomepageComponent,
    MybuddiesComponent,
    BuddycardComponent,
    SearchbuddyComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
