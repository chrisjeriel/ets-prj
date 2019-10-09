import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard, UnsavedChangesGuard } from './_guards';
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
import { DeductibleComponent } from './maintenance/quotation-and-policy/deductible/deductible.component';
import { RiskListComponent } from './underwriting/maintenance/risk-list/risk-list.component';
import { RiskFormComponent } from './underwriting/maintenance/risk-form/risk-form.component';
import { ClmClaimsInquiryComponent } from './claims/claim/clm-claims-inquiry/clm-claims-inquiry.component';
import { ClmChangeClaimStatusComponent } from './claims/claim/clm-change-claim-status/clm-change-claim-status.component';
import { UpdateGeneralInfoComponent } from './utilities/update-information/update-general-info/update-general-info.component';
import { UpdateInstallmentComponent } from './utilities/update-information/update-installment/update-installment.component';
/*import { PolMxCedingCoComponent } from './underwriting/policy-maintenance/pol-mx-ceding-co/pol-mx-ceding-co.component';*/
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
import { AcctTrialBalComponent } from './accounting-service/accounting-service-extract/acct-trial-bal/acct-trial-bal.component';
import { ExtractBirTaxComponent } from './accounting-service/accounting-service-extract/extract-bir-tax/extract-bir-tax.component';
import { CreditDebitMemoComponent } from './accounting-service/credit-debit-memo/credit-debit-memo.component';
import { CmdmEntryComponent } from './accounting-service/credit-debit-memo/cmdm-entry/cmdm-entry.component';
import { AccSChangeTranStatNewComponent } from './accounting-service/utilities/acc-s-change-tran-stat-new/acc-s-change-tran-stat-new.component';
import { AccSEditAccountingEntriesComponent } from './accounting-service/utilities/acc-s-edit-accounting-entries/acc-s-edit-accounting-entries.component';
import { AccSEditedAccountingEntriesComponent } from './accounting-service/inquiry/acc-s-edited-accounting-entries/acc-s-edited-accounting-entries.component';
import { InTrustCreditDebitComponent } from './accounting-in-trust/in-trust-credit-debit/in-trust-credit-debit.component';
import { AccSrvInquiryComponent } from './accounting-service/acc-srv-inquiry/acc-srv-inquiry.component';
import { CancelTransactionsServiceComponent } from './accounting-service/utilities/cancel-transactions-service/cancel-transactions-service.component';
import { RegistersServiceComponent } from './accounting-service/reports/registers-service/registers-service.component';
import { AcctSrvcCancelledTransactionsComponent } from './accounting-service/accounting-service-inquiry/acct-srvc-cancelled-transactions/acct-srvc-cancelled-transactions.component';
import { MonEndDataChkComponent } from './accounting-in-trust/month-end/mon-end-data-chk/mon-end-data-chk.component';
import { MonEndBatchComponent } from './accounting-in-trust/month-end/mon-end-batch/mon-end-batch.component';
import { MonEndTrialBalComponent } from './accounting-in-trust/month-end/mon-end-trial-bal/mon-end-trial-bal.component';
import { FundsHeldComponent } from './accounting-in-trust/month-end/funds-held/funds-held.component';
import { BordereauxComponent } from './accounting-in-trust/reports/bordereaux/bordereaux.component';
import { BatchOsTakeupComponent } from './accounting-in-trust/month-end/batch-os-takeup/batch-os-takeup.component';
import { BatchOrPrintingComponent } from './accounting-service/utilities/batch-or-printing/batch-or-printing.component';
import { BatchInvoiceComponent } from './accounting-service/utilities/batch-invoice/batch-invoice.component';
import { GenerateCMDMComponent } from './accounting-in-trust/in-trust-credit-debit/generate-cmdm/generate-cmdm.component';
import { QuarterlyStmntOfAcctComponent } from './accounting-in-trust/quarterly-stmnt-of-acct/quarterly-stmnt-of-acct.component';
import { ProfitCommissionComponent } from './accounting-in-trust/profit-commission/profit-commission.component';
import { UserGroupsMaintenanceComponent } from './security/users-maintenance/user-groups-maintenance/user-groups-maintenance.component';
import { UsersComponent } from './security/users-maintenance/users/users.component';
import { UsersMaintenanceComponent } from './security/users-maintenance/users-maintenance.component';
import { ModulesMaintenanceComponent } from './security/modules-maintenance/modules-maintenance.component';
import { PolicyInformationComponent } from './underwriting/inquiry/policy-information/policy-information.component';
import { PolOcInquiryComponent } from './underwriting/inquiry/pol-oc-inquiry/pol-oc-inquiry.component';
import { PolOpenCovListComponent } from './underwriting/policy-issuance/pol-open-cov-list/pol-open-cov-list.component';
import { PolHoldCovMonitoringComponent } from './underwriting/expiry-and-renewal/pol-hold-cov-monitoring/pol-hold-cov-monitoring.component';
import { SpoilPolAltComponent } from './underwriting/utilities/spoil-pol-alt/spoil-pol-alt.component';
import { PolSummarizedInqComponent } from './underwriting/inquiry/policy-information/pol-summarized-inq/pol-summarized-inq.component';
import { InsuredListComponent } from './maintenance/quotation-and-policy/insured-list/insured-list.component';
import { InsuredComponent } from './maintenance/quotation-and-policy/insured-list/insured/insured.component';
import { LineClassComponent } from './maintenance/quotation-and-policy/line-class/line-class.component';
import { AdviceWordingsComponent } from './maintenance/quotation-and-policy/advice-wordings/advice-wordings.component';
import { CedingCompaniesListComponent } from './maintenance/quotation-and-policy/ceding-companies-list/ceding-companies-list.component';
import { CedingCompanyFormComponent } from './maintenance/quotation-and-policy/ceding-companies-list/ceding-company-form/ceding-company-form.component';
import { RegionComponent } from './maintenance/quotation-and-policy/region/region.component';
import { EndorsementComponent } from './maintenance/quotation-and-policy/endorsement/endorsement.component';
import { ObjectComponent } from './maintenance/quotation-and-policy/object/object.component';
import { SectionCoverComponent } from './maintenance/quotation-and-policy/section-cover/section-cover.component';
import { HundredValPolPrintComponent } from './underwriting/generate-documents/hundred-val-pol-print/hundred-val-pol-print.component';
import { QuoteWordingComponent } from './maintenance/quotation-and-policy/quote-wording/quote-wording.component';
import { QuoteStatusReasonComponent } from './maintenance/quotation-and-policy/reason/quote-status-reason/quote-status-reason.component';
import { SpoilageReasonComponent } from './maintenance/quotation-and-policy/reason/spoilage-reason/spoilage-reason.component';
import { PolicyWordingComponent } from './maintenance/quotation-and-policy/policy-wording/policy-wording.component';
import { MtnCurrencyListComponent } from './maintenance/quotation-and-policy/mtn-currency-list/mtn-currency-list.component';
import { MtnCurrencyRateComponent } from './maintenance/quotation-and-policy/mtn-currency-rate/mtn-currency-rate.component';
import { MtnCATPerilComponent } from './maintenance/quotation-and-policy/mtn-cat-peril/mtn-cat-peril.component';
import { MtnCrestaComponent } from './maintenance/quotation-and-policy/mtn-cresta/mtn-cresta.component';
import { PolValueCoverageComponent } from './underwriting/generate-documents/pol-value-coverage/pol-value-coverage.component';
import { TypeOfCessionComponent } from './maintenance/quotation-and-policy/type-of-cession/type-of-cession.component';
import { IntermediaryListComponent } from './maintenance/quotation-and-policy/intermediary-list/intermediary-list.component';
import { IntermediaryComponent } from './maintenance/quotation-and-policy/intermediary-list/intermediary/intermediary.component';
import { QuotationAndPolicyComponent } from './maintenance/quotation-and-policy/quotation-and-policy.component';
import { MtnNonRenewalReasonComponent } from './maintenance/quotation-and-policy/mtn-non-renewal-reason/mtn-non-renewal-reason.component';
import { OtherChargeComponent } from './maintenance/quotation-and-policy/other-charge/other-charge.component';
import { UserAmtLimitComponent } from './maintenance/quotation-and-policy/user-amt-limit/user-amt-limit.component';
import { QuotationToHoldCoverComponent } from './quotation/quotation-to-hold-cover/quotation-to-hold-cover.component';
import { TreatyComponent } from './maintenance/quotation-and-policy/treaty/treaty.component';
import { RetentionLineComponent } from './maintenance/quotation-and-policy/retention-line/retention-line.component';
import { TreatyShareComponent } from './maintenance/quotation-and-policy/treaty-share/treaty-share.component';
import { TreatyLimitComponent } from './maintenance/quotation-and-policy/treaty-limit/treaty-limit.component';
import { ApproverComponent } from './maintenance/quotation-and-policy/approver/approver.component';
import { MtnApprovalFunctionComponent } from './maintenance/quotation-and-policy/mtn-approval-function/mtn-approval-function.component';
import { SystemComponent } from './maintenance/system/system.component';
import { ProgramParameterComponent } from './maintenance/system/program-parameter/program-parameter.component';
import { RoundingErrorComponent } from './maintenance/quotation-and-policy/rounding-error/rounding-error.component';
import { ReportComponent } from './maintenance/system/report/report.component';
import { ReportParamComponent } from './maintenance/system/report-param/report-param.component';
import { LossCodeComponent } from './maintenance/claims/loss-code/loss-code.component';
import { AdjusterComponent } from './maintenance/claims/adjuster/adjuster.component';
import { MtnClaimsComponent } from './maintenance/claims/mtn-claims.component';
import { AdjusterFormComponent } from './maintenance/claims/adjuster/adjuster-form/adjuster-form.component';
import { ClaimStatusComponent } from './maintenance/claims/claim-status/claim-status.component';
import { ClaimEventTypeComponent } from './maintenance/claims/claim-event-type/claim-event-type.component';
import { ClaimEventComponent } from './maintenance/claims/claim-event/claim-event.component';
import { SectionIiTreatyLimitComponent } from './maintenance/quotation-and-policy/section-ii-treaty-limit/section-ii-treaty-limit.component';
import { RetentionPerPoolMemberComponent } from './maintenance/quotation-and-policy/retention-per-pool-member/retention-per-pool-member.component';
import { ClaimCashCallComponent } from './maintenance/claims/claim-cash-call/claim-cash-call.component';
import { ClaimStatusReasonComponent } from './maintenance/claims/claim-status-reason/claim-status-reason.component';
import { BankComponent } from './maintenance/accounting-mtn/bank/bank.component';
import { BankAccountComponent } from './maintenance/accounting-mtn/bank-account/bank-account.component';
import { AllocateInvestmentIncomeComponent } from './accounting-in-trust/utilities/allocate-investment-income/allocate-investment-income.component';
import { AccountingMtnComponent } from './maintenance/accounting-mtn/accounting-mtn.component';
import { BusinessTypeComponent } from './maintenance/accounting-mtn/business-type/business-type.component';
import { DcbUserComponent } from './maintenance/accounting-mtn/dcb-user/dcb-user.component';


