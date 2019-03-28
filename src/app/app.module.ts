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
import { AngularEditorModule } from '@kolkov/angular-editor';
import { QuillModule } from 'ngx-quill';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { UnsavedChangesGuard } from './_guards';

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
import { HoldCoverComponent } from './quotation/hold-cover/hold-cover.component';
import { AttachmentComponent } from './quotation/attachment/attachment.component';
import { DummyComponent } from './_components/common/dummy/dummy.component';
import { QuoteEndorsementComponent } from './quotation/quote-endorsement/quote-endorsement.component';
import { CustTableComponent } from './_components/common/cust-table/cust-table.component';
import { CustEditableTableComponent } from './_components/common/cust-editable-table/cust-editable-table.component';
import { QuotationInquiryComponent } from './quotation/quotation-inquiry/quotation-inquiry.component';
import { ListOfQuotationsComponent } from './quotation/quotation-inquiry/list-of-quotations/list-of-quotations.component';
import { HoldCoverMonitoringListComponent } from './quotation/quotation-inquiry/hold-cover-monitoring-list/hold-cover-monitoring-list.component';
import { NotesComponent } from './notes/notes.component';
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
import { DistributionByRiskComponent } from './underwriting/policy-distribution/distribution-by-risk/distribution-by-risk.component';
import { PolicyDistributionComponent } from './underwriting/policy-distribution/policy-distribution.component';
import { PolDistributionComponent } from './underwriting/policy-distribution/pol-distribution/pol-distribution.component';
import { PolDistComponent } from './underwriting/policy-distribution/pol-dist/pol-dist.component';
import { InwardPolBalanceComponent } from './underwriting/policy-issuance/inward-pol-balance/inward-pol-balance.component';
import { PolItemComponent } from './underwriting/policy-issuance/pol-item/pol-item.component';
import { PolCreateOpenCoverComponent } from './underwriting/policy-issuance/pol-create-open-cover/pol-create-open-cover.component';
import { PolIssuanceOpenCoverLetterComponent } from './underwriting/policy-issuance/pol-issuance-open-cover-letter.component';
import { PolGenInfoOpenCoverComponent } from './underwriting/policy-issuance/pol-gen-info-open-cover/pol-gen-info-open-cover.component';
import { PolSumInsuredOpenCoverComponent } from './underwriting/policy-issuance/pol-sum-insured-open-cover/pol-sum-insured-open-cover.component';
import { ReadyForPrintingComponent } from './quotation/quotation-inquiry/ready-for-printing/ready-for-printing.component';
import { PurgeExtractedPolicyComponent } from './underwriting/expiry-and-renewal/purge-extracted-policy/purge-extracted-policy.component';
import { SafeTextPipe } from './safe-text.pipe';
import { UpdateInformationComponent } from './utilities/update-information/update-information.component';
import { UpdateGeneralInfoComponent } from './utilities/update-information/update-general-info/update-general-info.component';
import { OpenCoverProcessingComponent } from './quotation/open-cover-processing/open-cover-processing.component';
import { OpenCoverComponent } from './quotation/open-cover/open-cover.component';
import { GenInfoComponent } from './quotation/open-cover/gen-info/gen-info.component';
import { OpenCoverSumInsuredComponent } from './quotation/open-cover/open-cover-sum-insured/open-cover-sum-insured.component';
import { ClaimsComponent } from './claims/claims.component';
import { ClaimComponent } from './claims/claim/claim.component';
import { ClmClaimProcessingComponent } from './claims/claim/clm-claim-processing/clm-claim-processing.component';
import { ClmGenInfoClaimComponent } from './claims/claim/clm-claim-processing/clm-gen-info-claim/clm-gen-info-claim.component';
import { PaymentRequestsComponent } from './claims/payment-requests/payment-requests.component';
import { NegateDistributionComponent } from './underwriting/policy-distribution/negate-distribution/negate-distribution.component';
import { ClaimsAttachmentComponent } from './claims/claim/claims-attachment/claims-attachment.component';
import { DummyComponent2 } from './_components/common/dummy2/dummy2.component';
import { ClmClaimHistoryComponent } from './claims/claim/clm-claim-processing/clm-claim-history/clm-claim-history.component';
import { ClaimDistributionComponent } from './claims/claim/claim-distribution/claim-distribution.component';
import { TextEditorComponent } from './_components/common/text-editor/text-editor.component';
import { NumbersOnlyDirective } from './_directives/numbers-only.directive';
import { CharactersLengthDirective } from './_directives/characters-length.directive';
import { RequiredDirective } from './_directives/required.directive';
import { CurrencyDirective } from './_directives/currency.directive';
import { PolBatchProcessingComponent } from './underwriting/policy-distribution/pol-batch-processing/pol-batch-processing.component';
import { DeductibleComponent } from './underwriting/maintenance/deductible/deductible.component';
import { RiskListComponent } from './underwriting/maintenance/risk-list/risk-list.component';
import { RiskFormComponent } from './underwriting/maintenance/risk-form/risk-form.component';
import { MonthDirective } from './_directives/month.directive';
import { ChangethemeDirective } from './_directives/changetheme.directive';
import { PolMxLineComponent } from './underwriting/policy-maintenance/pol-mx-line/pol-mx-line.component';
import { ClmSectionCoversComponent } from './claims/claim/clm-claim-processing/clm-section-covers/clm-section-covers.component';
import { ClmClaimPaymentRequestComponent } from './claims/claim/clm-claim-processing/clm-claim-payment-request/clm-claim-payment-request.component';
import { ClmClaimsInquiryComponent } from './claims/claim/clm-claims-inquiry/clm-claims-inquiry.component';
import { ClmChangeClaimStatusComponent } from './claims/claim/clm-change-claim-status/clm-change-claim-status.component';
import { UpdateInstallmentComponent } from './utilities/update-information/update-installment/update-installment.component';
import { PolMxCedingCoComponent } from './underwriting/policy-maintenance/pol-mx-ceding-co/pol-mx-ceding-co.component';
import { AccountingComponent } from './accounting/accounting.component';
import { ArEntryComponent } from './accounting/ar-entry/ar-entry.component';
import { ArDetailsComponent } from './accounting-in-trust/ar-details/ar-details.component';
import { ArDetailsComponent2 } from './accounting/ar-details/ar-details.component';
import { InwardPolicyBalancesComponent } from './accounting-in-trust/ar-details/inward-policy-balances/inward-policy-balances.component';
import { InwardPolicyBalancesComponent2 } from './accounting/inward-policy-balances/inward-policy-balances.component';
import { ClaimRecoveryComponent } from './accounting-in-trust/ar-details/claim-recovery/claim-recovery.component';
import { ClaimRecoveryComponent2 } from './accounting/claim-recovery/claim-recovery.component';
import { AttachmentsComponent } from './accounting/attachments/attachments.component';
import { AccountingInTrustComponent } from './accounting-in-trust/accounting-in-trust.component';
import { AccountingServiceComponent } from './accounting-service/accounting-service.component';
import { CvPaymentRequestListComponent } from './accounting-in-trust/check-voucher/generate-cv/cv-payment-request-list/cv-payment-request-list.component';
import { CvAttachmentComponent } from './accounting-in-trust/check-voucher/generate-cv/cv-attachment/cv-attachment.component';
import { AcctArListingsComponent } from './accounting-in-trust/acct-ar-listings/acct-ar-listings.component';
import { AcctArEntryComponent } from './accounting-in-trust/acct-ar-entry/acct-ar-entry.component';
import { CheckVoucherComponent } from './accounting-in-trust/check-voucher/check-voucher.component';
import { GenerateCvComponent } from './accounting-in-trust/check-voucher/generate-cv/generate-cv.component';
import { CvEntryComponent } from './accounting-in-trust/check-voucher/generate-cv/cv-entry/cv-entry.component';
import { CvDetailsComponent } from './accounting-in-trust/check-voucher/generate-cv/cv-details/cv-details.component';
import { QsoaComponent } from './accounting-in-trust/qsoa/qsoa.component';
import { AccAttachmentsComponent } from './accounting-in-trust/acc-attachments/acc-attachments.component';
import { SequencePipe } from './_pipes/sequence.pipe';
import { RequestForPaymentComponent } from './accounting-in-trust/request-for-payment/request-for-payment.component';
import { GeneratePaymentRequestComponent } from './accounting-in-trust/request-for-payment/generate-payment-request/generate-payment-request.component';
import { PaymentRequestEntryComponent } from './accounting-in-trust/request-for-payment/generate-payment-request/payment-request-entry/payment-request-entry.component';
import { AcctItCancelledTransactionsComponent } from './accounting-in-trust/accounting-inquiry/acct-it-cancelled-transactions/acct-it-cancelled-transactions.component';
import { JournalVoucherComponent } from './accounting-in-trust/journal-voucher/journal-voucher.component';
import { GenerateJvComponent } from './accounting-in-trust/journal-voucher/generate-jv/generate-jv.component';
import { JvEntryComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-entry/jv-entry.component';
import { AccountingEntriesComponent } from './accounting-in-trust/extract/accounting-entries/accounting-entries.component';
import { ExtractComponent } from './accounting-in-trust/extract/accounting-entries/extract/extract.component';
import { TrialBalanceComponent } from './accounting-in-trust/extract/trial-balance/trial-balance.component';
import { TrialBalanceExtractComponent } from './accounting-in-trust/extract/trial-balance/trial-balance-extract/trial-balance-extract.component';
import { OpenCoverInquiryComponent } from './quotation/open-cover-inquiry/open-cover-inquiry.component';
import { InvestmentsComponent } from './accounting-in-trust/investments/investments.component';
import { RegistersComponent } from './accounting-in-trust/reports/registers/registers.component';
import { ArRegisterComponent } from './accounting-in-trust/reports/registers/ar-register/ar-register.component';
import { CvRegisterComponent } from './accounting-in-trust/reports/registers/cv-register/cv-register.component';
import { ChecksRegisterComponent } from './accounting-in-trust/reports/registers/checks-register/checks-register.component';
import { JvRegisterComponent } from './accounting-in-trust/reports/registers/jv-register/jv-register.component';
import { ChangeTransStatToNewComponent } from './accounting-in-trust/utilities/change-trans-stat-to-new/change-trans-stat-to-new.component';
import { ChangeToNewArComponent } from './accounting-in-trust/utilities/change-trans-stat-to-new/change-to-new-ar/change-to-new-ar.component';
import { ChangeToNewCvComponent } from './accounting-in-trust/utilities/change-trans-stat-to-new/change-to-new-cv/change-to-new-cv.component';
import { ChangeToNewJvComponent } from './accounting-in-trust/utilities/change-trans-stat-to-new/change-to-new-jv/change-to-new-jv.component';
import { InAccountingEntriesComponent } from './accounting-in-trust/extract/accounting-entries/in-accounting-entries/in-accounting-entries.component';
import { UnbalanceEntriesComponent } from './accounting-in-trust/extract/accounting-entries/unbalance-entries/unbalance-entries.component';
import { EditAccountingEntriesComponent } from './accounting-in-trust/utilities/edit-accounting-entries/edit-accounting-entries.component';
import { CancelTransactionsComponent } from './accounting-in-trust/utilities/cancel-transactions/cancel-transactions.component';
import { CancelArComponent } from './accounting-in-trust/utilities/cancel-transactions/cancel-ar/cancel-ar.component';
import { CancelCvComponent } from './accounting-in-trust/utilities/cancel-transactions/cancel-cv/cancel-cv.component';
import { CancelJvComponent } from './accounting-in-trust/utilities/cancel-transactions/cancel-jv/cancel-jv.component';
import { AcctItEditedAcctEntriesComponent } from './accounting-in-trust/accounting-inquiry/acct-it-edited-acct-entries/acct-it-edited-acct-entries.component';
import { GenerateNumberSeriesComponent } from './maintenance/accounting-in-trust/generate-number-series/generate-number-series.component';
import { MaintArSeriesTrstComponent } from './maintenance/accounting-in-trust/generate-number-series/maint-ar-series-trst/maint-ar-series-trst.component';
import { MaintCvSeriesTrstComponent } from './maintenance/accounting-in-trust/generate-number-series/maint-cv-series-trst/maint-cv-series-trst.component';
import { MaintJvSeriesTrstComponent } from './maintenance/accounting-in-trust/generate-number-series/maint-jv-series-trst/maint-jv-series-trst.component';
import { ChartOfAccountsComponent } from './maintenance/accounting-in-trust/chart-of-accounts/chart-of-accounts.component';
import { MaintChartTrstAcctComponent } from './maintenance/accounting-in-trust/chart-of-accounts/maint-chart-trst-acct/maint-chart-trst-acct.component';
import { JvAttachmentsComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-attachments/jv-attachments.component';
import { JvDetailsComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-details/jv-details.component';
import { PaymentPremiumReturnsComponent } from './accounting-in-trust/request-for-payment/generate-payment-request/payment-premium-returns/payment-premium-returns.component';
import { JvQsoaComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-qsoa/jv-qsoa.component';
import { PaymentClaimsComponent } from './accounting-in-trust/request-for-payment/generate-payment-request/payment-claims/payment-claims.component';
import { PrQsoaComponent } from './accounting-in-trust/request-for-payment/generate-payment-request/pr-qsoa/pr-qsoa.component';
import { JvInwardPolBalanceComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-inward-pol-balance/jv-inward-pol-balance.component';
import { JvPaymentRequestListComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-payment-request-list/jv-payment-request-list.component';
import { TrialBalanceTbComponent } from './accounting-in-trust/extract/trial-balance/trial-balance-tb/trial-balance-tb.component';
import { PaymentRequestDetailsComponent } from './accounting-in-trust/request-for-payment/generate-payment-request/payment-request-details/payment-request-details.component';
import { ArPreviewComponent } from './accounting-in-trust/ar-preview/ar-preview.component';
import { ArClaimCashCallComponent } from './accounting-in-trust/ar-details/ar-claim-cash-call/ar-claim-cash-call.component';
import { ArLossReserveDepositComponent } from './accounting-in-trust/ar-details/ar-loss-reserve-deposit/ar-loss-reserve-deposit.component';
import { ArClaimOverPaymentComponent } from './accounting-in-trust/ar-details/ar-claim-over-payment/ar-claim-over-payment.component';
import { ArDetailsQsoaComponent } from './accounting-in-trust/ar-details/ar-details-qsoa/ar-details-qsoa.component';
import { ArDetailsInvestmentsComponent } from './accounting-in-trust/ar-details/ar-details-investments/ar-details-investments.component';
import { UnappliedCollectionComponent } from './accounting-in-trust/unapplied-collection/unapplied-collection.component';
import { ArOthersComponent } from './accounting-in-trust/ar-others/ar-others.component';
import { AcctOrOfficialReceiptComponent } from './accounting-service/official-receipt/generate-or/acct-or-official-receipt/acct-or-official-receipt.component';
import { OfficialReceiptComponent } from './accounting-service/official-receipt/official-receipt.component';
import { GenerateOrComponent } from './accounting-service/official-receipt/generate-or/generate-or.component';
import { OrPreviewComponent } from './accounting-service/official-receipt/generate-or/or-preview/or-preview.component';
import { AcctOrListingsComponent } from './accounting-service/acct-or-listings/acct-or-listings.component';
import { AcctOrEntryComponent } from './accounting-service/acct-or-entry/acct-or-entry.component';
import { OrOthersComponent } from './accounting-service/official-receipt/generate-or/acct-or-official-receipt/or-others/or-others.component';
import { OrServiceFeeLocalComponent } from './accounting-service/official-receipt/generate-or/acct-or-official-receipt/or-service-fee-local/or-service-fee-local.component';
import { ArPaymentforAdvancesComponent } from './accounting-in-trust/ar-details/ar-paymentfor-advances/ar-paymentfor-advances.component';
import { AcctAttachmentComponent } from './accounting-service/official-receipt/generate-or/acct-attachment/acct-attachment.component';
import { PaytReqInvestmentComponent } from './accounting-in-trust/request-for-payment/generate-payment-request/payt-req-investment/payt-req-investment.component';
import { ConsolidateAnnualTaxesWithheldComponent } from './accounting-service/utilities/consolidate-annual-taxes-withheld/consolidate-annual-taxes-withheld.component';
import { AcctSrvcImportComponent } from './accounting-service/utilities/consolidate-annual-taxes-withheld/acct-srvc-import/acct-srvc-import.component';
import { AcctSrvcAnnualDetailsComponent } from './accounting-service/utilities/consolidate-annual-taxes-withheld/acct-srvc-annual-details/acct-srvc-annual-details.component';
import { AcctSrvcConsolidateDataComponent } from './accounting-service/utilities/consolidate-annual-taxes-withheld/acct-srvc-consolidate-data/acct-srvc-consolidate-data.component';
import { AttachmentOcComponent } from './quotation/open-cover/attachment-oc/attachment-oc.component';
import { MtnDistrictComponent } from './maintenance/mtn-district/mtn-district.component';
import { MtnCityComponent } from './maintenance/mtn-city/mtn-city.component';
import { MtnInsuredComponent } from './maintenance/mtn-insured/mtn-insured.component';
import { MtnBlockComponent } from './maintenance/mtn-block/mtn-block.component';
import { UtilitiesComponent } from './accounting-service/utilities/utilities.component';
import { ExpenseBudgetComponent } from './accounting-service/expense-budget/expense-budget.component';
import { BudgetDetailsComponent } from './accounting-service/expense-budget/budget-details/budget-details.component';
import { ByMonthComponent } from './accounting-service/expense-budget/by-month/by-month.component';
import { ExtractFromLastYearComponent } from './accounting-service/expense-budget/extract-from-last-year/extract-from-last-year.component';
import { AccountingServiceExtractComponent } from './accounting-service/accounting-service-extract/accounting-service-extract.component';
import { ExtractBirTaxComponent } from './accounting-service/accounting-service-extract/extract-bir-tax/extract-bir-tax.component';
import { AcctEntriesComponent } from './accounting-service/accounting-service-extract/acct-entries/acct-entries.component';
import { AcctDetailsComponent } from './accounting-service/accounting-service-extract/acct-details/acct-details.component';
import { AcctUploadComponent } from './accounting-service/accounting-service-extract/acct-upload/acct-upload.component';
import { MtnEndtCodeComponent } from './maintenance/mtn-endt-code/mtn-endt-code.component';
import { CvAccEntriesComponent } from './accounting-in-trust/check-voucher/generate-cv/cv-acc-entries/cv-acc-entries.component';
import { PcvComponent } from './accounting-service/pcv/pcv.component';
import { PcvListingsComponent } from './accounting-service/pcv/pcv-listings/pcv-listings.component';
import { PcvEntryComponent } from './accounting-service/pcv/pcv-entry/pcv-entry.component';
import { PcvDetailsComponent } from './accounting-service/pcv/pcv-details/pcv-details.component';
import { PcvAccEntriesComponent } from './accounting-service/pcv/pcv-acc-entries/pcv-acc-entries.component';
import { MeDataCheckingComponent } from './accounting-service/month-end/me-data-checking/me-data-checking.component';
import { MeBatchProcComponent } from './accounting-service/month-end/me-batch-proc/me-batch-proc.component';
import { MeTrialBalProcComponent } from './accounting-service/month-end/me-trial-bal-proc/me-trial-bal-proc.component';
import { MtnCrestaZoneComponent } from './maintenance/mtn-cresta-zone/mtn-cresta-zone.component';
import { MtnCurrencyComponent } from './maintenance/mtn-currency/mtn-currency.component';
import { FixedAssetsComponent } from './accounting-service/fixed-assets/fixed-assets.component';
import { AccSRequestForPaymentComponent } from './accounting-service/acc-s-request-for-payment/acc-s-request-for-payment.component';
import { AccSRequestEntryComponent } from './accounting-service/acc-s-request-for-payment/acc-s-request-entry/acc-s-request-entry.component';
import { AccSRequestDetailsComponent } from './accounting-service/acc-s-request-for-payment/acc-s-request-details/acc-s-request-details.component';
import { AccSGenerateRequestComponent } from './accounting-service/acc-s-request-for-payment/acc-s-generate-request/acc-s-generate-request.component';
import { CheckVoucherServiceComponent } from './accounting-service/check-voucher-service/check-voucher-service.component';
import { CvEntryServiceComponent } from './accounting-service/check-voucher-service/generate-cv-service/cv-entry-service/cv-entry-service.component';
import { GenerateCvServiceComponent } from './accounting-service/check-voucher-service/generate-cv-service/generate-cv-service.component';
import { CvPaymentRequestListServiceComponent } from './accounting-service/check-voucher-service/generate-cv-service/cv-payment-request-list-service/cv-payment-request-list-service.component';
import { CvPreviewServiceComponent } from './accounting-service/check-voucher-service/generate-cv-service/cv-preview-service/cv-preview-service.component';
import { CvAttachmentsServiceComponent } from './accounting-service/check-voucher-service/generate-cv-service/cv-attachments-service/cv-attachments-service.component';
import { JournalVoucherServiceComponent } from './accounting-service/journal-voucher-service/journal-voucher-service.component';
import { GenerateJvServiceComponent } from './accounting-service/journal-voucher-service/generate-jv-service/generate-jv-service.component';
import { JvEntryServiceComponent } from './accounting-service/journal-voucher-service/generate-jv-service/jv-entry-service/jv-entry-service.component';
import { JvPreviewServiceComponent } from './accounting-service/journal-voucher-service/generate-jv-service/jv-preview-service/jv-preview-service.component';
import { JvAttachmentsServiceComponent } from './accounting-service/journal-voucher-service/generate-jv-service/jv-attachments-service/jv-attachments-service.component';
import { MtnLineComponent } from './maintenance/mtn-line/mtn-line.component';
import { MtnObjectComponent } from './maintenance/mtn-object/mtn-object.component';
import { MtnProvinceComponent } from './maintenance/mtn-region/mtn-province/mtn-province.component';
import { MtnQuotationWordingsComponent } from './maintenance/mtn-quotation-wordings/mtn-quotation-wordings.component';
import { MtnRiskComponent } from './maintenance/mtn-risk/mtn-risk.component';
import { AcctUnbalanceEntriesComponent } from './accounting-service/accounting-service-extract/acct-unbalance-entries/acct-unbalance-entries.component';
import { AcctTrialBalComponent } from './accounting-service/accounting-service-extract/acct-trial-bal/acct-trial-bal.component';
import { AcctEntriesExtractComponent } from './accounting-service/accounting-service-extract/acct-entries-extract/acct-entries-extract.component';
import { ExtractBirTaxesComponent } from './accounting-service/accounting-service-extract/extract-bir-tax/extract-bir-taxes/extract-bir-taxes.component';
import { AcctTrialBalExtractComponent } from './accounting-service/accounting-service-extract/acct-trial-bal/acct-trial-bal-extract/acct-trial-bal-extract.component';
import { AcctTrialBalTbComponent } from './accounting-service/accounting-service-extract/acct-trial-bal/acct-trial-bal-tb/acct-trial-bal-tb.component';
import { CedingCompanyComponent } from './underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CreditDebitMemoComponent } from './accounting-service/credit-debit-memo/credit-debit-memo.component';
import { CmdmEntryComponent } from './accounting-service/credit-debit-memo/cmdm-entry/cmdm-entry.component';
import { AccSChangeTranStatNewComponent } from './accounting-service/utilities/acc-s-change-tran-stat-new/acc-s-change-tran-stat-new.component';
import { OrChangeTranStatComponent } from './accounting-service/utilities/acc-s-change-tran-stat-new/or-change-tran-stat/or-change-tran-stat.component';
import { CvChangeTranStatComponent } from './accounting-service/utilities/acc-s-change-tran-stat-new/cv-change-tran-stat/cv-change-tran-stat.component';
import { JvChangeTranStatComponent } from './accounting-service/utilities/acc-s-change-tran-stat-new/jv-change-tran-stat/jv-change-tran-stat.component';
import { AccSEditAccountingEntriesComponent } from './accounting-service/utilities/acc-s-edit-accounting-entries/acc-s-edit-accounting-entries.component';
import { AccSEditedAccountingEntriesComponent } from './accounting-service/inquiry/acc-s-edited-accounting-entries/acc-s-edited-accounting-entries.component';
import { InTrustCreditDebitComponent } from './accounting-in-trust/in-trust-credit-debit/in-trust-credit-debit.component';
import { GenerateCMDMComponent } from './accounting-in-trust/in-trust-credit-debit/generate-cmdm/generate-cmdm.component';
import { AcctCmdmEntryComponent } from './accounting-in-trust/in-trust-credit-debit/generate-cmdm/acct-cmdm-entry/acct-cmdm-entry.component';
import { CmdmAccntEntriesComponent } from './accounting-in-trust/in-trust-credit-debit/generate-cmdm/cmdm-accnt-entries/cmdm-accnt-entries.component';
import { JvAccountingEntriesComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-accounting-entries/jv-accounting-entries.component';
import { JvLossReserveDepositComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-loss-reserve-deposit/jv-loss-reserve-deposit.component';
import { MtnIntermediaryComponent } from './maintenance/mtn-intermediary/mtn-intermediary.component';
import { MtnLineClassComponent } from './maintenance/mtn-line-class/mtn-line-class.component';
import { AccSrvInquiryComponent } from './accounting-service/acc-srv-inquiry/acc-srv-inquiry.component';
import { CancelTransactionsServiceComponent } from './accounting-service/utilities/cancel-transactions-service/cancel-transactions-service.component';
import { CancelOrComponent } from './accounting-service/utilities/cancel-transactions-service/cancel-or/cancel-or.component';
import { CancelCvServiceComponent } from './accounting-service/utilities/cancel-transactions-service/cancel-cv-service/cancel-cv-service.component';
import { CancelJvServiceComponent } from './accounting-service/utilities/cancel-transactions-service/cancel-jv-service/cancel-jv-service.component';
import { RegistersServiceComponent } from './accounting-service/reports/registers-service/registers-service.component';
import { CrRegisterComponent } from './accounting-service/reports/registers-service/cr-register/cr-register.component';
import { CvRegisterServiceComponent } from './accounting-service/reports/registers-service/cv-register-service/cv-register-service.component';
import { ChecksRegisterServiceComponent } from './accounting-service/reports/registers-service/checks-register-service/checks-register-service.component';
import { JvRegisterServiceComponent } from './accounting-service/reports/registers-service/jv-register-service/jv-register-service.component';
import { AcctSrvcCancelledTransactionsComponent } from './accounting-service/accounting-service-inquiry/acct-srvc-cancelled-transactions/acct-srvc-cancelled-transactions.component';
import { MtnAdviceWordingsComponent } from './maintenance/mtn-advice-wordings/mtn-advice-wordings.component';
import { MtnAttentionComponent } from './maintenance/mtn-attention/mtn-attention.component';
import { NegativeAmountPipe } from './_pipes/negative-amount.pipe';
import { MtnTypeOfCessionComponent } from './maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MonEndDataChkComponent } from './accounting-in-trust/month-end/mon-end-data-chk/mon-end-data-chk.component';
import { MonEndBatchComponent } from './accounting-in-trust/month-end/mon-end-batch/mon-end-batch.component';
import { MonEndTrialBalComponent } from './accounting-in-trust/month-end/mon-end-trial-bal/mon-end-trial-bal.component';
import { FundsHeldComponent } from './accounting-in-trust/month-end/funds-held/funds-held.component';
import { ExtractRecordComponent } from './accounting-in-trust/month-end/funds-held/extract-record/extract-record.component';
import { UnearnedPremiumComponent } from './accounting-in-trust/month-end/funds-held/unearned-premium/unearned-premium.component';
import { LovComponent } from './_components/common/lov/lov.component';
import { JvPreniumReserveComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-prenium-reserve/jv-prenium-reserve.component';
import { MtnCedingCompanyComponent } from './maintenance/mtn-ceding-company/mtn-ceding-company.component';
import { JvInterestOnOverdueAccountsComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-interest-on-overdue-accounts/jv-interest-on-overdue-accounts.component';
import { JvOffsettingAgainstLossesComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-offsetting-against-losses/jv-offsetting-against-losses.component';
import { JvOffsettingAgainstNegativeTreatyComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-offsetting-against-negative-treaty/jv-offsetting-against-negative-treaty.component';
import { JvOverdueAccountsAgainstTreatyComponent } from './accounting-in-trust/journal-voucher/generate-jv/jv-overdue-accounts-against-treaty/jv-overdue-accounts-against-treaty.component';
import { SucessDialogComponent } from './_components/common/sucess-dialog/sucess-dialog.component';
import { BatchOrPrintingComponent } from './accounting-service/utilities/batch-or-printing/batch-or-printing.component';
import { BatchInvoiceComponent } from './accounting-service/utilities/batch-invoice/batch-invoice.component';
import { ArDetailsInvestmentIncomeComponent } from './accounting-in-trust/ar-details/ar-details-investment-income/ar-details-investment-income.component';
import { BordereauxComponent } from './accounting-in-trust/reports/bordereaux/bordereaux.component';
import { QuarterlyStmntOfAcctComponent } from './accounting-in-trust/quarterly-stmnt-of-acct/quarterly-stmnt-of-acct.component';
import { ProfitCommissionComponent } from './accounting-in-trust/profit-commission/profit-commission.component';
import { BatchOsTakeupComponent } from './accounting-in-trust/month-end/batch-os-takeup/batch-os-takeup.component';
import { MtnSectionCoversComponent } from './maintenance/mtn-section-covers/mtn-section-covers.component';
import { JvPreviewAmountDetailsComponent } from './accounting-service/journal-voucher-service/generate-jv-service/jv-preview-amount-details/jv-preview-amount-details.component';
import { JvPreviewTaxDetailsComponent } from './accounting-service/journal-voucher-service/generate-jv-service/jv-preview-tax-details/jv-preview-tax-details.component';
import { CurrencyRateDirective } from './_directives/currency-rate.directive';
import { OtherRatesDirective } from './_directives/other-rates.directive';
import { UsersMaintenanceComponent } from './security/users-maintenance/users-maintenance.component';
import { UserGroupsMaintenanceComponent } from './security/users-maintenance/user-groups-maintenance/user-groups-maintenance.component';
import { UsersComponent } from './security/users-maintenance/users/users.component';
import { ConfirmSaveComponent } from './_components/common/confirm-save/confirm-save.component';
import { ModulesMaintenanceComponent } from './security/modules-maintenance/modules-maintenance.component';
import { SecurityModulesComponent } from './security/modules-maintenance/security-modules/security-modules.component';
import { ModuleTransactionsComponent } from './security/modules-maintenance/module-transactions/module-transactions.component';
import { CancelButtonComponent } from './_components/common/cancel-button/cancel-button.component';
import { MtnUsersComponent } from './maintenance/mtn-users/mtn-users.component';
import { NgxMaskModule } from 'ngx-mask';
import { MtnReasonComponent } from './maintenance/mtn-reason/mtn-reason.component';
import { PolicyInformationComponent } from './underwriting/inquiry/policy-information/policy-information.component';



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
        AngularEditorModule,
        QuillModule,
        NgxMaskModule.forRoot()
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
        ReadyForPrintingComponent,
        PurgeExtractedPolicyComponent,
        SafeTextPipe,
        UpdateInformationComponent,
        UpdateGeneralInfoComponent,
        OpenCoverProcessingComponent,
        OpenCoverComponent,
        GenInfoComponent,
        OpenCoverSumInsuredComponent,
        ClaimsComponent,
        ClaimComponent,
        ClmClaimProcessingComponent,
        ClmGenInfoClaimComponent,
        PaymentRequestsComponent,
        NegateDistributionComponent,
        ClaimsAttachmentComponent,
        ClmClaimHistoryComponent,
        ClaimDistributionComponent,
        RequiredDirective, //keep this as first directive declared
        TextEditorComponent,
        CharactersLengthDirective,
        CurrencyDirective,
        MonthDirective,
        ChangethemeDirective,
        NumbersOnlyDirective,
        ClmClaimPaymentRequestComponent,
        PolBatchProcessingComponent,
        DeductibleComponent,
        RiskListComponent,
        RiskFormComponent,
        MonthDirective,
        PolMxLineComponent,
        NumbersOnlyDirective,
        ClmSectionCoversComponent,
        ClmClaimsInquiryComponent,
        ClmChangeClaimStatusComponent,
        UpdateInstallmentComponent,
        PolMxCedingCoComponent,
        AccountingComponent,
        ArEntryComponent,
        ArDetailsComponent,
        InwardPolicyBalancesComponent,
        ClaimRecoveryComponent,
        QsoaComponent,
        AccountingInTrustComponent,
        AccountingServiceComponent,
        AcctArListingsComponent,
        AcctArEntryComponent,
        CvDetailsComponent,
        CheckVoucherComponent,
        GenerateCvComponent,
        CvEntryComponent,
        AccAttachmentsComponent,
        SequencePipe,
        RequestForPaymentComponent,
        GeneratePaymentRequestComponent,
        PaymentRequestEntryComponent,
        AcctItCancelledTransactionsComponent,
        JournalVoucherComponent,
        GenerateJvComponent,
        JvEntryComponent,
        AccountingEntriesComponent,
        ExtractComponent,
        TrialBalanceComponent,
        TrialBalanceExtractComponent,
        OpenCoverInquiryComponent,
        CvPaymentRequestListComponent,
        CvAttachmentComponent,
        InvestmentsComponent,
        RegistersComponent,
        ArRegisterComponent,
        CvRegisterComponent,
        ChecksRegisterComponent,
        JvRegisterComponent,
        ChangeTransStatToNewComponent,
        ChangeToNewArComponent,
        ChangeToNewCvComponent,
        ChangeToNewJvComponent,
        InAccountingEntriesComponent,
        UnbalanceEntriesComponent,
        EditAccountingEntriesComponent,
        CancelTransactionsComponent,
        CancelArComponent,
        CancelCvComponent,
        CancelJvComponent,
        AcctItEditedAcctEntriesComponent,
        GenerateNumberSeriesComponent,
        MaintArSeriesTrstComponent,
        MaintCvSeriesTrstComponent,
        MaintJvSeriesTrstComponent,
        ChartOfAccountsComponent,
        MaintChartTrstAcctComponent,
        JvAttachmentsComponent,
        JvDetailsComponent,
        PaymentPremiumReturnsComponent,
        JvQsoaComponent,
        PaymentClaimsComponent,
        PrQsoaComponent,
        JvInwardPolBalanceComponent,
        JvPaymentRequestListComponent,
        TrialBalanceTbComponent,
        PaymentRequestDetailsComponent,
        ArPreviewComponent,
        ArClaimCashCallComponent,
        ArLossReserveDepositComponent,
        ArClaimOverPaymentComponent,
        ArDetailsQsoaComponent,
        ArDetailsInvestmentsComponent,
        UnappliedCollectionComponent,
        ArOthersComponent,
        PaymentRequestDetailsComponent,
        AcctOrOfficialReceiptComponent,
        OfficialReceiptComponent,
        GenerateOrComponent,
        OrPreviewComponent,
        AcctOrListingsComponent,
        AcctOrEntryComponent,
        OrOthersComponent,
        OrServiceFeeLocalComponent,
        ArPaymentforAdvancesComponent,
        AcctAttachmentComponent,
        PaytReqInvestmentComponent,
        PaymentRequestDetailsComponent,
        ConsolidateAnnualTaxesWithheldComponent,
        AcctSrvcImportComponent,
        AcctSrvcAnnualDetailsComponent,
        AcctSrvcConsolidateDataComponent,
        AttachmentOcComponent,
        MtnDistrictComponent,
        MtnCityComponent,
        MtnInsuredComponent,
        MtnBlockComponent,
        UtilitiesComponent,
        ExpenseBudgetComponent,
        BudgetDetailsComponent,
        ByMonthComponent,
        ExtractFromLastYearComponent,
        AccountingServiceExtractComponent,
        ExtractBirTaxComponent,
        AcctEntriesComponent,
        AcctDetailsComponent,
        AcctUploadComponent,
        MtnEndtCodeComponent,
        CvAccEntriesComponent,
        PcvComponent,
        PcvListingsComponent,
        PcvEntryComponent,
        PcvDetailsComponent,
        PcvAccEntriesComponent,
        MeDataCheckingComponent,
        MeBatchProcComponent,
        MeTrialBalProcComponent,
        MtnCrestaZoneComponent,
        MtnCurrencyComponent,
        FixedAssetsComponent,
        AccSRequestForPaymentComponent,
        AccSRequestEntryComponent,
        AccSRequestDetailsComponent,
        AccSGenerateRequestComponent,
        CheckVoucherServiceComponent,
        CvEntryServiceComponent,
        GenerateCvServiceComponent,
        CvPaymentRequestListServiceComponent,
        CvPreviewServiceComponent,
        CvAttachmentsServiceComponent,
        JournalVoucherServiceComponent,
        GenerateJvServiceComponent,
        JvEntryServiceComponent,
        JvPreviewServiceComponent,
        JvAttachmentsServiceComponent,
        MtnLineComponent,
        MtnObjectComponent,
        MtnProvinceComponent,
        MtnQuotationWordingsComponent,
        MtnRiskComponent,
        AcctUnbalanceEntriesComponent,
        AcctTrialBalComponent,
        AcctEntriesExtractComponent,
        ExtractBirTaxesComponent,
        AcctTrialBalExtractComponent,
        AcctTrialBalTbComponent,
        CedingCompanyComponent,
        CreditDebitMemoComponent,
        CmdmEntryComponent,
        AccSChangeTranStatNewComponent,
        OrChangeTranStatComponent,
        CvChangeTranStatComponent,
        JvChangeTranStatComponent,
        AccSEditAccountingEntriesComponent,
        AccSEditedAccountingEntriesComponent,
        InTrustCreditDebitComponent,
        GenerateCMDMComponent,
        AcctCmdmEntryComponent,
        CmdmAccntEntriesComponent,
        JvAccountingEntriesComponent,
        JvLossReserveDepositComponent,
        MtnIntermediaryComponent,
        MtnLineClassComponent,
        AccSrvInquiryComponent,
        CancelTransactionsServiceComponent,
        CancelOrComponent,
        CancelCvServiceComponent,
        CancelJvServiceComponent,
        RegistersServiceComponent,
        CrRegisterComponent,
        CvRegisterServiceComponent,
        ChecksRegisterServiceComponent,
        JvRegisterServiceComponent,
        AcctSrvcCancelledTransactionsComponent,
        MtnAdviceWordingsComponent,
        MtnAttentionComponent,
        NegativeAmountPipe,
        MtnTypeOfCessionComponent,
        MonEndDataChkComponent,
        MonEndBatchComponent,
        MonEndTrialBalComponent,
        FundsHeldComponent,
        ExtractRecordComponent,
        UnearnedPremiumComponent,
        LovComponent,
        JvPreniumReserveComponent,
        MtnCedingCompanyComponent,
        JvInterestOnOverdueAccountsComponent,
        JvOffsettingAgainstLossesComponent,
        JvOffsettingAgainstNegativeTreatyComponent,
        JvOverdueAccountsAgainstTreatyComponent,
        SucessDialogComponent,
        BatchOrPrintingComponent,
        BatchInvoiceComponent,
        ArDetailsInvestmentIncomeComponent,
        BordereauxComponent,
        QuarterlyStmntOfAcctComponent,
        ProfitCommissionComponent,
        BatchOsTakeupComponent,
        MtnSectionCoversComponent,
        JvPreviewAmountDetailsComponent,
        JvPreviewTaxDetailsComponent,
        ConfirmSaveComponent,
        CancelButtonComponent,
        CurrencyRateDirective,
        OtherRatesDirective,
        UsersMaintenanceComponent,
        UserGroupsMaintenanceComponent,
        UsersComponent,
        ModulesMaintenanceComponent,
        SecurityModulesComponent,
        ModuleTransactionsComponent,
        MtnUsersComponent,
        MtnReasonComponent,
        DummyComponent2,
        AttachmentsComponent,
        ArDetailsComponent2,
        ClaimRecoveryComponent2,
        InwardPolicyBalancesComponent2,
        PolicyInformationComponent,
    ],

    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        UnsavedChangesGuard,
        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent],
})

export class AppModule { }
