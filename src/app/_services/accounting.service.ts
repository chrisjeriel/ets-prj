import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ARDetails, AccountingEntries, CVListing, AmountDetailsCV, AccountingEntriesCV, QSOA, AttachmentInfo, CheckDetails, VATDetails, CreditableTax, AccountingRequestsListRP, AccountingITCancelledTransactions, JVListing, ARTaxDetailsVAT, ARTaxDetailsWTAX, ARInwdPolBalDetails, ARClaimsRecovery, AccCvAttachment, AccCVPayReqList, AcknowledgementReceipt, CheckVoucher, JournalVoucher, CancelTransactionAR, CancelTransactionCV, CancelTransactionJV, AccInvestments, AccItEditedTransactions, AccItEditedOldAcctEntries, AccItEditedLatestAcctEntries, AmountDetailsJV, AccountingEntriesJV, VATDetailsJV, CreditableTaxJV, PremiumReturnList, AccJvInPolBal, AccJVPayReqList, AccTBTotDebCred, AccTBNet, PaymentToAdjusters, PaymentToOtherParty, PaymentToCedingCompany, PremiumReturn, AccServiceAttachment, PaymentForAdvances, AccountingItClaimCashCallAr, AccountingItLossReserveDepositAr, AccountingItClaimOverPaymentAr, AccARInvestments, ARUnappliedCollection, AROthers, AccountingSOthersOr, AccORSerFeeLoc, OfficialReceipt, ORPrevAmountDetails, ORPrevAccEntries, ORPreVATDetails , ORPreCreditableWTaxDetails, PaymentOfSeviceFee, TreatyBalance, ByMonth, ExtractFromLastYear, AccountingEntriesExtract, CredibleWithholdingTaxDetails, InputVatDetails, OutputVatDetails, WithholdingVATDetails, CredibleWithholdingTaxUpload, InputVatUpload, OutputVatUpload, WithholdingTaxUpload, AccountingSFixedAssets, AccountingSMonthlyDepreciationDetails, AccountingSPaytReqCheckVoucher, AccountingSPaytReqPettyCashVoucher, AccountingSPaytReqPRMFE, AccountingSPaytReqOthers,AcctSrvcCWhtaxMonthlyTaxDetails,AcctSrvcCWhtaxConsolidateData, TaxDetails, WTaxDetails, ExpenseBudget, ExpenseBudgetByMonth, AccSChangeTranStatOR, AccSChangeTranStatCV, AccSChangeTranStatJV, CMDM, AccountingEntryCMDM, AccJvLossResDep, AccSrvInquiry, AccountingSrvcCancelledTransactions, QSOABalances } from '@app/_models';


@Injectable({
	providedIn: 'root'
})
export class AccountingService {

	arDetails: ARDetails[] = [];
	accountingEntries: AccountingEntries[] = [];
	cvListing: CVListing[] = [];
	checkDetails: CheckDetails[] = [];
	amountDetailsCVData: AmountDetailsCV[] = [];
	accountingEntriesCVData: AccountingEntriesCV[] = [];
	qsoaData: QSOA[] = [];
	attachmentInfo: AttachmentInfo[] = [];
	vatDetails: VATDetails[] = [];
	creditableTax: CreditableTax[] = [];
	paytRequestListData: AccountingRequestsListRP[] = [];
	cancelledTransactionsData: AccountingITCancelledTransactions[] = [];
	jvListing: JVListing[] = [];
	arTaxDetailsVAT: ARTaxDetailsVAT[] = [];
	arTaxDetailsWTAX: ARTaxDetailsWTAX[] = [];
	arInwdPolBalDetails: ARInwdPolBalDetails[] = [];
	arClaimsRecovery: ARClaimsRecovery[] = [];
	accCvAttachment: AccCvAttachment[] = [];
	accCvPayReqList: AccCVPayReqList[] = [];
	accInvestments: AccInvestments[] = [];
	chngTxToNewAR: AcknowledgementReceipt[] = [];
	chngTxToNewCV: CheckVoucher[] = [];
	chngTxToNewJv: JournalVoucher[] = [];
	cancelAR: CancelTransactionAR[] = [];
	cancelCV: CancelTransactionCV[] = [];
	cancelJV: CancelTransactionJV[] = [];
	accItEditedTransactions: AccItEditedTransactions[] = [];
	accItEditedOldAcctEntries: AccItEditedOldAcctEntries[] = [];
	accItEditedLatestAcctEntries: AccItEditedLatestAcctEntries[] = [];
	amountDetailsJV: AmountDetailsJV[] = [];
	accountingEntriesJV: AccountingEntriesJV[] = [];
	vatDetailsJV: VATDetailsJV[] = [];
	creditableTaxJV: CreditableTaxJV[] = [];
	premiumReturnsList: PremiumReturnList[] = [];
	accJvInPolBal: AccJvInPolBal[] = [];
	accJvPayReqList: AccJVPayReqList[] = [];
	accTBTotDebCred: AccTBTotDebCred[] = [];
	accTBNet: AccTBNet[] = [];
	paymentToAdjuster: PaymentToAdjusters[] = [];
	paymentToOtherParty: PaymentToOtherParty[] = [];
	paymentToCedingCompany: PaymentToCedingCompany[] = [];
	premiumReturn: PremiumReturn[] = [];
	accServiceAttachment: AccServiceAttachment[] = [];
	paymentForAdvances: PaymentForAdvances[] = [];
	officialReceipt : OfficialReceipt[] = [];
	accountingItClaimCashCallArData: AccountingItClaimCashCallAr[] = [];
	accountingItLossReserveDepositArData: AccountingItLossReserveDepositAr[] = [];
	accountingItClaimOverPaymentArData: AccountingItClaimOverPaymentAr[] = [];
	accARInvestments: AccARInvestments[] = [];
	arUnappliedCollection : ARUnappliedCollection[] = [];
	arOthers: AROthers[] = [];
	orPrevAmountDetails:  ORPrevAmountDetails[] = [];
	orPrevAccEntries : ORPrevAccEntries[] = [];
	orPreVATDetails : ORPreVATDetails[] = [];
	orPreCreditableWTaxDetails : ORPreCreditableWTaxDetails[] = [];
	accountingSOthersOrData: AccountingSOthersOr[] = [];
	accORSerFeeLoc: AccORSerFeeLoc[] = [];
	paymentOfServiceFee: PaymentOfSeviceFee[] = [];
	treatyBalance: TreatyBalance[] =[];
	byMonth: ByMonth[] = [];
	extractFromLastYear: ExtractFromLastYear[] = [];
	extract: AccountingEntriesExtract[] = [];
	credibleWithholdingTaxDetails: CredibleWithholdingTaxDetails[] = [];
	inputVatDetails: InputVatDetails[] = [];
	outputVatDetails: OutputVatDetails[] =[];
	withholdingVATDetails: WithholdingVATDetails[] = [];
	credibleWithholdingTaxUpload: CredibleWithholdingTaxUpload[]=[];
	inputVatUpload: InputVatUpload[] = [];
	outputVatUpload: OutputVatUpload[] = [];
	withholdingTaxUpload: WithholdingTaxUpload[]=[];
	accountingSFixedAssets: AccountingSFixedAssets[] = [];
	accountingSMonthlyDepreciationDetails: AccountingSMonthlyDepreciationDetails[] = [];
	accountingSPaytReqCheckVoucher: AccountingSPaytReqCheckVoucher[] = [];
	accountingSPaytReqPettyCashVoucher: AccountingSPaytReqPettyCashVoucher[] = [];
	accountingSPaytReqPRMFE: AccountingSPaytReqPRMFE[] = [];
	accountingSPaytReqOthers: AccountingSPaytReqOthers[] = [];
	accountingSPaytReqList: AccountingRequestsListRP[] = [];
	acctSrvcCWhtaxMonthlyTaxDetails: AcctSrvcCWhtaxMonthlyTaxDetails[] = [];
	acctSrvcCWhtaxConsolidateData: AcctSrvcCWhtaxConsolidateData[] = [];
	taxDetails: TaxDetails[] = [];
	wTaxDetails: WTaxDetails[] = [];
	expenseBudget: ExpenseBudget[] = [];
	expenseBudgetByMonth: ExpenseBudgetByMonth[] = [];
	creditDebit: CMDM[] = [];
	accountingEntryCMDM : AccountingEntryCMDM[] = [];
	accSChangeTranStatOR: AccSChangeTranStatOR[] = [];
	accSChangeTranStatCV: AccSChangeTranStatCV[] = [];
	accSChangeTranStatJV: AccSChangeTranStatJV[] = [];
	accJvLossResDep: AccJvLossResDep[] = [];
	accSrvInquiry: AccSrvInquiry[] = [];
	accountingSrvcCancelledTransactions: AccountingSrvcCancelledTransactions[] = [];
	qsoaBalances: QSOABalances[] = [];

	constructor(private http: HttpClient) { }

	getAmountDetails() {
		this.arDetails = [
			new ARDetails("Gross Amount", 2000000, 2000000, "None", 0),
			new ARDetails("Vatable Sales", 1785714.29, 1785714.29, "Add", 1785714.29),
			new ARDetails("VAT-Exempt Sales", 0, 0, "Add", 0),
			new ARDetails("VAT Zero-Rated Sales", 0, 0, "Add", 0),
			new ARDetails("VAT (12%)", 214285.71, 214285.71, "Add", 214285.71),
			new ARDetails("Creditable WTax (20%)", 357142.86, 357142.86, "Minus", 357142.86),
		]

		return this.arDetails;
	}

	getAccountingEntries() {
		this.accountingEntries = [
			new AccountingEntries(null, null, null, null, null, null),
			new AccountingEntries(null, null, null, null, null, null),
			new AccountingEntries(null, null, null, null, null, null),
			new AccountingEntries(null, null, null, null, null, null),
		]

		return this.accountingEntries;
	}

