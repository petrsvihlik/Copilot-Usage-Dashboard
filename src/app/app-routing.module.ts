import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgLevelComponent } from './dashboard/org-level/org-level.component';
import { EnterpriseLevelComponent } from './dashboard/enterprise-level/enterprise-level.component';
import { ImpactAnalysisComponent } from './dashboard/impact-analysis/impact-analysis.component';
import { SampleApiResponseComponent } from './dashboard/sample-api-response/sample-api-response.component';
import { OrgSeatsComponent } from './dashboard/org-seats/org-seats.component';
import { LoginComponent } from './auth/login/login.component';
import { CallbackComponent } from './auth/callback/callback.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: OrgLevelComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'organization-level', component: OrgLevelComponent, canActivate: [AuthGuard] },
  { path: 'enterprise-level', component: EnterpriseLevelComponent, canActivate: [AuthGuard] },
  { path: 'impact', component: ImpactAnalysisComponent, canActivate: [AuthGuard] },
  { path: 'sample-response', component: SampleApiResponseComponent, canActivate: [AuthGuard] },
  { path: 'org-seats', component: OrgSeatsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
