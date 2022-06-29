import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

import { ProfilePageComponent } from './profile-page/profile-page.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { HomepageComponent } from './homepage/homepage.component';
import { MybuddiesComponent } from './mybuddies/mybuddies.component';
import { BuddycardComponent } from './buddycard/buddycard.component';
import { SearchbuddyComponent } from './searchbuddy/searchbuddy.component';
import { NavComponent } from './nav/nav.component';
import { CookieService } from 'ngx-cookie-service';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerInterceptor } from './spinner.interceptor';

import { EmptyToMyProfileComponent } from './empty-to-my-profile/empty-to-my-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ProfilePageComponent,
    EditProfileComponent,
    HomepageComponent,
    MybuddiesComponent,
    BuddycardComponent,
    SearchbuddyComponent,
    NavComponent,
    LoginPageComponent,
    PageNotFoundComponent,
    ResetPwdComponent,
    SpinnerComponent,
    EmptyToMyProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
