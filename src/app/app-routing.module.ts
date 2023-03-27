import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// User components
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardChildComponent } from './components/dashboard-child/dashboard-child.component';
import { VerificationComponent } from './components/verification/verification.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { HomepageComponent } from './components/public/homepage/homepage.component';
import { FaqsComponent } from './components/public/faqs/faqs.component';
import { TermsComponent } from './components/public/terms/terms.component';
import { PrivacyPolicyComponent } from './components/public/privacy-policy/privacy-policy.component';
import { GiftCardsComponent } from './components/gift-cards/gift-cards.component';
import { GiftCardComponent } from './components/gift-card/gift-card.component';
import { RatesComponent } from './components/rates/rates.component';

// admin components
import { UsersComponent } from './components/admin/users/users.component';
import { CardsComponent } from './components/admin/cards/cards.component';
import { PendingTransactionsComponent } from './components/admin/pending-transactions/pending-transactions.component';
import { CompletedTransactionsComponent } from './components/admin/completed-transactions/completed-transactions.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminDashboardChildComponent } from './components/admin/admin-dashboard-child/admin-dashboard-child.component';
import { RedeemCardsComponent } from './components/redeem-cards/redeem-cards.component';
import { FeedbacksComponent } from './components/admin/feedbacks/feedbacks.component';

import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'verification', component: VerificationComponent, pathMatch: 'full' },
  { path: 'forgot-password', component: ForgotPasswordComponent, pathMatch: 'full' },
  { path: 'reset-password', component: ResetPasswordComponent, pathMatch: 'full' },
  { path: 'faqs', component: FaqsComponent, pathMatch: 'full' },
  { path: 'terms', component: TermsComponent, pathMatch: 'full' },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, pathMatch: 'full' },
  // { path: 'admin', redirectTo: 'admin/login' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardChildComponent, pathMatch: 'full' },
      { path: 'gift-cards', component: GiftCardsComponent, pathMatch: 'full' },
      { path: 'gift-card/:name/:id', component: GiftCardComponent, pathMatch: 'full' },
      { path: 'redeem-cards', component: RedeemCardsComponent, pathMatch: 'full' },
      { path: 'rates', component: RatesComponent, pathMatch: 'full' },
      { path: 'settings', component: SettingsComponent, pathMatch: 'full' },
      { path: 'transactions', component: TransactionsComponent, pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    children: [
      { path: 'login', component: AdminLoginComponent, pathMatch: 'full' },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', component: AdminDashboardChildComponent, pathMatch: 'full' },
          { path: 'transactions', component: CompletedTransactionsComponent, pathMatch: 'full' },
          { path: 'pending-transactions', component: PendingTransactionsComponent, pathMatch: 'full' },
          { path: 'cards', component: CardsComponent, pathMatch: 'full' },
          { path: 'feedbacks', component: FeedbacksComponent, pathMatch: 'full' },
          { path: 'users', component: UsersComponent, pathMatch: 'full' },
          { path: '**', redirectTo: 'admin/login' }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