	getCVListing() {
		this.cvListing = [
			new CVListing("2015-00000001", "SM Prime Holdings, Inc", new Date(2015, 9, 1), "Printed", "Check for SM Prime Holdings Inc", 1642857.14),
			new CVListing("2017-00000001", "Rustans, Inc", new Date(2017, 9, 1), "Printed", "Check for Rustans Inc", 200000),
			new CVListing("2017-00000002", "San Miguel Corp", new Date(2017, 9, 3), "Printed", "Check for San Miguel Corp", 100000),
			new CVListing("2017-00000003", "DMCI", new Date(2017, 9, 4), "Printed", "Check for DMCI", 1000000),
			new CVListing("2018-00000001", "ABS-CBN", new Date(2018, 9, 4), "Printed", "Check for ABS-CBN", 710716.12),
			new CVListing("2018-00000010", "SMDC", new Date(2018, 9, 5), "Certified", "Check for SMDC", 756929),
			new CVListing("2018-00000015", "Universal Robina, Inc", new Date(2018, 9, 7), "Approved", "Check for Universal Robina, Inc", 300000),
			new CVListing("2018-00000045", "SGV & Co", new Date(2018, 9, 7), "Approved", "Check for SGV & Co", 1000000),
			new CVListing("2018-00000099", "Accenture", new Date(2018, 9, 7), "New", "Check for Accenture", 230000),
			new CVListing("2018-00000123", "NSO", new Date(2018, 9, 7), "New", "Check for NSO", 1500000),
		]

		return this.cvListing;
	}

	getCheckDetails() {
		this.checkDetails = [
			new CheckDetails("Banco De Oro", "PCPA-9091-7001-7389", new Date(), 17948303, "Local Clearing", "PHP", 27513.29),
		]

		return this.checkDetails;
	}

	getAmountDetailsCV() {
		this.amountDetailsCVData = [
			new AmountDetailsCV('Gross Amount (VAT Inc)', 28013.44, 28013.44, 'None', 0),
			new AmountDetailsCV('Ex-VAT', 25012, 25012, 'Add', 25012),
			new AmountDetailsCV('VAT (12%)', 3001.44, 3001.44, 'Add', 3001.44),
			new AmountDetailsCV('Witholding Tax (2%)', 500.24, 500.24, 'Less', -500.24),
		];
		return this.amountDetailsCVData;
	}

	getAccountingEntriesCV() {
		this.accountingEntriesCVData = [
			new AccountingEntriesCV(null, null, null, null, null, null),
		];
		return this.accountingEntriesCVData;
	}

	getQSOAData() {
		this.qsoaData = [
			new QSOA(new Date(2018, 2, 31), 500000, 100000, 6000000, 500000, 6500000, 600000),
			new QSOA(new Date(2018, 5, 30), 500000, 700000, 500000, 800000, 1000000, 1500000),
		];
		return this.qsoaData;
	}

