import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ResizableModule } from 'angular-resizable-element';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_components/common/alert';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { QuotationComponent } from './quotation/quotation.component';
import { GeneralInfoComponent } from './quotation/general-info/general-info.component';
import { CoverageComponent } from './quotation/coverage/coverage.component';
import { QuoteOptionComponent } from './quotation/quote-option/quote-option.component';
import { InternalCompetitionComponent } from './quotation/internal-competition/internal-competition.component';
import { HoldCoverComponent } from './quotation/hold-cover/hold-cover.component';;
import { AttachmentComponent } from './quotation/attachment/attachment.component'
import { DummyComponent } from './_components/common/dummy/dummy.component';
import { QuoteEndorsementComponent } from './quotation/quote-endorsement/quote-endorsement.component';
import { CustTableComponent } from './_components/common/cust-table/cust-table.component';
import { CustEditableTableComponent } from './_components/common/cust-editable-table/cust-editable-table.component';
import { QuotationInquiryComponent } from './quotation/quotation-inquiry/quotation-inquiry.component';
import { ListOfQuotationsComponent } from './quotation/quotation-inquiry/list-of-quotations/list-of-quotations.component';
import { HoldCoverMonitoringListComponent } from './quotation/quotation-inquiry/hold-cover-monitoring-list/hold-cover-monitoring-list.component';
import { NotesComponent } from './notes/notes.component';;
import { QuotationProcessingComponent } from './quotation/quotation-processing/quotation-processing.component';
import { ParListingComponent } from './underwriting/policy-issuance/par-listing/par-listing.component';
import { PolEndorsementComponent } from './underwriting/policy-issuance/pol-endorsement/pol-endorsement.component';
import { PolCoInsuranceComponent } from './underwriting/policy-issuance/pol-co-insurance/pol-co-insurance.component';
import { PolicyIssuanceComponent } from './underwriting/policy-issuance/policy-issuance.component';
import { PolCreatePARComponent } from './underwriting/policy-issuance/pol-create-par/pol-create-par.component';
import { PolCreateAlterationPARComponent } from './underwriting/policy-issuance/pol-create-alteration-par/pol-create-alteration-par.component';
import { ModalComponent } from './_components/common/modal/modal.component';
import { PolCoverageComponent } from './underwriting/policy-issuance/pol-coverage/pol-coverage.component';
import { PolOtherRatesComponent } from './underwriting/policy-issuance/pol-other-rates/pol-other-rates.component';
import { ExpiryAndRenewalComponent } from './underwriting/expiry-and-renewal/expiry-and-renewal.component';
import { ExtractExpiringPoliciesComponent } from './underwriting/expiry-and-renewal/extract-expiring-policies/extract-expiring-policies.component';
import { PolGenInfoComponent } from './underwriting/policy-issuance/pol-gen-info/pol-gen-info.component'
import { AltParListingComponent } from './underwriting/policy-issuance/alt-par-listing/alt-par-listing.component';
import { PolAttachmentComponent } from './underwriting/policy-issuance/pol-attachment/pol-attachment.component';
import { PolPostComponent } from './underwriting/policy-issuance/pol-post/pol-post.component';
import { ExpiryListingComponent } from './underwriting/expiry-and-renewal/expiry-listing/expiry-listing.component';
import { PolicyIssuanceAltComponent } from './underwriting/policy-issuance/policy-issuance-alt.component';
import { GenerateDocumentsComponent } from './underwriting/generate-documents/generate-documents.component';
import { PolicyPrintingComponent } from './underwriting/generate-documents/policy-printing/policy-printing.component';
import { PolicyToHoldCoverComponent } from './underwriting/expiry-and-renewal/policy-to-hold-cover/policy-to-hold-cover.component';
import { ChangeQuoteStatusComponent } from './quotation/change-quote-status/change-quote-status.component';
import { PolAlopComponent } from './underwriting/policy-issuance/pol-alop/pol-alop.component';
import { InquiryComponent } from './underwriting/inquiry/inquiry.component';
import { PolicyInquiryComponent } from './underwriting/inquiry/policy-inquiry/policy-inquiry.component';
import { QuoAlopComponent } from './quotation/quo-alop/quo-alop.component';
import { CustNonDatatableComponent } from './_components/common/cust-non-datatable/cust-non-datatable.component';
import { CustEditableNonDatatableComponent } from './_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SearchPipe } from './_pipes/search.pipe';
import { PolDistListComponent } from './underwriting/distribution/pol-dist-list/pol-dist-list.component';
import { SelectComponent } from './_components/common/select/select.component';
import { MultipleSelectComponent } from './_components/common/multiple-select/multiple-select.component';
import { DistributionByRiskComponent } from './underwriting/policy-distribution/pol-distribution/distribution-by-risk/distribution-by-risk.component';
import { PolicyDistributionComponent } from './underwriting/policy-distribution/policy-distribution.component';
import { PolDistributionComponent } from './underwriting/policy-distribution/pol-distribution/pol-distribution.component';
import { PolDistComponent } from './underwriting/policy-distribution/pol-dist/pol-dist.component';
import { InwardPolBalanceComponent } from './underwriting/policy-issuance/inward-pol-balance/inward-pol-balance.component';
import { PolItemComponent } from './underwriting/policy-issuance/pol-item/pol-item.component';
import { PolCreateOpenCoverComponent } from './underwriting/policy-issuance/pol-create-open-cover/pol-create-open-cover.component';
import { PolIssuanceOpenCoverLetterComponent } from './underwriting/policy-issuance/pol-issuance-open-cover-letter.component';
import { PolGenInfoOpenCoverComponent } from './underwriting/policy-issuance/pol-gen-info-open-cover/pol-gen-info-open-cover.component';
import { PolSumInsuredOpenCoverComponent } from './underwriting/policy-issuance/pol-sum-insured-open-cover/pol-sum-insured-open-cover.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        ResizableModule,
        AngularFontAwesomeModule,
        NgbModule,
        SidebarModule.forRoot(),
        FormsModule,
        DataTablesModule,
        NgxPaginationModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        QuotationComponent,
        GeneralInfoComponent,
        CoverageComponent,
        QuoteOptionComponent,
        InternalCompetitionComponent,
        QuoteEndorsementComponent,
        DummyComponent,
        CustTableComponent,
        NotesComponent,
        QuotationProcessingComponent,
        HoldCoverComponent,
        AttachmentComponent,
        CustEditableTableComponent,
        QuotationInquiryComponent,
        ListOfQuotationsComponent,
        HoldCoverMonitoringListComponent,
        DummyComponent,
        CustTableComponent,
        CustEditableTableComponent,
        ParListingComponent,
        PolEndorsementComponent,
        PolCoInsuranceComponent,
        PolicyIssuanceComponent,
        PolCreatePARComponent,
        PolCreateAlterationPARComponent,
        ModalComponent,
        PolCoverageComponent,
        PolOtherRatesComponent,
        ExpiryAndRenewalComponent,
        ExtractExpiringPoliciesComponent,
        PolGenInfoComponent,
        AltParListingComponent,
        PolAttachmentComponent,
        PolPostComponent,
        ExpiryListingComponent,
        PolicyIssuanceAltComponent,
        PolicyToHoldCoverComponent,
        ChangeQuoteStatusComponent,
        GenerateDocumentsComponent,
        PolicyPrintingComponent,
        PolAlopComponent,
        InquiryComponent,
        PolicyInquiryComponent,
        QuoAlopComponent,
        CustNonDatatableComponent,
        CustEditableNonDatatableComponent,
        SearchPipe,
        PolDistListComponent,
        SelectComponent,
        MultipleSelectComponent,
        DistributionByRiskComponent,
        PolDistComponent,
        PolicyDistributionComponent,
        PolDistributionComponent,
        InwardPolBalanceComponent,
        PolItemComponent,
        PolCreateOpenCoverComponent,
        PolIssuanceOpenCoverLetterComponent,
        PolGenInfoOpenCoverComponent,
        PolSumInsuredOpenCoverComponent,
    ],

    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent],
})

export class AppModule { }
