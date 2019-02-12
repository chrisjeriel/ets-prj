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
import { PaymentRequestsComponent } from './claims/payment-requests/payment-requests.component';
import { NegateDistributionComponent } from './underwriting/policy-distribution/negate-distribution/negate-distribution.component';
import { DummyComponent2 } from './_components/common/dummy2/dummy2.component';
import { PolMxLineComponent } from './underwriting/policy-maintenance/pol-mx-line/pol-mx-line.component';
import { PolBatchProcessingComponent } from './underwriting/policy-distribution/pol-batch-processing/pol-batch-processing.component'
import { DeductibleComponent } from './underwriting/maintenance/deductible/deductible.component';
import { RiskListComponent } from './underwriting/maintenance/risk-list/risk-list.component';
import { RiskFormComponent } from './underwriting/maintenance/risk-form/risk-form.component';
import { ClmClaimsInquiryComponent } from './claims/claim/clm-claims-inquiry/clm-claims-inquiry.component';
import { ClmChangeClaimStatusComponent } from './claims/claim/clm-change-claim-status/clm-change-claim-status.component';
import { UpdateGeneralInfoComponent } from './utilities/update-information/update-general-info/update-general-info.component';
import { UpdateInstallmentComponent } from './utilities/update-information/update-installment/update-installment.component';
import { PolMxCedingCoComponent } from './underwriting/policy-maintenance/pol-mx-ceding-co/pol-mx-ceding-co.component';
import { AccountingComponent } from './accounting/accounting.component';
import { AccountingInTrustComponent } from './accounting-in-trust/accounting-in-trust.component';
import { AcctArListingsComponent } from './accounting-in-trust/acct-ar-listings/acct-ar-listings.component';
import { CheckVoucherComponent } from './accounting-in-trust/check-voucher/check-voucher.component';
import { GenerateCvComponent } from './accounting-in-trust/check-voucher/generate-cv/generate-cv.component';
import { RequestForPaymentComponent } from './accounting-in-trust/request-for-payment/request-for-payment.component';
import { GeneratePaymentRequestComponent } from './accounting-in-trust/request-for-payment/generate-payment-request/generate-payment-request.component';
import { AcctItCancelledTransactionsComponent } from './accounting-in-trust/accounting-inquiry/acct-it-cancelled-transactions/acct-it-cancelled-transactions.component';
import { JournalVoucherComponent } from './accounting-in-trust/journal-voucher/journal-voucher.component';
import { GenerateJvComponent } from './accounting-in-trust/journal-voucher/generate-jv/generate-jv.component';
import { AccountingEntriesComponent } from './accounting-in-trust/extract/accounting-entries/accounting-entries.component';
import { TrialBalanceComponent } from './accounting-in-trust/extract/trial-balance/trial-balance.component';
import { OpenCoverInquiryComponent } from './quotation/open-cover-inquiry/open-cover-inquiry.component';
import { InvestmentsComponent } from './accounting-in-trust/investments/investments.component';
import { RegistersComponent } from './accounting-in-trust/reports/registers/registers.component';
import { ChangeTransStatToNewComponent } from './accounting-in-trust/utilities/change-trans-stat-to-new/change-trans-stat-to-new.component';
import { EditAccountingEntriesComponent } from './accounting-in-trust/utilities/edit-accounting-entries/edit-accounting-entries.component';
import { CancelTransactionsComponent } from './accounting-in-trust/utilities/cancel-transactions/cancel-transactions.component';
import { AcctItEditedAcctEntriesComponent } from './accounting-in-trust/accounting-inquiry/acct-it-edited-acct-entries/acct-it-edited-acct-entries.component';
import { GenerateNumberSeriesComponent } from './maintenance/accounting-in-trust/generate-number-series/generate-number-series.component';
import { ChartOfAccountsComponent } from './maintenance/accounting-in-trust/chart-of-accounts/chart-of-accounts.component';
import { GenerateOrComponent } from './accounting-service/official-receipt/generate-or/generate-or.component';
import { OfficialReceiptComponent } from './accounting-service/official-receipt/official-receipt.component';
import { AcctOrListingsComponent } from './accounting-service/acct-or-listings/acct-or-listings.component';
import { AccountingServiceComponent } from './accounting-service/accounting-service.component';
import { ExpenseBudgetComponent } from './accounting-service/expense-budget/expense-budget.component';
import { AccountingServiceExtractComponent } from './accounting-service/accounting-service-extract/accounting-service-extract.component';
import { ConsolidateAnnualTaxesWithheldComponent } from './accounting-service/utilities/consolidate-annual-taxes-withheld/consolidate-annual-taxes-withheld.component';
import { PcvComponent } from './accounting-service/pcv/pcv.component';
import { PcvListingsComponent } from './accounting-service/pcv/pcv-listings/pcv-listings.component';
import { MeBatchProcComponent } from './accounting-service/month-end/me-batch-proc/me-batch-proc.component';
import { MeDataCheckingComponent } from './accounting-service/month-end/me-data-checking/me-data-checking.component';
import { MeTrialBalProcComponent } from './accounting-service/month-end/me-trial-bal-proc/me-trial-bal-proc.component';
import { FixedAssetsComponent } from './accounting-service/fixed-assets/fixed-assets.component';
import { AccSRequestForPaymentComponent } from './accounting-service/acc-s-request-for-payment/acc-s-request-for-payment.component';
import { AccSGenerateRequestComponent } from './accounting-service/acc-s-request-for-payment/acc-s-generate-request/acc-s-generate-request.component';
import { CheckVoucherServiceComponent } from './accounting-service/check-voucher-service/check-voucher-service.component';
import { GenerateCvServiceComponent } from './accounting-service/check-voucher-service/generate-cv-service/generate-cv-service.component';
import { JournalVoucherServiceComponent } from './accounting-service/journal-voucher-service/journal-voucher-service.component';
import { GenerateJvServiceComponent } from './accounting-service/journal-voucher-service/generate-jv-service/generate-jv-service.component';
import { UtilitiesComponent } from './accounting-service/utilities/utilities.component';
import { CancelTransactionsServiceComponent } from './accounting-service/utilities/cancel-transactions-service/cancel-transactions-service.component';
import { RegistersServiceComponent } from './accounting-service/reports/registers-service/registers-service.component';


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
    { path: 'quotation-holdcover', component: HoldCoverComponent },
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
    { path: 'purge-extracted-policy', component: PurgeExtractedPolicyComponent },
    { path: 'update-info', component: UpdateInformationComponent },
    { path: 'open-cover-processing', component: OpenCoverProcessingComponent },
    { path: 'open-cover', component: OpenCoverComponent },
    { path: 'payment-request', component: PaymentRequestsComponent },
    { path: 'negate-distribution', component: NegateDistributionComponent },
    { path: 'maintenance-line', component: PolMxLineComponent },
    { path: 'batch-processing', component: PolBatchProcessingComponent },
    { path: 'maintenance-deductible', component: DeductibleComponent },
    { path: 'maintenance-risk-list', component: RiskListComponent },
    { path: 'maintenance-risk', component: RiskFormComponent },
    { path: 'claims-inquiry', component: ClmClaimsInquiryComponent },
    { path: 'clm-change-claim-status', component: ClmChangeClaimStatusComponent },
    { path: 'pol-util-gen-info', component: UpdateGeneralInfoComponent },
    { path: 'pol-util-installment', component: UpdateInstallmentComponent },
    { path: 'maintenance-ceding-co', component: PolMxCedingCoComponent },
    { path: 'accounting', component: AccountingComponent },
    { path: 'accounting-in-trust', component: AccountingInTrustComponent },
    { path: 'acct-ar-listings', component: AcctArListingsComponent },
    { path: 'check-voucher', component: CheckVoucherComponent },
    { path: 'generate-cv', component: GenerateCvComponent },
    { path: 'payt-req', component: RequestForPaymentComponent },
    { path: 'generate-payt-req', component: GeneratePaymentRequestComponent },
    { path: 'acct-it-cancelled-trans', component: AcctItCancelledTransactionsComponent },
    { path: 'journal-voucher', component: JournalVoucherComponent },
    { path: 'generate-jv', component: GenerateJvComponent },
    { path: 'accounting-entries', component: AccountingEntriesComponent },
    { path: 'trial-balance', component: TrialBalanceComponent },
    { path: 'open-cover-inquiry', component: OpenCoverInquiryComponent },
    { path: 'investments', component: InvestmentsComponent },
    { path: 'print-registers', component: RegistersComponent },
    { path: 'change-trans-stat-to-new', component: ChangeTransStatToNewComponent },
    { path: 'edit-acct-entries', component: EditAccountingEntriesComponent },
    { path: 'cancel-transaction', component: CancelTransactionsComponent },
    { path: 'acct-it-edited-acct-entries', component: AcctItEditedAcctEntriesComponent },
    { path: 'generate-number-series', component: GenerateNumberSeriesComponent },
    { path: 'chart-of-accounts', component: ChartOfAccountsComponent },
    { path: 'generate-or', component: GenerateOrComponent },
    { path: 'official-receipt', component: OfficialReceiptComponent },
    { path: 'acct-or-listings', component: AcctOrListingsComponent },
    { path: 'accounting-service', component: AccountingServiceComponent},
    { path: 'accounting-service-expense-budget', component: ExpenseBudgetComponent},
    { path: 'accounting-service-extract', component: AccountingServiceExtractComponent},
    { path: 'acct-srvc-util-catw', component: ConsolidateAnnualTaxesWithheldComponent },
    { path: 'accounting-service-pcv-listings', component: PcvListingsComponent},
    { path: 'accounting-service-pcv', component: PcvComponent},
    { path: 'month-end-batch-processing', component: MeBatchProcComponent},
    { path: 'month-end-data-checking', component: MeDataCheckingComponent},
    { path: 'month-end-trial-bal-proc', component: MeTrialBalProcComponent},
    { path: 'fixed-assets', component: FixedAssetsComponent},
    { path: 'acc-s-request-for-payment', component: AccSRequestForPaymentComponent },
    { path: 'acc-s-generate-request', component: AccSGenerateRequestComponent },
    { path: 'check-voucher-service', component: CheckVoucherServiceComponent },
    { path: 'generate-cv-service', component: GenerateCvServiceComponent },
    { path: 'journal-voucher-service', component: JournalVoucherServiceComponent },
    { path: 'generate-jv-service', component: GenerateJvServiceComponent },
    { path: 'accounting-service-utilities', component: UtilitiesComponent },
    { path: 'accounting-service-exp-budget', component: ExpenseBudgetComponent },
    { path: 'cancel-transaction-service', component: CancelTransactionsServiceComponent },
    { path: 'print-registers-service', component: RegistersServiceComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);