	getAttachmentInfo() {
		this.attachmentInfo = [
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_01.doc", "Accounting Specifications Sample 1"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_02.doc", "Accounting Specifications Sample 2"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_03.doc", "Accounting Specifications Sample 3"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_04.doc", "Accounting Specifications Sample 4"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_05.doc", "Accounting Specifications Sample 5"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_06.doc", "Accounting Specifications Sample 6"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_07.doc", "Accounting Specifications Sample 7"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_08.doc", "Accounting Specifications Sample 8"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_09.doc", "Accounting Specifications Sample 9"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_10.doc", "Accounting Specifications Sample 10 "),
		]
		return this.attachmentInfo;
	}

	getVATDetails() {
		this.vatDetails = [
			new VATDetails("Output", "Services", "San Miguel Corporation", 25012, 3001.44),
		]
		return this.vatDetails;
	}

	getCreditableTax() {
		this.creditableTax = [
			new CreditableTax("WC002", "WTax on Investment Income PHP", 2, "BPI/MS INSURANCE CORPORATION", 25012, 500.24),
		]
		return this.creditableTax;
	}

	getPaytRequestsList() {
		this.paytRequestListData = [
			new AccountingRequestsListRP('CSR-2015-01-0001', 'SM Prime Holdings, Inc.', 'Claim Expense Payment to Ceding Company', 'Paid', new Date(), 'Payment for Claim No.', 'PHP', 1642857.14, 'Edward M. Salunson'),
			new AccountingRequestsListRP('CSR-2017-12-0001', 'Rustan, Inc.', 'Claim Expense Payment to Other Parties', 'Paid', new Date(), 'Payment for Claim No.', 'PHP', 200000, 'Christian M. Lumen'),
			new AccountingRequestsListRP('PRR-2017-12-0002', 'San Miguel Corporation', 'Claim Payment to Ceding Company', 'Paid', new Date(), 'Return of Premium for Policy No.', 'PHP', 100000, 'Chie Reyes'),
			new AccountingRequestsListRP('PRR-2017-12-0003', 'DMCI', 'Inward Policy Balances - Returns', 'Cancelled', new Date(), 'Return of Premium for Policy No.', 'USD', 1000000, 'Chie Reyes'),
			new AccountingRequestsListRP('PRR-2018-01-0001', 'ABS-CBN', 'Payment of Service Fee by In-Trust to Service Accounting', 'Paid', new Date(), 'Return of Premium for Policy No.', 'PHP', 710716.12, 'Juan de la Cruz'),
			new AccountingRequestsListRP('QBR-2018-02-0001', 'SMDC', 'Treaty Balance Due Participant', 'Paid', new Date(), 'Treaty Balance due for 1st Qtr for company', 'SGD', 756929, 'Juan de la Cruz'),
			new AccountingRequestsListRP('PRR-2018-02-0002', 'Universal Robina, Inc.', 'QSOA Balances', 'Open', new Date(), 'Return of Premium for Policy No.', 'EUR', 300000, 'Juan de la Cruz'),
			new AccountingRequestsListRP('QBR-2018-03-0001', 'SGV & Co.', 'Investment (Placement)', 'Open', new Date(), 'Treaty Balance due for 1st Qtr for company', 'HKD', 1000000, 'Christian M. Lumen'),
			new AccountingRequestsListRP('CSR-2018-09-0001', 'Accenture', 'Payment of Service Fee by In-Trust to Service Accounting', 'Open', new Date(), 'Payment for Claim No.', 'PHP', 230000, 'Chie Reyes'),
			new AccountingRequestsListRP('OTR-2018-11-0001', 'NSO', 'Others', 'Open', new Date(), 'Miscellaneous payment for', 'RMB', 1500000, 'Chie Reyes'),
			new AccountingRequestsListRP('OTR-2019-04-0095', 'DFA', 'Others', 'Open', new Date(), 'Miscellaneous payment for', 'PHP', 1642857.14, 'Chie Reyes'),
			new AccountingRequestsListRP('QBR-2019-05-0032', 'Robinsons', 'Others', 'Open', new Date(), 'Miscellaneous payment for', 'USD', 1342752.24, 'Chie Reyes'),
		];
		return this.paytRequestListData;
	}

	getCancelledTransactions() {
		this.cancelledTransactionsData = [
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('AR', '2018-02938210', new Date('1/7/2018'), 'Malayan', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('AR', '2018-00737323', new Date('1/7/2018'), 'Malayan', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('AR', '2018-00012837', new Date('1/7/2018'), 'Malayan', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('AR', '2018-00728347', new Date('1/8/2018'), 'STI', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00008837', new Date('1/8/2018'), 'STI', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 'Deleted'),
			new AccountingITCancelledTransactions('JV', '2018-00273812', new Date('1/8/2018'), 'STI', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 'Deleted'),
			new AccountingITCancelledTransactions('JV', '2018-07234812', new Date('1/10/2018'), 'UCPBGEN', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-08341023', new Date('1/10/2018'), 'UCPBGEN', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-07415123', new Date('1/10/2018'), 'UCPBGEN', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 'Deleted'),
			new AccountingITCancelledTransactions('JV', '2018-00782348', new Date('1/10/2018'), 'San Miguel Corporation', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-19592323', new Date('1/10/2018'), 'SMDC', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('CV', '2018-08437123', new Date('1/10/2018'), 'Charter', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 'Deleted'),
			new AccountingITCancelledTransactions('CV', '2018-89723489', new Date('1/10/2018'), 'UCPBGEN', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 'Deleted'),
			new AccountingITCancelledTransactions('CV', '2018-00876234', new Date('1/12/2018'), 'STI', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 'Deleted'),
			new AccountingITCancelledTransactions('CV', '2018-76349012', new Date('1/12/2018'), 'Malayan', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00784651', new Date('1/12/2018'), 'ABS-CBN', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00837451', new Date('1/12/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00872634', new Date('1/12/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00897236', new Date('1/15/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00872634', new Date('1/15/2018'), 'STI', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00726341', new Date('1/15/2018'), 'STI', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00786234', new Date('1/15/2018'), 'STI', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00263412', new Date('2/3/2018'), 'San Miguel Corporation', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00827364', new Date('2/3/2018'), 'San Miguel Corporation', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-08712634', new Date('2/3/2018'), 'San Miguel Corporation', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00087126', new Date('2/3/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00928734', new Date('2/3/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00782364', new Date('2/3/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
		];

		return this.cancelledTransactionsData;
	}
	getJVListing() {
		this.jvListing = [
			new JVListing("2015-00000001", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2014-00004342", "Ronwaldo Roque", "Printed", 1642857.14),
			new JVListing("2017-00000001", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2016-00001644", "Chie Reyes", "Printed", 200000),
			new JVListing("2017-00000002", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2016-00001645", "Lourdes Gualvez", "Printed", 100000),
			new JVListing("2017-00000003", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2016-00001646", "Chie Reyes", "Printed", 1000000),
			new JVListing("2018-00000001", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2017-00000324", "Chie Reyes", "Printed", 710716.12),
			new JVListing("2018-00000010", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2018-00000009", "Lourdes Gualvez", "Open", 756929),
			new JVListing("2018-00000016", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2018-00000012", "Lourdes Gualvez", "Cancelled", 300000),
			new JVListing("2018-00000045", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2018-00000041", "Ronwaldo Roque", "Cancelled", 1000000),
			new JVListing("2018-00000099", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2018-00000098", "Ronwaldo Roque", "Open", 230000),
			new JVListing("2018-00000123", new Date(2015, 10, 1), "To correct entries in", "Error Connection", "2018-00000122", "Ronwaldo Roque", "Open", 1500000),
		]
		return this.jvListing;
	}

	getARTaxDetailsVAT() {
		this.arTaxDetailsVAT = [
			new ARTaxDetailsVAT("Output", "Services", "Ma. Teresa Leonora", 1785714.29, 214285.71),
		]
		return this.arTaxDetailsVAT;
	}

	getARTaxDetailsWTAX() {
		this.arTaxDetailsWTAX = [
			new ARTaxDetailsWTAX("WC020", "WTax on Investment Income PHP", 20, "BPI/MS INSURANCE CORPORATION", 1785714.29, 357142.86),
		]
		return this.arTaxDetailsWTAX;
	}

	getARInwdPolBalDetails() {
		this.arInwdPolBalDetails = [
			new ARInwdPolBalDetails("CAR-2018-00001-99-0001-000","CAR-2018-00001-99-0001-000", "EN-CAR-HO-18","01","Payment", new Date('09/25/2018'),new Date('09/25/2018'), "PHP",1, 3000000, 0, 0, 1642857.14, 1357142.86, 1642857.14,0),
		]
		return this.arInwdPolBalDetails;
	}

	getARClaimsRecovery() {
		this.arClaimsRecovery = [
			new ARClaimsRecovery("Recovery","CAR-2018-000001", "REC-CAR-2018-000001",3, "Loss", "Recovery", "Salvage for Construction Materials", "PHP", 1, 30000, 30000),
			new ARClaimsRecovery("Overpayment","CAR-2018-000001", "",null, "", "", "Overpayment for the claim", "PHP", 1, 10000, 10000),
		]
		return this.arClaimsRecovery;
	}
	getAccCVAttachment() {
		this.accCvAttachment = [
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_01.doc", "Accounting Specifications Sample 1"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_02.doc", "Accounting Specifications Sample 2"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_03.doc", "Accounting Specifications Sample 3"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_04.doc", "Accounting Specifications Sample 4"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_05.doc", "Accounting Specifications Sample 5"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_06.doc", "Accounting Specifications Sample 6"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_07.doc", "Accounting Specifications Sample 7"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_08.doc", "Accounting Specifications Sample 8"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_09.doc", "Accounting Specifications Sample 9"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_10.doc", "Accounting Specifications Sample 10"),
		]
		return this.accCvAttachment;
	}

	getAccCVPayReqList() {
		this.accCvPayReqList = [
			new AccCVPayReqList("OPR-2018-01-0001", "San Miguel Corporation", "Others", "Open", new Date("09/20/2018"), "Payment for San Miguel", "Rosalinda Mercedez", "PHP", 27513.20)
		]
		return this.accCvPayReqList;
	}


	getAccountingEntriesUtil() {
		this.accountingEntriesCVData = [
			new AccountingEntriesCV('1-01-02-01', 'BPI Current Account No. 0071-0435-0438-94', '', '', 0, 2945.45),
			new AccountingEntriesCV('5-01-13-02', 'Internet Expense', '', '', 2677.68, 0),
			new AccountingEntriesCV('1-09', 'Input VAT', '', '', 321.32, 0),
			new AccountingEntriesCV('2-03-02-04', 'WC120 2%', '', '', 0, 53.55),
		];

		return this.accountingEntriesCVData;
	}

	getAccInvestments() {
		this.accInvestments = [
			new AccInvestments("BPI", "BPI 1", 5, "Years", 8.875000, new Date("10/20/2013"), new Date("10/20/2018"), 14000000, 1812500),
			new AccInvestments("RCBC", "RCBC 1", 35, "Days", 1.500000, new Date("09/26/2018"), new Date("10/31/2018"), 10000000, 10150000)
		]
		return this.accInvestments;
	}


	getAccItEditedTransactions() {
		this.accItEditedTransactions = [
			new AccItEditedTransactions("CV", "2018-00372881", new Date('2018-10-01'), "INVOICE COMMUNICATIONS INC.", "Billing for the period April 16 to March 16, 2019", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 2999),
			new AccItEditedTransactions("CV", "2018-00372890", new Date('2018-10-02'), "UCPBGEN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 546043),
			new AccItEditedTransactions("CV", "2018-00373244", new Date('2018-10-03'), "UCPBGEN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 14000000),
			new AccItEditedTransactions("CV", "2018-00372843", new Date('2018-10-04'), "STI", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 2404000),
			new AccItEditedTransactions("CV", "2018-00372430", new Date('2018-10-05'), "UCPBGEN", "Premium Payments", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 1000000),
			new AccItEditedTransactions("CV", "2018-00372490", new Date('2018-10-06'), "UCPBGEN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 1000000),
			new AccItEditedTransactions("CV", "2018-00372567", new Date('2018-10-07'), "PNBGEN", "Premium Payments", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 6000000),
			new AccItEditedTransactions("CV", "2018-00372878", new Date('2018-10-08'), "MRS. SANTOS", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 100000000),
			new AccItEditedTransactions("CV", "2018-00382890", new Date('2018-10-09'), "MALAYAN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 2999),
			new AccItEditedTransactions("CV", "2018-00572890", new Date('2018-10-09'), "SAN MIGUEL CORPORATION", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 34000000),
			new AccItEditedTransactions("CV", "2018-00362890", new Date('2018-10-09'), "UCPBGEN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 56000000),
			new AccItEditedTransactions("CV", "2018-00374675", new Date('2018-10-10'), "UCPBGEN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 2999),
			new AccItEditedTransactions("CV", "2018-00372864", new Date('2018-10-13'), "ABS-CBN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 3000000),
			new AccItEditedTransactions("CV", "2018-00454390", new Date('2018-10-13'), "BPI/MS", "Premium Payments", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 2999),
			new AccItEditedTransactions("CV", "2018-00625466", new Date('2018-10-13'), "BPI/MS", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 1000000),
			new AccItEditedTransactions("CV", "2018-00354362", new Date('2018-10-23'), "BPI/MS", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 1000000),
			new AccItEditedTransactions("CV", "2018-00357543", new Date('2018-10-24'), "Charter", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 234000000),
			new AccItEditedTransactions("CV", "2018-00325433", new Date('2018-10-24'), "Charter", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 32000000),
			new AccItEditedTransactions("CV", "2018-00554722", new Date('2018-10-25'), "Charter", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 10000000),
			new AccItEditedTransactions("CV", "2018-00446564", new Date('2018-10-26'), "Charter", "Premium Payments", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 1400000),


			new AccItEditedTransactions("CV", "2018-00362890", new Date('2018-10-09'), "UCPBGEN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 56000000),
			new AccItEditedTransactions("CV", "2018-00374675", new Date('2018-10-10'), "UCPBGEN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 2999),
			new AccItEditedTransactions("CV", "2018-00372864", new Date('2018-10-13'), "ABS-CBN", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 3000000),
			new AccItEditedTransactions("CV", "2018-00454390", new Date('2018-10-13'), "BPI/MS", "Premium Payments", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 2999),
			new AccItEditedTransactions("CV", "2018-00625466", new Date('2018-10-13'), "BPI/MS", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 1000000),
			new AccItEditedTransactions("CV", "2018-00354362", new Date('2018-10-23'), "BPI/MS", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 1000000),
			new AccItEditedTransactions("CV", "2018-00357543", new Date('2018-10-24'), "Charter", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 234000000),
			new AccItEditedTransactions("CV", "2018-00325433", new Date('2018-10-24'), "Charter", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 32000000),
			new AccItEditedTransactions("CV", "2018-00554722", new Date('2018-10-25'), "Charter", "Payment for Claim No.", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 10000000),
			new AccItEditedTransactions("CV", "2018-00446564", new Date('2018-10-26'), "Charter", "Premium Payments", "cuaresma", new Date('2018-10-12'), "Account should be Internet Expense, not Telephone Line", "New", 1400000),
		]
		return this.accItEditedTransactions;
	}

	getAccItEditedOldAcctEntries() {
		this.accItEditedOldAcctEntries = [
			new AccItEditedOldAcctEntries("1-01-02-01", "BPI Current Account No. 0071-0438-94", "", "", 0, 2945.45),
			new AccItEditedOldAcctEntries("5-01-13-04", "Telephone Line", "", "", 2677.68, 0),
			new AccItEditedOldAcctEntries("1-09", "Input VAT", "", "", 321.32, 0),
			new AccItEditedOldAcctEntries("2-03-02-04", "WC120 2%", "", "", 0, 53.55)
		]
		return this.accItEditedOldAcctEntries;
	}

	getAccItEditedLatestAcctEntries() {
		this.accItEditedLatestAcctEntries = [
			new AccItEditedLatestAcctEntries("1-01-02-01", "BPI Current Account No. 0071-0438-94", "", "", 0, 2945.45),
			new AccItEditedLatestAcctEntries("5-01-13-04", "Internet Expense", "", "", 2677.68, 0),
			new AccItEditedLatestAcctEntries("1-09", "Input VAT", "", "", 321.32, 0),
			new AccItEditedLatestAcctEntries("2-03-02-04", "WC120 2%", "", "", 0, 53.55)
		]
		return this.accItEditedLatestAcctEntries;
	}

	getChangeTxToNewAR() {
		this.chngTxToNewAR = [
			new AcknowledgementReceipt(1, 'BPI/MS INSURANCE CORPORATION', new Date(2018, 9, 1), 'Inward Policy Balances', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 1642857.14),
			new AcknowledgementReceipt(2, 'PNBGEN', new Date(2018, 9, 1), 'Inward Policy Balances', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 200000),
			new AcknowledgementReceipt(3, 'Charter Ping An', new Date(2018, 9, 3), 'Claim Recovery', 'Printed', 'Representing claim recovery payment for Claim No CAR-2018-000001', 100000),
			new AcknowledgementReceipt(4, 'AXA', new Date(2018, 9, 4), 'QSOA', 'Printed', 'Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter', 1000000),
			new AcknowledgementReceipt(5, 'Allied Bankers', new Date(2018, 9, 4), 'QSOA', 'Cancelled', 'Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter', 710716.12),
			new AcknowledgementReceipt(6, 'Malayan', new Date(2018, 9, 5), 'Inward Policy Balances', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 756929),
			new AcknowledgementReceipt(7, 'New India', new Date(2018, 9, 7), 'Claim Recovery', 'Cancelled', 'Representing claim recovery payment for Claim No CAR-2018-000001', 30000),
			new AcknowledgementReceipt(8, 'BPI/MS INSURANCE CORPORATION', new Date(2018, 9, 7), 'Claim Recovery', 'Printed', 'Representing claim recovery payment for Claim No CAR-2018-000001', 10000),
			new AcknowledgementReceipt(9, 'UCPBGEN', new Date(2018, 9, 7), 'QSOA', 'Printed', 'Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter', 230000),
			new AcknowledgementReceipt(10, 'FGIC', new Date(2018, 9, 7), 'Inward Policy Balances', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 1500000),
		];
		return this.chngTxToNewAR;
	}

	getChangeTxToNewCV() {
		this.chngTxToNewCV = [
			new CheckVoucher('2015-00000001', 'SM Prime Holdings, Inc', new Date(2015, 9, 1), 'Printed', 'Check for SM Prime Holdings, Inc', 1642857.14),
			new CheckVoucher('2017-00000001', 'Rustan Inc.', new Date(2017, 9, 1), 'Printed', 'Check for Rustan Inc.', 200000),
			new CheckVoucher('2017-00000002', 'San Miguel Corporation', new Date(2017, 9, 3), 'Printed', 'Check for San Miguel Corporation', 100000),
			new CheckVoucher('2017-00000003', 'DMCI', new Date(2017, 9, 4), 'Printed', 'Check for DMCI', 1000000),
			new CheckVoucher('2018-00000001', 'ABS-CBN', new Date(2018, 9, 4), 'Printed', 'Check for ABS-CBN', 710716.12),
			new CheckVoucher('2018-00000010', 'SMDC', new Date(2018, 9, 5), 'Certified', 'Check for SMDC', 756929),
			new CheckVoucher('2018-00000016', 'Universal Robina, Inc.', new Date(2018, 9, 7), 'Approved', 'Check for Unversal Robina, Inc.', 300000),
			new CheckVoucher('2018-00000045', 'SGV & Co.', new Date(2018, 9, 7), 'Approved', 'Check for SGV & Co.', 1000000),
			new CheckVoucher('2018-00000099', 'Accenture', new Date(2018, 9, 7), 'New', 'Check for Accenture', 230000),
			new CheckVoucher('2018-00000123', 'NSO', new Date(2018, 9, 7), 'New', 'Check for NSO', 1500000),

		];
		return this.chngTxToNewCV
	}

	getChangeTxToNewJV() {
		this.chngTxToNewJv = [
			new JournalVoucher('2015-00000001', new Date(2015, 9, 1), 'To correct entries in', 'Error Correction', '2014-00004342', 'Ronwaldo Roque', 'Printed', 1642857.14),
			new JournalVoucher('2017-00000001', new Date(2017, 9, 1), 'To correct entries in', 'Error Correction', '2016-00001644', 'Chie Reyes', 'Printed', 200000),
			new JournalVoucher('2017-00000002', new Date(2017, 9, 3), 'To correct entries in', 'Error Correction', '2016-00001645', 'Lourdes Galvez', 'Printed', 100000),
			new JournalVoucher('2017-00000003', new Date(2017, 9, 4), 'To correct entries in', 'Error Correction', '2016-00001646', 'Chie Reyes', 'Printed', 1000000),
			new JournalVoucher('2018-00000001', new Date(2018, 9, 4), 'To correct entries in', 'Error Correction', '2017-00000324', 'Chie Reyes', 'Printed', 710716.12),
			new JournalVoucher('2018-00000010', new Date(2018, 9, 5), 'To correct entries in', 'Error Correction', '2018-00000009', 'Lourdes Galvez', 'Open', 756929),
			new JournalVoucher('2018-00000016', new Date(2018, 9, 7), 'To correct entries in', 'Error Correction', '2018-00000012', 'Lourdes Galvez', 'Open', 300000),
			new JournalVoucher('2018-00000045', new Date(2018, 9, 7), 'To correct entries in', 'Error Correction', '3018-00000041', 'Ronwaldo Roque', 'Open', 1000000),
			new JournalVoucher('2018-00000099', new Date(2018, 9, 7), 'To correct entries in', 'Error Correction', '2018-00000098', 'Ronwaldo Roque', 'Open', 230000),
			new JournalVoucher('2018-00000123', new Date(2018, 9, 7), 'To correct entries in', 'Error Correction', '2018-00000122', 'Ronwaldo Roque', 'Open', 1500000),
		];
		return this.chngTxToNewJv;
	}

	getCancelAR() {
		this.cancelAR = [
			new CancelTransactionAR(null, 'BPI/MS INSURANCE CORPORATION', new Date(2018, 9, 1), 'Inward Policy Balances', 'New', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 1642857.14),
			new CancelTransactionAR(null, 'PNBGEN', new Date(2018, 9, 1), 'Inward Policy Balances', 'New', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 200000),
			new CancelTransactionAR(3, 'Charter Ping An', new Date(2018, 9, 3), 'Claim Recovery', 'Printed', 'Representing claim recovery payment for Claim No CAR-2018-000001', 100000),
			new CancelTransactionAR(4, 'AXA', new Date(2018, 9, 4), 'QSOA', 'Printed', 'Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter', 1000000),
			new CancelTransactionAR(null, 'Allied Bankers', new Date(2018, 9, 4), 'QSOA', 'New', 'Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter', 710716.12),
			new CancelTransactionAR(null, 'Malayan', new Date(2018, 9, 5), 'Inward Policy Balances', 'New', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 756929),
			new CancelTransactionAR(null, 'New India', new Date(2018, 9, 7), 'Claim Recovery', 'New', 'Representing claim recovery payment for Claim No CAR-2018-000001', 30000),
			new CancelTransactionAR(8, 'BPI/MS INSURANCE CORPORATION', new Date(2018, 9, 7), 'Claim Recovery', 'Printed', 'Representing claim recovery payment for Claim No CAR-2018-000001', 10000),
			new CancelTransactionAR(9, 'UCPBGEN', new Date(2018, 9, 7), 'QSOA', 'Printed', 'Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter', 230000),
			new CancelTransactionAR(null, 'FGIC', new Date(2018, 9, 7), 'Inward Policy Balances', 'New', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 1500000),
		];
		return this.cancelAR;
	}

	getCancelCV() {
		this.cancelCV = [
			new CancelTransactionCV('2015-00000001', 'SM Prime Holdings, Inc', new Date(2015, 9, 1), 'Printed', 'Check for SM Prime Holdings, Inc', 1642857.14),
			new CancelTransactionCV('2017-00000001', 'Rustan Inc.', new Date(2017, 9, 1), 'Printed', 'Check for Rustan Inc.', 200000),
			new CancelTransactionCV('2017-00000002', 'San Miguel Corporation', new Date(2017, 9, 3), 'Printed', 'Check for San Miguel Corporation', 100000),
			new CancelTransactionCV('2017-00000003', 'DMCI', new Date(2017, 9, 4), 'Printed', 'Check for DMCI', 1000000),
			new CancelTransactionCV('2018-00000001', 'ABS-CBN', new Date(2018, 9, 4), 'Printed', 'Check for ABS-CBN', 710716.12),
			new CancelTransactionCV('2018-00000010', 'SMDC', new Date(2018, 9, 5), 'Certified', 'Check for SMDC', 756929),
			new CancelTransactionCV('2018-00000016', 'Universal Robina, Inc.', new Date(2018, 9, 7), 'Approved', 'Check for Unversal Robina, Inc.', 300000),
			new CancelTransactionCV('2018-00000045', 'SGV & Co.', new Date(2018, 9, 7), 'Approved', 'Check for SGV & Co.', 1000000),
			new CancelTransactionCV('2018-00000099', 'Accenture', new Date(2018, 9, 7), 'New', 'Check for Accenture', 230000),
			new CancelTransactionCV('2018-00000123', 'NSO', new Date(2018, 9, 7), 'New', 'Check for NSO', 1500000),

		];
		return this.cancelCV;
	}

	getCancelJV() {
		this.cancelJV = [
			new CancelTransactionJV('2015-00000001', new Date(2015, 9, 1), 'To correct entries in', 'Error Correction', '2014-00004342', 'Ronwaldo Roque', 'Printed', 1642857.14),
			new CancelTransactionJV('2017-00000001', new Date(2017, 9, 1), 'To correct entries in', 'Error Correction', '2016-00001644', 'Chie Reyes', 'Printed', 200000),
			new CancelTransactionJV('2017-00000002', new Date(2017, 9, 3), 'To correct entries in', 'Error Correction', '2016-00001645', 'Lourdes Galvez', 'Printed', 100000),
			new CancelTransactionJV('2017-00000003', new Date(2017, 9, 4), 'To correct entries in', 'Error Correction', '2016-00001646', 'Chie Reyes', 'Printed', 1000000),
			new CancelTransactionJV('2018-00000001', new Date(2018, 9, 4), 'To correct entries in', 'Error Correction', '2017-00000324', 'Chie Reyes', 'Printed', 710716.12),
			new CancelTransactionJV('2018-00000010', new Date(2018, 9, 5), 'To correct entries in', 'Error Correction', '2018-00000009', 'Lourdes Galvez', 'Open', 756929),
			new CancelTransactionJV('2018-00000016', new Date(2018, 9, 7), 'To correct entries in', 'Error Correction', '2018-00000012', 'Lourdes Galvez', 'Open', 300000),
			new CancelTransactionJV('2018-00000045', new Date(2018, 9, 7), 'To correct entries in', 'Error Correction', '3018-00000041', 'Ronwaldo Roque', 'Open', 1000000),
			new CancelTransactionJV('2018-00000099', new Date(2018, 9, 7), 'To correct entries in', 'Error Correction', '2018-00000098', 'Ronwaldo Roque', 'Open', 230000),
			new CancelTransactionJV('2018-00000123', new Date(2018, 9, 7), 'To correct entries in', 'Error Correction', '2018-00000122', 'Ronwaldo Roque', 'Open', 1500000),
		];
		return this.cancelJV;
	}

	getAmountDetailsJV() {
		this.amountDetailsJV = [
			new AmountDetailsJV('Gross Amount (VAT Inc)', 28013.44, 28013.44, 'None', 0),
			new AmountDetailsJV('Ex-VAT', 25012, 25012, 'Add', 25012),
			new AmountDetailsJV('VAT (12%)', 3001.44, 3001.44, 'Add', 3001.44),
			new AmountDetailsJV('Witholding Tax (2%)', 500.24, 500.24, 'Less', -500.24),
		]

		return this.amountDetailsJV;
	}

	getAccountingEntriesJV() {
		this.accountingEntriesJV = [
			new AccountingEntriesJV(null, null, null, null, null, null),
		]
		return this.accountingEntriesJV;
	}

	getVATDetailsJV() {
		this.vatDetailsJV = [
			new VATDetailsJV("Output", "Services", "San Miguel Corporation", 25012, 3001.44),
		]
		return this.vatDetailsJV;
	}

	getCreditableTaxJV() {
		this.creditableTaxJV = [
			new CreditableTaxJV("WC002", "WTax on Investment Income PHP", 2, "BPI/MS INSURANCE CORPORATION", 25012, 500.24),
		]
		return this.creditableTaxJV;
	}

	getPremiumReturnList() {
		this.premiumReturnsList = [
			new PremiumReturnList(new Date(2018, 9, 25), "FLT PRIME", "EAR-2018-00001-99-001-000", -250000, -75000, -9000, "PHP", -166000),
		]
		return this.premiumReturnsList;
	}

	getAccJVInPolBal() {
		this.accJvInPolBal = [
			new AccJvInPolBal('CAR-2018-00001-99-0001-000','CAR-2018-00001-99-0001-000','EN-CAR-2018-00001-99-0001-000', 1, 'Payment', new Date("09/25/2018"), new Date("09/25/2018"), 'PHP', 1.0, 3000000, 0.00, 0.00, 1642857.14, 1357142.86, 1642857.14, 0.00),
		];

		return this.accJvInPolBal;
	}

	getAccJVPayReqList() {
		this.accJvPayReqList = [
			new AccJVPayReqList("CSR-2018-09-0001", "PMMSC Cashier", "Claim Payment", "Open", new Date("09/20/2018"), "Replenishment of", "Rosalinda Mercedez", "PHP", 27513.20),
			new AccJVPayReqList("PRR-2018-09-0002", "Sample Supplier", "Premium Returns", "Open", new Date("09/27/2018"), "Payment for official", "Chie Reyes", "PHP", 50000),
			new AccJVPayReqList("OTR-2018-01-0001", "PMMSC", "Others", "Open", new Date("09/27/2018"), "Payroll for August 1-31, 2018", "Lourdes R. Guevarra", "PHP", 300000),
		];

		return this.accJvPayReqList;
	}

	getAccTBTotDebCred() {
		this.accTBTotDebCred = [
			new AccTBTotDebCred(null,null,null,null,null,null),
				];
		
		return this.accTBTotDebCred;
	}

	getAccTBNet() {
		this.accTBNet = [
			new AccTBNet(null,null,null,null,null,null),
				];
		
		return this.accTBNet;
	}

	getPaymentToAdjuster() {
		this.paymentToAdjuster = [
			new PaymentToAdjusters("CSR-2018-10-00022","CAR-2018-000048","AArena Adjusters and Surveyors","2nd inn. inc", 4, "Adjuster's Expense","",-351000,"Php",1,350842.89,350842.89)
		];
		return this.paymentToAdjuster;
		
	}

	getPaymentToOtherParty() {
		this.paymentToOtherParty = [
			new PaymentToOtherParty("CSR-2018-10-00022","CAR-2018-000048","Asia United Insurance Inc","2nd inn. inc", 5, "Other Expenses","",-351000,"Php",1,350842.89,350842.89)
		];
		return this.paymentToOtherParty;
	}


	getPaymentToCedingCompany() {
		this.paymentToCedingCompany = [ 
			new PaymentToCedingCompany("CSR-2018-10-00022","CAR-2018-000048","Asia United Insurance Inc","2nd inn. inc", 3, "Loss","",-351000,"Php",1,350842.89,350842.89)
		];
		return this.paymentToCedingCompany;
	}

	getPremiumReturn() {
		this.premiumReturn = [
			new PremiumReturn("EAR-2018-00001-99-0001-00",new Date(25,10,2018), "FLT Prime", -250000, -75000, -9000, "Php", -166000, 1)
		];
		return this.premiumReturn;
	}


	getAccServiceAttachment() {
		this.accServiceAttachment = [
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_01.doc", "Accounting Specifications Sample 1"),
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_02.doc", "Accounting Specifications Sample 2"),
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_03.doc", "Accounting Specifications Sample 3"),
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_04.doc", "Accounting Specifications Sample 4"),
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_05.doc", "Accounting Specifications Sample 5"),
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_06.doc", "Accounting Specifications Sample 6"),
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_07.doc", "Accounting Specifications Sample 7"),
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_08.doc", "Accounting Specifications Sample 8"),
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_09.doc", "Accounting Specifications Sample 9"),
			new AccServiceAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-ACCOUNTING\\SAMPLE_10.doc", "Accounting Specifications Sample 10"),
		];
		return this.accServiceAttachment;
	}

	getPaymentForAdvances() {
		this.paymentForAdvances = [
			new PaymentForAdvances("BPI/MS INSURANCE CORPORATION","Advance payment collection (As of January 28,2019)","Php",1,500000,500000),
		]
		return this.paymentForAdvances;
	}
	getOfficialReceipt(){
		this.officialReceipt = [
			new OfficialReceipt('Payment for','Payment for','Payment for','PHP',1,1642857.14,1642857.14),
		];
		return this.officialReceipt;
	}

	getAccountingItClaimCashCallAR(){
		this.accountingItClaimCashCallArData = [
			new AccountingItClaimCashCallAr('CAR-2018-000001', 'CAR-2018-00001-99-0001-000', 'DMCI', new Date(2018,9,1), 'Damaged Material','01','Loss',0, 1000000, 'PHP', 1, 300000, 300000),
		];

		return this.accountingItClaimCashCallArData;
	}

	getAccountingItLossReserveDepositAR(){
		this.accountingItLossReserveDepositArData = [
			new AccountingItLossReserveDepositAr('BPI/MS INSURANCE CORPORATION', new Date(2018,9,1), 'PHP', 1, 500000, 500000),
		];

		return this.accountingItLossReserveDepositArData;
	}

	getAccountingItClaimOverPaymentAR(){
		this.accountingItClaimOverPaymentArData = [
			new AccountingItClaimOverPaymentAr('CAR-2018-000001', 'CAR-2018-00001-99-0001-000', 'DMCI', new Date(2018,9,1), 'Damaged Material', 1000000, 'PHP', 1, 300000, 300000),
		];

		return this.accountingItClaimOverPaymentArData
	}

	getAccARInvestments(){
		this.accARInvestments = [
			new AccARInvestments('BPI','BPI 1','Time',5,'Years',8.875, new Date(2013,9,20),new Date(2018,9,20),'PHP',1,14000000,4112500,18112.50,82250,18112500),
			new AccARInvestments('RCBC','RCBC 1','Treasury',35,'Days',1.5, new Date(2018,8,26),new Date(2018,9,31),'PHP',1,10000000,150000,10150,3000,10150000)
		];
		return this.accARInvestments;
	}

	getAccORSerFeeLoc(){
		this.accORSerFeeLoc = [
			new AccORSerFeeLoc('AFP GENERAL INSURANCE CORP.', new Date(2018,8,30),'PHP',1,1642857.14,1642857.14)
		];
		return this.accORSerFeeLoc;
	}
	getAccORSerFeeMunichRe(){
		this.accORSerFeeLoc = [
			new AccORSerFeeLoc('Munich Re', new Date(2018,8,30),'PHP',1,1642857.14,1642857.14)
		];
		return this.accORSerFeeLoc;
	}

	getARUnappliedCollection() {
		this.arUnappliedCollection = [
			new ARUnappliedCollection("BPI/MS INSURANCE CORPORATION",new Date("01/25/2019"),"Unapplied collection (As of January 28, 2019)","PHP",1.0,500000,500000),
				];
		
		return this.arUnappliedCollection;
	}

	getAROthers(){
		this.arOthers = [
/*<<<<<<< HEAD
			new AROthers("Utilities",null,"Payment For","Refund","PHP",1.0,-50000,-50000),
=======*/
			new AROthers("Utilities","","Payment For","Refund","PHP",1.0,-50000,-50000),
/*>>>>>>> 175e99f85deab8a5e9768e8a21f93aff2ffc85be*/
		];
		return this.arOthers;
	}

	getORPrevAmountDetails(){
		this.orPrevAmountDetails = [
			new ORPrevAmountDetails(1,"A","Premium (Vatable)",1785714.29,"PHP",1.0,1785714.29),
			new ORPrevAmountDetails(2,"A","VAT-Exempt Sales",0,"PHP",1.0,0),
			new ORPrevAmountDetails(3,"A","VAT Zero-Rated Sales",0,"PHP",1.0,0),
			new ORPrevAmountDetails(4,"A","VAT (12%)",214285.71,"PHP",1.0,214285.71),
			new ORPrevAmountDetails(5,"A","Creditable Wtax (20%)",-357142.86,"PHP",1.0,-357142.86),
		];
		return this.orPrevAmountDetails;
	}

	getORPrevAccEntries(){
		this.orPrevAccEntries = [
			new ORPrevAccEntries(null,null,null,null,null,null),
		];
		return this.orPrevAccEntries;
	}

	getORPrevTaxDetails(){
		this.orPreVATDetails = [
			new ORPreVATDetails("Output","Services","San Miguel Corporation",25012,3001.44),
		];
		return this.orPreVATDetails;
	}

	getORPrevCredWTaxDetails(){
		this.orPreCreditableWTaxDetails = [
			new ORPreCreditableWTaxDetails("WC002","WTax on Investment Income PHP",2.0,"BPI/MS INSURANCE CORPORATION",25012,500.24),
		];
		return this.orPreCreditableWTaxDetails;
	}


	getAcctServices(){
		this.arOthers = [
			new AROthers("Utilities","","Service fee for the period of","Payment","PHP",1.0,-50000,-50000),
		];
		return this.arOthers;
	}

	getAccountingSOthersOr(){
		this.accountingSOthersOrData = [
			new AccountingSOthersOr("Utilities", null,null,"Payment For", "PHP", 1, 10000, 10000),
		];

		return this.accountingSOthersOrData;
	}

	getPaymentOfServiceFee(){
		this.paymentOfServiceFee = [
			new PaymentOfSeviceFee("Utilities","Service fee for the period of","PHP",1.0,-50000,-50000),
		];
		return this.paymentOfServiceFee;
	}

	getTreatyBalance(){
		this.treatyBalance = [ 
			new TreatyBalance(new Date(2018,3,21),'PHP',1,100000,100000)
		]
		return this.treatyBalance;
	}



	getExpenseBudget(){
		this.expenseBudget = [
			new ExpenseBudget(new Date(2018,1,31),'5-01-01-01','Salaries',null,null,18112500),
			new ExpenseBudget(new Date(2018,2,28),'5-01-01-01','Salaries',null,null,10150000),
			new ExpenseBudget(new Date(2018,3,31),'5-01-01-01','Salaries',null,null,1000000),
			new ExpenseBudget(new Date(2018,4,30),'5-01-01-01','Salaries',null,null,1000000),
			new ExpenseBudget(new Date(2018,5,31),'5-01-01-01','Salaries',null,null,1000000)
		]
		return this.expenseBudget;
	}

	getByMonth(){
		this.byMonth = [ 
			new ByMonth('501-01-01','Salaries',0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ByMonth('501-01-02','Overtime',0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ByMonth('501-01-03','Mid-Year Bonus',0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ByMonth('501-01-04','13thMonth Pay',0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ByMonth('501-01-05','Provision for Profit Sharing',0,0,0,0,0,0,0,0,0,0,0,0,0)
		]
		return this.byMonth;
	}

	getExtractFromLastYear(){
		this.extractFromLastYear = [ 
			new ExtractFromLastYear('501-01-01','Salaries',0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExtractFromLastYear('501-01-02','Overtime',0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExtractFromLastYear('501-01-03','Mid-Year Bonus',0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExtractFromLastYear('501-01-04','13thMonth Pay',0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExtractFromLastYear('501-01-05','Provision for Profit Sharing',0,0,0,0,0,0,0,0,0,0,0,0,0)
		]
		return this.extractFromLastYear;
	}

	getAccountingEntryExtract(){
		this.extract = [
			new AccountingEntriesExtract(null,null,null,null,null,null,null,null)
		]
		return this.extract;
	}

	getCredibleWithholdingTaxDetails(){
		this.credibleWithholdingTaxDetails = [
			new CredibleWithholdingTaxDetails(null,null,null,null,null,null,null,null,null)
		]
		return this.credibleWithholdingTaxDetails
	}

	getInputVatDetails(){
		this.inputVatDetails = [
			new InputVatDetails(null,null,null,null,null,null,null,null,null,null)
		]
		return this.inputVatDetails
	}

	getOutputVatDetails(){
		this.outputVatDetails = [
			new OutputVatDetails(null,null,null,null,null,null,null,null,null)
		]
		return this.outputVatDetails
	}

	getWithholdingVATDetails(){
		this.withholdingVATDetails = [
			new WithholdingVATDetails(null,null,null,null,null,null,null,null,null)
		]
		return this.withholdingVATDetails;
	}
	
	getCredibleWithholdingTaxUpload(){
		this.credibleWithholdingTaxUpload = [
			new CredibleWithholdingTaxUpload(null,null,null,null,null,null,null,null,null,null,null,null)
		]
		return this.credibleWithholdingTaxUpload;
	}

	getInputVatUpload(){
		this.inputVatUpload = [
			new InputVatUpload(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)
		]
		return this.inputVatUpload;

	}

	getOutputVatUpload(){
		this.outputVatUpload = [
			new OutputVatUpload(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)
		]
		return this.outputVatUpload;

	}

	getWithholdingTaxUpload(){
		this.withholdingTaxUpload = [
			new WithholdingTaxUpload(null,null,null,null,null,null,null,null,null,null,null,null)
		]
		return this.withholdingTaxUpload;
	}

	getAccountingSFixedAssets(){
		this.accountingSFixedAssets = [
			new AccountingSFixedAssets('Electronics Equivalent', 1, 'Lenovo', 'Accounting', 'Camilo Hermin', new Date(2015,0,1), 900000000000, 'Straight Line', 60, 500231230482, 25002314123.53, new Date(2016,5,31), null, ''),
			new AccountingSFixedAssets('Transportation Equivalent', 2, '2015 Fortuner A/T', 'General Management', 'Camilo Hermin', new Date(2015,0,1), 100000000000, 'Straight Line', 60, 16662341236.66, 8335123433.30, new Date(2016,5,31), null, ''),
		];

		return this.accountingSFixedAssets;
	}

	getAccountingSMonthlyDepreciationDetails(){
		this.accountingSMonthlyDepreciationDetails = [
			new AccountingSMonthlyDepreciationDetails('Lenovo Laptop', new Date(2015,0,31), 25002314123.53, ''),
			new AccountingSMonthlyDepreciationDetails('Lenovo Laptop', new Date(2015,1,28), 25002314123.53, ''),
			new AccountingSMonthlyDepreciationDetails('2015 Fortuner A/T', new Date(2015,0,31), 16662341236.66, ''),
			new AccountingSMonthlyDepreciationDetails('2015 Fortuner A/T', new Date(2015,1,28), 16662341236.66, ''),
		];

		return this.accountingSMonthlyDepreciationDetails;
	}

	getAccountingSRequestsList(){
		this.accountingSPaytReqList = [
			new AccountingRequestsListRP('SCV-2015-01-0001', 'SM Prime Holdings, Inc.', 'Check Voucher', 'Paid', new Date(), 'Photocopying Charges for the month of December 2017', 'PHP', 1642857.14, 'Edward M. Salunson'),
			new AccountingRequestsListRP('SCV-2017-12-0001', 'Rustan, Inc.', 'Check Voucher', 'Paid', new Date(), 'Photocopying Charges for the month of November 2017', 'PHP', 200000, 'Christian M. Lumen'),
			new AccountingRequestsListRP('SCV-2017-12-0002', 'San Miguel Corporation', 'Check Voucher', 'Paid', new Date(), 'Photocopying Charges for the month of November 2017', 'PHP', 100000, 'Chie Reyes'),
			new AccountingRequestsListRP('SCV-2017-12-0003', 'DMCI', 'Check Voucher', 'Cancelled', new Date(), 'Payment for Office Supplies per P.O. No. 567', 'USD', 1000000, 'Chie Reyes'),
			new AccountingRequestsListRP('PRM-2018-01-0001', 'ABS-CBN', 'Payment of Risk Management Fee to Employees', 'Paid', new Date(), 'Payment of Risk Management Fee to Employees', 'PHP', 710716.12, 'Juan de la Cruz'),
			new AccountingRequestsListRP('SCV-2018-02-0001', 'SMDC', 'Check Voucher', 'Paid', new Date(), 'Payment for Office Supplies per P.O. No. 567', 'SGD', 756929, 'Juan de la Cruz'),
			new AccountingRequestsListRP('PRM-2018-02-0002', 'Universal Robina, Inc.', 'Payment of Risk Management Fee to Employees', 'Open', new Date(), 'Payment of Risk Management Fee to Employees', 'EUR', 300000, 'Juan de la Cruz'),
			new AccountingRequestsListRP('SCV-2018-03-0001', 'SGV & Co.', 'Check Voucher', 'Open', new Date(), 'Payment for Office Supplies per P.O. No. 567', 'HKD', 1000000, 'Christian M. Lumen'),
			new AccountingRequestsListRP('SCV-2018-09-0001', 'Accenture', 'Check Voucher', 'Open', new Date(), 'Miscellaneous payment for', 'PHP', 230000, 'Chie Reyes'),
			new AccountingRequestsListRP('SCV-2018-11-0001', 'NSO', 'Check Voucher', 'Open', new Date(), 'Miscellaneous payment for', 'RMB', 1500000, 'Chie Reyes'),
			new AccountingRequestsListRP('SCV-2019-04-0095', 'DFA', 'Check Voucher', 'Open', new Date(), 'Miscellaneous payment for', 'PHP', 1642857.14, 'Chie Reyes'),
			new AccountingRequestsListRP('PRM-2019-05-0032', 'Robinsons', 'Payment of Risk Management Fee to Employees', 'Open', new Date(), 'Payment of Risk Management Fee to Employees', 'USD', 1342752.24, 'Chie Reyes'),
		];

		return this.accountingSPaytReqList;
	}

	getAccountingSPaytReqCheckVoucher(){
		this.accountingSPaytReqCheckVoucher = [
			new AccountingSPaytReqCheckVoucher('Printing of Forms', 'Printing of forms for the month of April 2015', 'PHP', 1, 74602348231.46, 74602348231.46),
		];

		return this.accountingSPaytReqCheckVoucher;
	}

	getAccountingSPaytReqPettyCashVoucher(){
		this.accountingSPaytReqPettyCashVoucher = [
			new AccountingSPaytReqPettyCashVoucher('2019', '00001', new Date(2019,1,31), 'Christian M. Lu', 'Cash Advance Re-inspection of Office', 'Y', 'New', 'PHP', 1, 60000000000, 60000000000),
			new AccountingSPaytReqPettyCashVoucher('2019', '00002', new Date(2019,2,1), 'Christian M. Lu', 'Purchase of USB Memory Card', 'Y', 'New', 'PHP', 1, 900000000000, 900000000000),
		];

		return this.accountingSPaytReqPettyCashVoucher;
	}

	getAccountingSPaytReqPRMFE(){
		this.accountingSPaytReqPRMFE = [
			new AccountingSPaytReqPRMFE('00023', 'Rose Dela Cruz', 'Engineering', 'PHP', 1, 74602348231.46, 74602348231.46),
		];

		return this.accountingSPaytReqPRMFE;
	}

	getAccountingSPaytReqOthers(){
		this.accountingSPaytReqOthers = [
			new AccountingSPaytReqOthers('Utilities', '', 'Payment For', 'PHP', 1, 100000000000, 100000000000),
		];

		return this.accountingSPaytReqOthers;
	}

	getAcctSrvcCWhtaxMonthlyTaxDetails(){
		this.acctSrvcCWhtaxMonthlyTaxDetails = [
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",0,50,"0000","2GO EXPRESS","","","",new Date('2018-01-01'),"WC160",2,275.50,5.51),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",1,850,"0057","2GO EXPRESS","","","",new Date('2018-01-01'),"WC160",2,169.50,3.39),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",2,855,"0067","ABACUS BOOK","","","",new Date('2018-01-01'),"WC160",2,593.75,11.88),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",3,299,"0568","ABACUS BOOK","","","",new Date('2018-01-01'),"WC158",1,613.19,6.13),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",4,452,"0124","ABIVA BROTHERS","","","",new Date('2018-01-01'),"WC158",1,2352.93,23.53),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",5,536646,"0099","ABIVA BROTHERS","","","",new Date('2018-01-01'),"WC011",15,1150,172.5),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",6,584567,"0099","ACE HARDWARE","","","",new Date('2018-01-01'),"WC158",1,4618,46.18),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",7,5322,"0004","ACE HARDWARE","","","",new Date('2018-01-01'),"WC158",1,21250,212.50),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",8,1345,"0073","ACTUARIAL SOCIETY","","","",new Date('2018-01-01'),"WC158",1,14546,145.46),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",9,974546,"0013","ALING TONYA'S SEAFOOD","","","",new Date('2018-01-01'),"WC011",15,1875,281.25),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",10,688832,"0044","ALING TONYA'S SEAFOOD","","","",new Date('2018-01-01'),"WC011",15,100,15),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",11,953453,"0134","AMBER'S RESTAURANT","","","",new Date('2018-01-01'),"WC160",2,5000,100),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",12,4342,"0135","ATENEO DE MANILA","","","",new Date('2018-01-01'),"WC160",2,1000,20),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",13,2335,"0054","ATENEO DE DAVAO","ALMADEN","CATHRINE","E",new Date('2018-01-01'),"WC160",2,352.83,7.06),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",14,96322,"0053","AVE & BOY FLOWERSHOP","AQUINO","ROMMEL","I",new Date('2018-01-01'),"WC158",1,100,1),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",15,55435,"0042","AVE & BOY FLOWERSHOP","","","",new Date('2018-01-01'),"WC160",2,300,6),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",16,34,"0034","BBB SHELL SERVICE","","","",new Date('2018-01-01'),"WC011",15,2250,337.50),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",17,4345,"0022","2GO EXPRESS","","","",new Date('2018-01-01'),"WC158",1,10000,100),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",18,633,"0022","2GO EXPRESS","ALMADEN","CATHRINE","E",new Date('2018-01-01'),"WC160",2,300,6),
			new AcctSrvcCWhtaxMonthlyTaxDetails("D4","D1604E",19,432,"0032","2GO EXPRESS","AQUINO","ROMMEL","I",new Date('2018-01-01'),"WC160",2,223,4.46),
		];
		return this.acctSrvcCWhtaxMonthlyTaxDetails;
	}

	getAcctSrvcCWhtaxConsolidateData(){
		this.acctSrvcCWhtaxConsolidateData = [
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),0,50,"0000","2GO EXPRESS","","","","WC160",2,275.50,5.51),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),1,850,"0057","2GO EXPRESS","","","","WC160",2,169.50,3.39),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),2,855,"0067","ABACUS BOOK","","","","WC160",2,593.75,11.88),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),3,299,"0568","ABACUS BOOK","","","","WC158",1,613.19,6.13),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),4,452,"0124","ABIVA BROTHERS","","","","WC158",1,2352.93,23.53),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),5,536646,"0099","ABIVA BROTHERS","","","","WC011",15,1150,172.5),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),6,584567,"0099","ACE HARDWARE","","","","WC158",1,4618,46.18),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),7,5322,"0004","ACE HARDWARE","","","","WC158",1,21250,212.50),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),8,1345,"0073","ACTUARIAL SOCIETY","","","","WC158",1,14546,145.46),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),9,974546,"0013","ALING TONYA'S SEAFOOD","","","","WC011",15,1875,281.25),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),10,688832,"0044","ALING TONYA'S SEAFOOD","","","","WC011",15,100,15),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),11,953453,"0134","AMBER'S RESTAURANT","","","","WC160",2,5000,100),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),12,4342,"0135","ATENEO DE MANILA","","","","WC160",2,1000,20),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),13,2335,"0054","ATENEO DE DAVAO","ALMADEN","CATHRINE","E","WC160",2,352.83,7.06),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),14,96322,"0053","AVE & BOY FLOWERSHOP","AQUINO","ROMMEL","I","WC158",1,100,1),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),15,55435,"0042","AVE & BOY FLOWERSHOP","","","","WC160",2,300,6),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),16,34,"0034","BBB SHELL SERVICE","","","","WC011",15,2250,337.50),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),17,4345,"0022","2GO EXPRESS","","","","WC158",1,10000,100),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),18,633,"0022","2GO EXPRESS","ALMADEN","CATHRINE","E","WC160",2,300,6),
			new AcctSrvcCWhtaxConsolidateData("D4","D1604E","005376602","0000",new Date('2018-12-31'),19,432,"0032","2GO EXPRESS","AQUINO","ROMMEL","I","WC160",2,223,4.46),
		];
		return this.acctSrvcCWhtaxConsolidateData;
	}

	getTaxDetails(){
		this.taxDetails = [
			new TaxDetails("Output", "Services", "Payor", 25012, 3001.44),
		];

		return this.taxDetails;
	}

	getWTaxDetails(){
		this.wTaxDetails = [
			new WTaxDetails("WC002","WTax on Investment Income PHP", 2.00, "BPI/INSURANCE CORPORATION", 25012, 500.24),
		];

		return this.wTaxDetails;
	}

	getListBudAcc(){
		this.expenseBudget = [
			new ExpenseBudget(new Date("01/31/2018"),"5-01-01-01","Salaries", null, null, 18112500),
			new ExpenseBudget(new Date("02/28/2018"),"5-01-01-01","Salaries", null, null, 10150000),
			new ExpenseBudget(new Date("03/31/2018"),"5-01-01-01","Salaries", null, null, 1000000),
			new ExpenseBudget(new Date("04/30/2018"),"5-01-01-01","Salaries", null, null, 1000000),
			new ExpenseBudget(new Date("05/31/2018"),"5-01-01-01","Salaries", null, null, 1000000),
			new ExpenseBudget(new Date("06/30/2018"),"5-01-01-01","Salaries", null, null, 1000000),
			new ExpenseBudget(new Date("07/31/2018"),"5-01-01-01","Salaries", null, null, 1000000),
			new ExpenseBudget(new Date("08/31/2018"),"5-01-01-01","Salaries", null, null, 1000000),
			new ExpenseBudget(new Date("09/30/2018"),"5-01-01-01","Salaries", null, null, 1000000),
			new ExpenseBudget(new Date("10/31/2018"),"5-01-01-01","Salaries", null, null, 1000000),
		];

		return this.expenseBudget;
	}


	getListBudAccByMonth(){
		this.expenseBudgetByMonth = [
			new ExpenseBudgetByMonth("5-01-01-01","Salaries",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-01-02","Overtime",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-01-03","Mid-Year Bonus",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-01-04","13th Month Pay",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-01-05","Provision for Profit Sharing",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-02-01","Leave Conversion",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-02-02","Employee Uniform",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-02-03","Health Care",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-02-04","Group Life",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-02-05","Group Personal Accident",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-02-06","Company Outing",0,0,0,0,0,0,0,0,0,0,0,0,0),
			new ExpenseBudgetByMonth("5-01-02-07","Sports and Other Activities",0,0,0,0,0,0,0,0,0,0,0,0,0),	
			new ExpenseBudgetByMonth("5-01-02-08","Service Award",0,0,0,0,0,0,0,0,0,0,0,0,0),				
		];

		return this.expenseBudgetByMonth;
	}

	getAccountingSrvcCancelledTransactions() {
		this.accountingSrvcCancelledTransactions = [
			new AccountingSrvcCancelledTransactions('JV', '2018-00329482', new Date('1/6/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 100000),
			new AccountingSrvcCancelledTransactions('OR', '2018-02938210', new Date('1/7/2018'), 'Malayan', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 546043),
			new AccountingSrvcCancelledTransactions('OR', '2018-00737323', new Date('1/7/2018'), 'Malayan', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 14000000),
			new AccountingSrvcCancelledTransactions('OR', '2018-00012837', new Date('1/7/2018'), 'Malayan', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 2404000),
			new AccountingSrvcCancelledTransactions('OR', '2018-00728347', new Date('1/8/2018'), 'STI', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 1000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00008837', new Date('1/8/2018'), 'STI', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 1000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00273812', new Date('1/8/2018'), 'STI', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 6000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-07234812', new Date('1/10/2018'), 'UCPBGEN', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 100000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-08341023', new Date('1/10/2018'), 'UCPBGEN', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 10000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-07415123', new Date('1/10/2018'), 'UCPBGEN', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 34000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00782348', new Date('1/10/2018'), 'San Miguel Corporation', 'Premium Payments', 'Juan Dela Cruz', new Date(), 'Incorrect Amounts', 56000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-19592323', new Date('1/10/2018'), 'SMDC', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 20000000),
			new AccountingSrvcCancelledTransactions('CV', '2018-08437123', new Date('1/10/2018'), 'Charter', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 3000000),
			new AccountingSrvcCancelledTransactions('CV', '2018-89723489', new Date('1/10/2018'), 'UCPBGEN', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 56000),
			new AccountingSrvcCancelledTransactions('CV', '2018-00876234', new Date('1/12/2018'), 'STI', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 1000000),
			new AccountingSrvcCancelledTransactions('CV', '2018-76349012', new Date('1/12/2018'), 'Malayan', 'Premium Payments', 'Mark Anthony Castillo', new Date(), 'Incorrect Amounts', 1000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00784651', new Date('1/12/2018'), 'ABS-CBN', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 234000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00837451', new Date('1/12/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 32000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00872634', new Date('1/12/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 10000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00897236', new Date('1/15/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 1400000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00872634', new Date('1/15/2018'), 'STI', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 56000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00726341', new Date('1/15/2018'), 'STI', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 10000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00786234', new Date('1/15/2018'), 'STI', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 14000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00263412', new Date('2/3/2018'), 'San Miguel Corporation', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 32000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00827364', new Date('2/3/2018'), 'San Miguel Corporation', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 3000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-08712634', new Date('2/3/2018'), 'San Miguel Corporation', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 56000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00087126', new Date('2/3/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 10000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00928734', new Date('2/3/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 32000000),
			new AccountingSrvcCancelledTransactions('JV', '2018-00782364', new Date('2/3/2018'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 1400000),
		];

		return this.accountingSrvcCancelledTransactions;
	}


	getCreditDebit(){
		this.creditDebit = [
			new CMDM("CM-CAR-2019-02-00001",new Date(2015,0,10),"UCPBGEN","To correct entries in","Policy","2014-00004342","Ronwaldo Roque",1642857.14),
			new CMDM("DM-CAR-2019-02-00001",new Date(2017,0,10),"UCPBGEN","To correct entries in","Policy","2014-00001644","Chie Reyes",200000),
			new CMDM("CM-CLM-2019-02-00001",new Date(2017,2,10),"Malayan","To correct entries in","Claims","2016-00001645","Lourdes Gualvez",100000),
			new CMDM("CM-CLM-2019-02-00001",new Date(2017,3,10),"Malayan","To correct entries in","Claims","2016-00001646","Chie Reyes",100000000),
			new CMDM("CM-CAR-2019-02-00001",new Date(2015,0,10),"UCPBGEN","To correct entries in","Policy","2014-00004342","Ronwaldo Roque",1642857.14),
			new CMDM("DM-CAR-2019-02-00001",new Date(2017,0,10),"UCPBGEN","To correct entries in","Policy","2014-00001644","Chie Reyes",200000),
			new CMDM("CM-CLM-2019-02-00001",new Date(2017,2,10),"Malayan","To correct entries in","Claims","2016-00001645","Lourdes Gualvez",100000),
			new CMDM("CM-CLM-2019-02-00001",new Date(2017,3,10),"Malayan","To correct entries in","Claims","2016-00001646","Chie Reyes",100000000),
			new CMDM("CM-CAR-2019-02-00001",new Date(2015,0,10),"UCPBGEN","To correct entries in","Policy","2014-00004342","Ronwaldo Roque",1642857.14),
			new CMDM("DM-CAR-2019-02-00001",new Date(2017,0,10),"UCPBGEN","To correct entries in","Policy","2014-00001644","Chie Reyes",200000),
			new CMDM("CM-CLM-2019-02-00001",new Date(2017,2,10),"Malayan","To correct entries in","Claims","2016-00001645","Lourdes Gualvez",100000),
			new CMDM("CM-CLM-2019-02-00001",new Date(2017,3,10),"Malayan","To correct entries in","Claims","2016-00001646","Chie Reyes",100000000),
		]
		return this.creditDebit;
	}


	getAccountingEntryCMDM(){
		this.accountingEntryCMDM = [
			new AccountingEntryCMDM(null,null,null,null,null,null)
		]
		return this.accountingEntryCMDM;
	}

	getAccSChangeTranStatOR(){
		this.accSChangeTranStatOR = [
			new AccSChangeTranStatOR('VAT-000001', 'BPI/MS INSURANCE CORPORATION', new Date(2018,9,1), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 1642857.14),
			new AccSChangeTranStatOR('VAT-000002', 'PNBGEN', new Date(2018,9,1), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 200000),
			new AccSChangeTranStatOR('VAT-000003', 'Charter Ping An', new Date(2018,9,3), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 100000),
			new AccSChangeTranStatOR('VAT-000004', 'AXA', new Date(2018,9,4), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 1000000),
			new AccSChangeTranStatOR('VAT-000005', 'Allied Bankers', new Date(2018,9,4), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 710716.12),
			new AccSChangeTranStatOR('VAT-000006', 'Malayan', new Date(2018,9,7), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 756929),
			new AccSChangeTranStatOR('VAT-000007', 'New India', new Date(2018,9,7), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 30000),
			new AccSChangeTranStatOR('VAT-000008', 'BPI/MS INSURANCE CORPORATION', new Date(2018,9,12), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 10000),
			new AccSChangeTranStatOR('VAT-000009', 'PNBGEN', new Date(2018,9,13), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 230000),
			new AccSChangeTranStatOR('VAT-000010', 'FGIC', new Date(2018,9,14), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 1500000),
			new AccSChangeTranStatOR('VAT-000011', 'PNBGEN', new Date(2018,9,17), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 2342321),
			new AccSChangeTranStatOR('VAT-000012', 'FGIC', new Date(2018,9,23), 'Official Receipt', 'Cancelled', 'Representing payment for premium of policy CAR-2018-00001-00-0001-000', 1532242.42),
		];

		return this.accSChangeTranStatOR;
	}

	getAccSChangeTranStatCV(){
		this.accSChangeTranStatCV = [
			new AccSChangeTranStatCV('2015-00000001', 'SM Prime Holdings, Inc.', new Date(2015,9,1), 'Printed', 'Check for SM Prime Holdings, Inc.', 1642857.14),
			new AccSChangeTranStatCV('2017-00000001', 'Rustan Inc.', new Date(2017,9,1), 'Printed', 'Check for Rustan Inc.', 200000),
			new AccSChangeTranStatCV('2017-00000002', 'San Miguel Corporation', new Date(2017,9,3), 'Printed', 'Check for San Miguel Corporation', 100000),
			new AccSChangeTranStatCV('2017-00000003', 'DMCI', new Date(2017,9,4), 'Printed', 'Check for DMCI', 1000000),
			new AccSChangeTranStatCV('2018-00000001', 'ABS-CBN', new Date(2018,9,4), 'Printed', 'Check for ABS-CBN', 710716.12),
			new AccSChangeTranStatCV('2018-00000010', 'SMDC', new Date(2018,9,5), 'Certified', 'Check for SMDC', 756929),
			new AccSChangeTranStatCV('2018-00000016', 'Universal Robina Inc.', new Date(2018,9,7), 'Approved', 'Check for Universal Robina Inc.', 30000),
			new AccSChangeTranStatCV('2018-00000045', 'SGV & Co.', new Date(2018,9,7), 'Approved', 'Check for SGV & Co.', 10000),
			new AccSChangeTranStatCV('2018-00000099', 'Accenture', new Date(2018,9,7), 'Cancelled', 'Check for Accenture', 230000),
			new AccSChangeTranStatCV('2018-00000123', 'NSO', new Date(2018,9,7), 'Cancelled', 'Check for NSO', 1500000),
			new AccSChangeTranStatCV('2019-00000001', 'SMDC', new Date(2018,9,7), 'Cancelled', 'Check for SMDC', 2342321),
			new AccSChangeTranStatCV('2019-00000005', 'DMCI', new Date(2018,9,7), 'Cancelled', 'Check for DMCI', 1532242.42),
		];

		return this.accSChangeTranStatCV;
	}

	getAccSChangeTranStatJV(){
		this.accSChangeTranStatJV = [
			new AccSChangeTranStatJV('2015-00000001', new Date(2015,9,1), 'To correct entries in', 'Error Correction', '2014-00004342', 'Ronwaldo Roque', 'Printed', 1642857.14),
			new AccSChangeTranStatJV('2017-00000001', new Date(2017,9,1), 'To correct entries in', 'Error Correction', '2016-00001644', 'Chie Reyes', 'Printed', 200000),
			new AccSChangeTranStatJV('2017-00000002', new Date(2017,9,3), 'To correct entries in', 'Error Correction', '2016-00001645', 'Lourdez Gualvez', 'Printed', 100000),
			new AccSChangeTranStatJV('2017-00000003', new Date(2017,9,4), 'To correct entries in', 'Error Correction', '2016-00001646', 'Chie Reyes', 'Printed', 1000000),
			new AccSChangeTranStatJV('2018-00000001', new Date(2018,9,4), 'To correct entries in', 'Error Correction', '2017-00000324', 'Chie Reyes', 'Printed', 710716.12),
			new AccSChangeTranStatJV('2018-00000010', new Date(2018,9,5), 'To correct entries in', 'Error Correction', '2018-00000009', 'Lourdes Gualvez', 'Certified', 756929),
			new AccSChangeTranStatJV('2018-00000016', new Date(2018,9,7), 'To correct entries in', 'Error Correction', '2018-00000012', 'Lourdes Gualvez', 'Approved', 30000),
			new AccSChangeTranStatJV('2018-00000045', new Date(2018,9,7), 'To correct entries in', 'Error Correction', '2018-00000041', 'Ronwaldo Roque', 'Approved', 10000),
			new AccSChangeTranStatJV('2018-00000099', new Date(2018,9,7), 'To correct entries in', 'Error Correction', '2018-00000098', 'Ronwaldo Roque', 'Cancelled', 230000),
			new AccSChangeTranStatJV('2018-00000123', new Date(2018,9,7), 'To correct entries in', 'Error Correction', '2018-00000122', 'Ronwaldo Roque', 'Cancelled', 1500000),
			new AccSChangeTranStatJV('2019-00000001', new Date(2018,9,7), 'To correct entries in', 'Error Correction', '2018-00000123', 'Ronwaldo Roque', 'Cancelled', 2342321),
			new AccSChangeTranStatJV('2019-00000005', new Date(2018,9,7), 'To correct entries in', 'Error Correction', '2018-00000144', 'Ronwaldo Roque', 'Cancelled', 1532242.42),
		];

		return this.accSChangeTranStatJV;
	}

	getLossRepDep(){
		this.accJvLossResDep = [
			new AccJvLossResDep("BPI/IMS INSURANCE CORPORATION","Initial", new Date("01/25/2019"), "PHP",1.0,500000,500000),
			new AccJvLossResDep("BPI/IMS INSURANCE CORPORATION","Additional", new Date("01/25/2019"), "PHP",1.0,20000,20000),
			new AccJvLossResDep("BPI/IMS INSURANCE CORPORATION","CUMI", new Date("01/25/2019"), "PHP",1.0,500000,500000)
			
		];
		return this.accJvLossResDep;
	}

	getAccSrvInquiry(){
		this.accSrvInquiry = [
		new AccSrvInquiry("CV","2018-00372881",new Date("10/01/2018"),"INVOICE COMMUNICATIONS","Billing for the Period of April 16 to May 01 2018", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",2999),
		new AccSrvInquiry("CV","2018-00372882",new Date("10/02/2018"),"UCPBGEN","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",546043),
		new AccSrvInquiry("CV","2018-00372883",new Date("10/03/2018"),"UCPBGEN","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",14000000),
		new AccSrvInquiry("CV","2018-00372843",new Date("10/02/2018"),"STI","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",2404000),
		new AccSrvInquiry("CV","2018-00372844",new Date("10/02/2018"),"UCPBGEN","Premium Payments", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",1000000),
		new AccSrvInquiry("CV","2018-00372490",new Date("10/02/2018"),"UCPBGEN","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",1000000),
		new AccSrvInquiry("CV","2018-00372491",new Date("10/02/2018"),"PNBBGEN","Premium Payments", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",6000000),
		new AccSrvInquiry("CV","2018-00372500",new Date("10/01/2018"),"MRS. SANTOS","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",10000000),
		new AccSrvInquiry("CV","2018-00378913",new Date("10/02/2018"),"MALAYAN","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",2990),
		new AccSrvInquiry("CV","2018-00372454",new Date("10/03/2018"),"CHARTER","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",14000000),
		new AccSrvInquiry("CV","2018-00372654",new Date("10/02/2018"),"ABS-CBN","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",2404000),
		new AccSrvInquiry("CV","2018-00372553",new Date("10/02/2018"),"San Miguel Corporation","Premium Payments", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",234000644),
		new AccSrvInquiry("CV","2018-00372765",new Date("10/02/2018"),"BPI/MS","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",1000000),
		new AccSrvInquiry("CV","2018-00372464",new Date("10/02/2018"),"Charter","Premium Payments", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",6000000),
		new AccSrvInquiry("CV","2018-00378913",new Date("10/02/2018"),"MALAYAN","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",2990),
		new AccSrvInquiry("CV","2018-00372454",new Date("10/03/2018"),"CHARTER","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",14000000),
		new AccSrvInquiry("CV","2018-00372654",new Date("10/02/2018"),"ABS-CBN","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",2404000),
		new AccSrvInquiry("CV","2018-00372553",new Date("10/02/2018"),"San Miguel Corporation","Premium Payments", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",234000644),
		new AccSrvInquiry("CV","2018-00372765",new Date("10/02/2018"),"BPI/MS","Payment For", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",1000000),
		new AccSrvInquiry("CV","2018-00372464",new Date("10/02/2018"),"Charter","Premium Payments", "cuaresma",new Date("10/12/2018"),"Account should be Internet","New",6000000),
	
		];
		
		return this.accSrvInquiry;
	}

	getQSOABalancesData() {
		this.qsoaBalances = [
			new QSOABalances(new Date(2018, 2, 31), 'PHP', 1, 100000, 100000),
			new QSOABalances(new Date(2018, 5, 30), 'PHP', 1, -500000, -500000),
		];
		return this.qsoaBalances;
	}

}