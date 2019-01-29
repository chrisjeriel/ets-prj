import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARDetails, AccountingEntries, CVListing, AmountDetailsCV, AccountingEntriesCV, QSOA, AttachmentInfo, CheckDetails, VATDetails, CreditableTax, AccountingRequestsListRP, AccountingITCancelledTransactions, JVListing, ARTaxDetailsVAT, ARTaxDetailsWTAX, ARInwdPolBalDetails, ARClaimsRecovery, AccCvAttachment, AccCVPayReqList, AcknowledgementReceipt, CheckVoucher, JournalVoucher, CancelTransactionAR, CancelTransactionCV, CancelTransactionJV, AccInvestments, AccItEditedTransactions, AccItEditedOldAcctEntries, AccItEditedLatestAcctEntries, AmountDetailsJV, AccountingEntriesJV, VATDetailsJV, CreditableTaxJV, PremiumReturnList, AccJvInPolBal, AccJVPayReqList, AccTBTotDebCred, AccTBNet, AccountingItClaimCashCallAr, AccountingItLossReserveDepositAr, AccountingItClaimOverPaymentAr, AccARInvestments } from '@app/_models';

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
	accountingItClaimCashCallArData: AccountingItClaimCashCallAr[] = [];
	accountingItLossReserveDepositArData: AccountingItLossReserveDepositAr[] = [];
	accountingItClaimOverPaymentArData: AccountingItClaimOverPaymentAr[] = [];
	accARInvestments: AccARInvestments[] = [];

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
			new AccountingRequestsListRP('CSR-2015-01-0001', 'SM Prime Holdings, Inc.', 'Claim Payment', 'Paid', new Date(), 'Payment for Claim No.', 'PHP', 1642857.14, 'Edward M. Salunson'),
			new AccountingRequestsListRP('CSR-2017-12-0001', 'Rustan, Inc.', 'Claim Payment', 'Paid', new Date(), 'Payment for Claim No.', 'PHP', 200000, 'Christian M. Lumen'),
			new AccountingRequestsListRP('PRR-2017-12-0002', 'San Miguel Corporation', 'Premium Returns', 'Paid', new Date(), 'Return of Premium for Policy No.', 'PHP', 100000, 'Chie Reyes'),
			new AccountingRequestsListRP('PRR-2017-12-0003', 'DMCI', 'Premium Returns', 'Cancelled', new Date(), 'Return of Premium for Policy No.', 'USD', 1000000, 'Chie Reyes'),
			new AccountingRequestsListRP('PRR-2018-01-0001', 'ABS-CBN', 'Premium Returns', 'Paid', new Date(), 'Return of Premium for Policy No.', 'PHP', 710716.12, 'Juan de la Cruz'),
			new AccountingRequestsListRP('QBR-2018-02-0001', 'SMDC', 'QSOA Balances', 'Paid', new Date(), 'Treaty Balance due for 1st Qtr for company', 'SGD', 756929, 'Juan de la Cruz'),
			new AccountingRequestsListRP('PRR-2018-02-0002', 'Universal Robina, Inc.', 'Premium Returns', 'Open', new Date(), 'Return of Premium for Policy No.', 'EUR', 300000, 'Juan de la Cruz'),
			new AccountingRequestsListRP('QBR-2018-03-0001', 'SGV & Co.', 'QSOA Balances', 'Open', new Date(), 'Treaty Balance due for 1st Qtr for company', 'HKD', 1000000, 'Christian M. Lumen'),
			new AccountingRequestsListRP('CSR-2018-09-0001', 'Accenture', 'Claim Payment', 'Open', new Date(), 'Payment for Claim No.', 'PHP', 230000, 'Chie Reyes'),
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
			new ARInwdPolBalDetails("CAR-2018-00001-99-0001-000", "01", new Date('09/25/2018'), "PHP", 3000000, 0, 0, 1642857.14, 1357142.86, 0, 1642857.14),
		]
		return this.arInwdPolBalDetails;
	}

	getARClaimsRecovery() {
		this.arClaimsRecovery = [
			new ARClaimsRecovery("CAR-2018-000001", 3, "Loss", "Recovery", "Salvage for Construction Materials", "PHP", 1, 30000, 30000),
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
			new AccountingEntriesCV('5-01-13-02', 'Internet Expense', '', '', 2971.43, 0),
			new AccountingEntriesCV('1-59', 'Input VAT', '', '', 321.32, 0),
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
			new AccItEditedLatestAcctEntries("5-01-13-04", "Telephone Line", "", "", 2677.68, 0),
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
			new AccJvInPolBal('CAR-2018-00001-99-0001-000', '01', new Date("09/25/2018"), 'PHP', 3000000, 0.00, 0.00, 1642857.14, 1357142.86, 0.00, 1642857.14),
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
			new AccTBTotDebCred(null,null,null,null,null),
				];
		
		return this.accTBTotDebCred;
	}

	getAccTBNet() {
		this.accTBNet = [
			new AccTBNet(null,null,null,null,null),
				];
		
		return this.accTBNet;
	}

	getAccountingItClaimCashCallAR(){
		this.accountingItClaimCashCallArData = [
			new AccountingItClaimCashCallAr('CAR-2018-000001', 'CAR-2018-00001-99-0001-000', 'DMCI', new Date(2018,9,1), 'Damaged Material', 1000000, 'PHP', 1, 300000, 300000),
		];

		return this.accountingItClaimCashCallArData;
	}

	getAccountingItLossReserveDepositAR(){
		this.accountingItLossReserveDepositArData = [
			new AccountingItLossReserveDepositAr('BPI/MS INSURANCE CORPORATION', new Date(2018,9,1), 'Loss reserve deposit for', 'PHP', 1, 500000, 500000),
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
			new AccARInvestments('BPI','BPI 1',5,'Years',8.875, new Date(2013,9,20),new Date(2018,9,20),'PHP',1,18112.50,82250,14000000,18112500,4112500),
			new AccARInvestments('RCBC','RCBC 1',35,'Days',1.5, new Date(2018,8,26),new Date(2018,9,31),'PHP',1,10150,3000,10000000,10150000,150000)
		];
		return this.accARInvestments;
	}


}