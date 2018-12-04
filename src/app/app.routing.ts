import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { QuotationComponent } from './quotation/quotation.component'
import { QuotationInquiryComponent } from './quotation/quotation-inquiry/quotation-inquiry.component';
import { NotesComponent } from './notes/notes.component';
import { QuotationProcessingComponent } from './quotation/quotation-processing/quotation-processing.component';
import { PolicyIssuanceComponent } from './underwriting/policy-issuance/policy-issuance.component';
import { ExtractExpiringPoliciesComponent } from  './underwriting/expiry-and-renewal/extract-expiring-policies/extract-expiring-policies.component';

import { DummyComponent } from './_components/common/dummy/dummy.component'

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'quotation', component: QuotationComponent, canActivate: [AuthGuard] },
    { path: 'policy-issuance', component: PolicyIssuanceComponent, canActivate: [AuthGuard] },
    { path: 'dummy', component: DummyComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'quotation-inquiry', component: QuotationInquiryComponent },
    { path: 'notes', component: NotesComponent },
    { path: 'quotation-processing', component: QuotationProcessingComponent },
    { path: 'extract-expiring-policies', component: ExtractExpiringPoliciesComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);