const appRoutes: Routes = [


    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'quotation', component: QuotationComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard] },
    { path: 'policy-issuance', component: PolicyIssuanceComponent ,canDeactivate: [UnsavedChangesGuard]},
    { path: 'policy-issuance-alt', component: PolicyIssuanceAltComponent, canDeactivate: [UnsavedChangesGuard] },
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
    { path: 'quotation-holdcover', component: HoldCoverComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'policy-printing', component: PolicyPrintingComponent },
    { path: 'policy-holdcover', component: PolicyToHoldCoverComponent },
    { path: 'change-quote-status', component: ChangeQuoteStatusComponent },
    { path: 'policy-inquiry', component: PolicyInquiryComponent },
    { path: 'pol-dist-list', component: PolDistListComponent },
    { path: 'pol-dist', component: PolDistComponent },
    { path: 'policy-dist', component: PolicyDistributionComponent },
    { path: 'create-open-cover', component: PolCreateOpenCoverComponent,  }, //canDeactivate: [UnsavedChangesGuard]
    { path: 'create-open-cover-letter', component: PolIssuanceOpenCoverLetterComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'purge-extracted-policy', component: PurgeExtractedPolicyComponent },
    { path: 'update-info', component: UpdateInformationComponent },
    { path: 'open-cover-processing', component: OpenCoverProcessingComponent },
    { path: 'open-cover', component: OpenCoverComponent },
    { path: 'clm-claim-processing', component: ClmClaimProcessingComponent },//, canDeactivate: [UnsavedChangesGuard] },
    { path: 'clm-gen-info-claim', component: ClmGenInfoClaimComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'claims-claim', component: ClaimComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'negate-distribution', component: NegateDistributionComponent },
    { path: 'purge-extracted-policy', component: PurgeExtractedPolicyComponent },
    { path: 'update-info', component: UpdateInformationComponent },
    { path: 'open-cover-processing', component: OpenCoverProcessingComponent },
    { path: 'open-cover', component: OpenCoverComponent },
    { path: 'payment-request', component: PaymentRequestsComponent },
    { path: 'negate-distribution', component: NegateDistributionComponent },
    { path: 'maintenance-line', component: PolMxLineComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-line-class', component: LineClassComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'batch-processing', component: PolBatchProcessingComponent },
    { path: 'maintenance-deductible', component:  DeductibleComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-risk-list', component: RiskListComponent },
    { path: 'maintenance-risk', component: RiskFormComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'claims-inquiry', component: ClmClaimsInquiryComponent },
    { path: 'clm-change-claim-status', component: ClmChangeClaimStatusComponent },
    { path: 'pol-util-gen-info', component: UpdateGeneralInfoComponent },
    { path: 'pol-util-installment', component: UpdateInstallmentComponent },
    /*{ path: 'maintenance-ceding-co', component: PolMxCedingCoComponent },*/
    { path: 'accounting', component: AccountingComponent },
    { path: 'accounting-in-trust', component: AccountingInTrustComponent, canDeactivate: [UnsavedChangesGuard]  },
    { path: 'acct-ar-listings', component: AcctArListingsComponent },
    { path: 'check-voucher', component: CheckVoucherComponent },
    { path: 'generate-cv', component: GenerateCvComponent },
    { path: 'payt-req', component: RequestForPaymentComponent },
    { path: 'generate-payt-req', component: GeneratePaymentRequestComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'acct-it-cancelled-trans', component: AcctItCancelledTransactionsComponent },
    { path: 'journal-voucher', component: JournalVoucherComponent },
    { path: 'generate-jv', component: GenerateJvComponent , canDeactivate: [UnsavedChangesGuard]},
    { path: 'accounting-entries', component: AccountingEntriesComponent , canDeactivate: [UnsavedChangesGuard]},
    { path: 'trial-balance', component: TrialBalanceComponent },
    { path: 'open-cover-inquiry', component: OpenCoverInquiryComponent },
    { path: 'investments', component: InvestmentsComponent, canDeactivate: [UnsavedChangesGuard] },
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
    { path: 'accounting-service-trial-bal', component: AcctTrialBalComponent },
    { path: 'extract-bir-taxes', component: ExtractBirTaxComponent },
    { path: 'credit-debit-memo', component: CreditDebitMemoComponent,  },
    { path: 'accounting-service-credit-debit-memo', component: CmdmEntryComponent },
    { path: 'acc-s-change-tran-stat-new', component: AccSChangeTranStatNewComponent },
    { path: 'acc-s-edit-acct-entries', component: AccSEditAccountingEntriesComponent },
    { path: 'acc-s-edited-acct-entries', component: AccSEditedAccountingEntriesComponent },
    { path: 'acc-s-credit-debit-memo', component: InTrustCreditDebitComponent,  canDeactivate: [UnsavedChangesGuard]},
    { path: 'accounting-service-inquiry', component: AccSrvInquiryComponent },
    { path: 'cancel-transaction-service', component: CancelTransactionsServiceComponent },
    { path: 'print-registers-service', component: RegistersServiceComponent },
    { path: 'acct-srvc-inquiry-cncld-trans', component: AcctSrvcCancelledTransactionsComponent },
    { path: 'mon-end-data-chk-in-trust', component: MonEndDataChkComponent},
    { path: 'mon-end-batch-in-trust', component: MonEndBatchComponent},
    { path: 'mon-end-trial-bal-in-trust', component: MonEndTrialBalComponent},
    { path: 'funds-held', component: FundsHeldComponent},
    { path: 'bordereaux', component: BordereauxComponent},
    { path: 'batch-os-takeup', component: BatchOsTakeupComponent},
    { path: 'batch-or-printing', component: BatchOrPrintingComponent},
    { path: 'batch-invoice-printing', component: BatchInvoiceComponent},
    { path: 'acct-it-generate-cmdm', component: GenerateCMDMComponent, canDeactivate: [UnsavedChangesGuard]  },
    { path: 'quarterly-stmt-of-acct', component: QuarterlyStmntOfAcctComponent },
    { path: 'profit-commission', component: ProfitCommissionComponent },
    { path: 'user-group-maintenance', component: UserGroupsMaintenanceComponent },
    { path: 'users', component: UsersComponent },
    { path: 'users-maintenance', component: UsersMaintenanceComponent },
    { path: 'modules-maintenance', component: ModulesMaintenanceComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'policy-information', component: PolicyInformationComponent},
    { path: 'pol-oc-inquiry', component: PolOcInquiryComponent},
    { path: 'open-cover-list', component: PolOpenCovListComponent},
    { path: 'pol-hold-cov-monitoring', component: PolHoldCovMonitoringComponent},
    { path: 'spoil-pol-alt', component: SpoilPolAltComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'pol-summarized-inq', component: PolSummarizedInqComponent},
    // { path: 'maintenance-insured', component: InsuredListComponent},
    // { path: 'insured-mtn', component: InsuredComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'adv-word-mtn', component: AdviceWordingsComponent },
    { path: 'ceding-co-list', component: CedingCompaniesListComponent },
    { path: 'ceding-co-form', component: CedingCompanyFormComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-endt', component: EndorsementComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-object', component: ObjectComponent },
    { path: 'maintenance-sec-cov', component: SectionCoverComponent, canDeactivate: [UnsavedChangesGuard] }, //deza was here added unsavedChangesGaurd #8221 MTN112
    { path: 'total-val-pol-print', component: HundredValPolPrintComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-qu-pol', component: QuotationAndPolicyComponent},
    { path: 'maintenance-quote-wording', component: QuoteWordingComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-qu-reason', component: QuoteStatusReasonComponent },
    { path: 'maintenance-spoil-reason', component: SpoilageReasonComponent },
    { path: 'maintenance-policy-wording', component: PolicyWordingComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-currency', component: MtnCurrencyListComponent ,  canDeactivate: [UnsavedChangesGuard]},
    { path: 'maintenance-currency-rate', component: MtnCurrencyRateComponent },
    { path: 'maintenance-cat-peril', component: MtnCATPerilComponent },
    { path: 'maintenance-cresta-zone', component: MtnCrestaComponent ,  canDeactivate: [UnsavedChangesGuard]},
    { path: 'pol-value-coverage', component: PolValueCoverageComponent , canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-insured', component: InsuredListComponent },
    { path: 'insured-mtn', component: InsuredComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-type-of-cession', component: TypeOfCessionComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-intermediary', component: IntermediaryListComponent },
    { path: 'intermediary-mtn', component: IntermediaryComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-other-charge', component: OtherChargeComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-location/:id', component: RegionComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-usr-amt-limit', component: UserAmtLimitComponent, canDeactivate: [UnsavedChangesGuard]  },
    { path: 'mtn-non-renewal-reason', component: MtnNonRenewalReasonComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'quotation-to-hold-cover', component: QuotationToHoldCoverComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-treaty', component: TreatyComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-retention-line', component: RetentionLineComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-treaty-share', component: TreatyShareComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-treaty-limit', component: TreatyLimitComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'mtn-approver', component: ApproverComponent },
    { path: 'mtn-approval-function', component: MtnApprovalFunctionComponent ,  canDeactivate: [UnsavedChangesGuard]},
    { path: 'mtn-system', component: SystemComponent },
    { path: 'mtn-program-parameter', component: ProgramParameterComponent ,  canDeactivate: [UnsavedChangesGuard]},
    { path: 'mtn-rounding-error', component: RoundingErrorComponent,  canDeactivate: [UnsavedChangesGuard] },
    { path: 'mtn-report', component: ReportComponent },
    { path: 'mtn-report-param', component: ReportParamComponent },
    { path: 'maintenance-loss-code', component: LossCodeComponent },
    { path: 'mtn-adjuster-list', component: AdjusterComponent },
    { path: 'adjuster-form', component: AdjusterFormComponent },
    { path: 'claim-status', component: ClaimStatusComponent, canDeactivate: [UnsavedChangesGuard]  },
    { path: 'maintenance-clm', component: MtnClaimsComponent },
    { path: 'maintenance-clm-event-type', component: ClaimEventTypeComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-clm-event', component: ClaimEventComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-sec-ii-treaty-limit', component: SectionIiTreatyLimitComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-retention-per-pool-member', component: RetentionPerPoolMemberComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-clm-cash-call', component: ClaimCashCallComponent },
    { path: 'mtn-clm-stat-reason', component: ClaimStatusReasonComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'mtn-bank', component: BankComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'maintenance-acct', component: AccountingMtnComponent},
    { path: 'mtn-bank-acct', component: BankAccountComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'allocate-investment', component: AllocateInvestmentIncomeComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'mtn-bus-type', component: BusinessTypeComponent, canDeactivate: [UnsavedChangesGuard] },
    { path: 'mtn-dcb-user', component: DcbUserComponent, canDeactivate: [UnsavedChangesGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
