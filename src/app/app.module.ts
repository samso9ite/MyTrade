import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ImageUploadModule } from 'angular2-image-upload';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { NgxStarRatingModule } from 'ngx-star-rating';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardChildComponent } from './components/dashboard-child/dashboard-child.component';
import { LoaderComponent } from './components/loader/loader.component';
import { VerificationComponent } from './components/verification/verification.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { HomepageComponent } from './components/public/homepage/homepage.component';
import { FaqsComponent } from './components/public/faqs/faqs.component';
import { TermsComponent } from './components/public/terms/terms.component';
import { PrivacyPolicyComponent } from './components/public/privacy-policy/privacy-policy.component';
import { FooterComponent } from './components/public/core/footer/footer.component';
import { HeadersComponent } from './components/public/core/headers/headers.component';
import { UsersComponent } from './components/admin/users/users.component';
import { CardsComponent } from './components/admin/cards/cards.component';
import { PendingTransactionsComponent } from './components/admin/pending-transactions/pending-transactions.component';
import { CompletedTransactionsComponent } from './components/admin/completed-transactions/completed-transactions.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminDashboardChildComponent } from './components/admin/admin-dashboard-child/admin-dashboard-child.component';
import { AdminCardDetailsComponent } from './components/admin/admin-card-details/admin-card-details.component';
import { RedeemCardsComponent } from './components/redeem-cards/redeem-cards.component';
import { GiftCardsComponent } from './components/gift-cards/gift-cards.component';
import { GiftCardComponent } from './components/gift-card/gift-card.component';
import { RatesComponent } from './components/rates/rates.component';
import { FeedbacksComponent } from './components/admin/feedbacks/feedbacks.component';
import { TopInfoComponent } from './components/top-info/top-info.component';

export function tokenGetter(): string {
  // if (request.url.includes('admin')) {
  //   return localStorage.getItem('adminuui');
  // }
  return localStorage.getItem('uui');
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    DashboardChildComponent,
    LoaderComponent,
    VerificationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SidebarComponent,
    HeaderComponent,
    PageTitleComponent,
    SettingsComponent,
    TransactionsComponent,
    HomepageComponent,
    FaqsComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    FooterComponent,
    HeadersComponent,
    UsersComponent,
    CardsComponent,
    PendingTransactionsComponent,
    CompletedTransactionsComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminDashboardChildComponent,
    AdminCardDetailsComponent,
    RedeemCardsComponent,
    GiftCardsComponent,
    GiftCardComponent,
    RatesComponent,
    FeedbacksComponent,
    TopInfoComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ImageUploadModule.forRoot(),
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter
        // whitelistedDomains: ['localhost:3000', 'localhost:4200']
      }
    }),
    ModalModule.forRoot(),
    NgxDatatableModule,
    NgxStarRatingModule,
    PinchZoomModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
