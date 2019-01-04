import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { QuotationComponent } from './quotation/quotation.component'
import { QuotationInquiryComponent } from './quotation/quotation-inquiry/quotation-inquiry.component';
import { HoldCoverMonitoringListComponent } from './quotation/quotation-inquiry/hold-cover-monitoring-list/hold-cover-monitoring-list.component';
import { NotesComponent } from './notes/notes.component';
import { QuotationProcessingComponent } from './quotation/quotation-processing/quotation-processing.component';
import { PolicyIssuanceComponent } from './underwriting/policy-issuance/policy-issuance.component';
import { PolicyIssuanceAltComponent } from './underwriting/policy-issuance/policy-issuance-alt.component';
import { ExtractExpiringPoliciesComponent } from './underwriting/expiry-and-renewal/extract-expiring-policies/extract-expiring-policies.component';
import { ExpiryListingComponent } from './underwriting/expiry-and-renewal/expiry-listing/expiry-listing.component';
import { DummyComponent } from './_components/common/dummy/dummy.component'
import { PolCreatePARComponent } from './underwriting/policy-issuance/pol-create-par/pol-create-par.component';
import { PolCreateAlterationPARComponent } from './underwriting/policy-issuance/pol-create-alteration-par/pol-create-alteration-par.component';
import { ParListingComponent } from './underwriting/policy-issuance/par-listing/par-listing.component';
import { AltParListingComponent } from './underwriting/policy-issuance/alt-par-listing/alt-par-listing.component';
import { HoldCoverComponent } from './quotation/hold-cover/hold-cover.component';
import { PolicyPrintingComponent } from './underwriting/generate-documents/policy-printing/policy-printing.component';
import { PolicyToHoldCoverComponent } from './underwriting/expiry-and-renewal/policy-to-hold-cover/policy-to-hold-cover.component';
import { ChangeQuoteStatusComponent } from './quotation/change-quote-status/change-quote-status.component'
import { PolicyInquiryComponent } from './underwriting/inquiry/policy-inquiry/policy-inquiry.component';
import { PolDistListComponent } from './underwriting/distribution/pol-dist-list/pol-dist-list.component';
import { PolDistComponent } from './underwriting/policy-distribution/pol-dist/pol-dist.component';
import { PolicyDistributionComponent } from './underwriting/policy-distribution/policy-distribution.component';
import { PolCreateOpenCoverComponent } from './underwriting/policy-issuance/pol-create-open-cover/pol-create-open-cover.component';
import { PolIssuanceOpenCoverLetterComponent } from './underwriting/policy-issuance/pol-issuance-open-cover-letter.component';
import { PurgeExtractedPolicyComponent } from './underwriting/expiry-and-renewal/purge-extracted-policy/purge-extracted-policy.component';
import { UpdateInformationComponent } from './utilities/update-information/update-information.component'
import { OpenCoverProcessingComponent } from './quotation/open-cover-processing/open-cover-processing.component';
import { OpenCoverComponent } from './quotation/open-cover/open-cover.component';
import { ClmClaimProcessingComponent } from './claims/claim/clm-claim-processing/clm-claim-processing.component';
import { ClmGenInfoClaimComponent } from './claims/claim/clm-claim-processing/clm-gen-info-claim/clm-gen-info-claim.component';
import { ClaimComponent } from './claims/claim/claim.component';
import { NegateDistributionComponent } from './underwriting/policy-distribution/negate-distribution/negate-distribution.component';
import { DummyComponent2 } from './_components/common/dummy2/dummy2.component'


const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'quotation', component: QuotationComponent, canActivate: [AuthGuard] },
    { path: 'policy-issuance', component: PolicyIssuanceComponent },
    { path: 'policy-issuance-alt', component: PolicyIssuanceAltComponent },
    { path: 'dummy', component: DummyComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'quotation-inquiry', component: QuotationInquiryComponent },
    { path: 'hold-cover-monitoring', component: HoldCoverMonitoringListComponent },
    { path: 'notes', component: NotesComponent },
    { path: 'quotation-processing', component: QuotationProcessingComponent },
    { path: 'extract-expiring-policies', component: ExtractExpiringPoliciesComponent },
    { path: 'policy', component: PolicyIssuanceComponent },
    { path: 'create-policy', component: PolCreatePARComponent },
    { path: 'create-alteration', component: PolCreateAlterationPARComponent },
    { path: 'policy-listing', component: ParListingComponent },
    { path: 'alt-policy-listing', component: AltParListingComponent },
    { path: 'expiry-listing', component: ExpiryListingComponent },
    { path: 'quotation-HoldCover', component: HoldCoverComponent },
    { path: 'policy-printing', component: PolicyPrintingComponent },
    { path: 'policy-holdcover', component: PolicyToHoldCoverComponent },
    { path: 'change-quote-status', component: ChangeQuoteStatusComponent },
    { path: 'policy-inquiry', component: PolicyInquiryComponent },
    { path: 'pol-dist-list', component: PolDistListComponent },
    { path: 'pol-dist', component: PolDistComponent },
    { path: 'policy-dist', component: PolicyDistributionComponent },
    { path: 'create-open-cover', component: PolCreateOpenCoverComponent },
    { path: 'create-open-cover-letter', component: PolIssuanceOpenCoverLetterComponent },
    { path: 'purge-extracted-policy', component: PurgeExtractedPolicyComponent },
    { path: 'update-info', component: UpdateInformationComponent },
    { path: 'open-cover-processing', component: OpenCoverProcessingComponent },
    { path: 'open-cover', component: OpenCoverComponent },
    { path: 'clm-claim-processing', component: ClmClaimProcessingComponent },
    { path: 'clm-gen-info-claim', component: ClmGenInfoClaimComponent },
    { path: 'claims-claim', component: ClaimComponent },
    { path: 'negate-distribution', component: NegateDistributionComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);