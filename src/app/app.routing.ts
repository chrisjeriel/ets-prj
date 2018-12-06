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
import { PolicyIssuanceAltComponent } from './underwriting/policy-issuance/policy-issuance-alt.component';
import { ExtractExpiringPoliciesComponent } from  './underwriting/expiry-and-renewal/extract-expiring-policies/extract-expiring-policies.component';
import { ExpiryListingComponent } from './underwriting/expiry-and-renewal/expiry-listing/expiry-listing.component';


import { DummyComponent } from './_components/common/dummy/dummy.component'
import { PolCreatePARComponent } from './underwriting/policy-issuance/pol-create-par/pol-create-par.component';
import { PolCreateAlterationPARComponent } from './underwriting/policy-issuance/pol-create-alteration-par/pol-create-alteration-par.component';
import { ParListingComponent } from './underwriting/policy-issuance/par-listing/par-listing.component';
import { AltParListingComponent } from './underwriting/policy-issuance/alt-par-listing/alt-par-listing.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'quotation', component: QuotationComponent, canActivate: [AuthGuard] },
    { path: 'policy-issuance', component: PolicyIssuanceComponent, canActivate: [AuthGuard] },
    { path: 'policy-issuance-alt', component: PolicyIssuanceAltComponent, canActivate: [AuthGuard] },
    { path: 'dummy', component: DummyComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'quotation-inquiry', component: QuotationInquiryComponent },
    { path: 'notes', component: NotesComponent },
    { path: 'quotation-processing', component: QuotationProcessingComponent },
    { path: 'extract-expiring-policies', component: ExtractExpiringPoliciesComponent },
    { path: 'policy', component: PolicyIssuanceComponent },
    { path: 'createPAR', component: PolCreatePARComponent },
    { path: 'createAlterationPAR', component: PolCreateAlterationPARComponent },
    { path: 'par-listing', component: ParListingComponent },
    { path: 'alt-par-listing', component: AltParListingComponent },
    { path: 'expiry-listing', component: ExpiryListingComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);