import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARDetails, AccountingEntries, CVListing, AmountDetailsCV, AccountingEntriesCV, QSOA, AttachmentInfo, CheckDetails, VATDetails, CreditableTax, AccountingRequestsListRP, AccountingITCancelledTransactions, JVListing, ARTaxDetailsVAT, ARTaxDetailsWTAX, ARInwdPolBalDetails, ARClaimsRecovery, AccCvAttachment , AccCVPayReqList , AcknowledgementReceipt, CheckVoucher, JournalVoucher, CancelTransactionAR, CancelTransactionCV, CancelTransactionJV, AccInvestments} from '@app/_models';

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
	vatDetails: VATDetails[]=[];
	creditableTax: CreditableTax[]=[];
	paytRequestListData: AccountingRequestsListRP[] = [];
	cancelledTransactionsData: AccountingITCancelledTransactions[] = [];
	jvListing: JVListing[]=[];
	arTaxDetailsVAT: ARTaxDetailsVAT[] = [];
	arTaxDetailsWTAX: ARTaxDetailsWTAX[] = [];
	arInwdPolBalDetails: ARInwdPolBalDetails[] = [];
	arClaimsRecovery: ARClaimsRecovery[] = [];
	accCvAttachment: AccCvAttachment[]=[];
	accCvPayReqList: AccCVPayReqList[]=[];
	accInvestments: AccInvestments[]=[];
	chngTxToNewAR: AcknowledgementReceipt[] = [];
	chngTxToNewCV: CheckVoucher[] = [];
	chngTxToNewJv: JournalVoucher[] = [];
	cancelAR: CancelTransactionAR[] = [];
	cancelCV: CancelTransactionCV[] =[];
	cancelJV: CancelTransactionJV[]= [];


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
			new CVListing(new Date(2016, 1, 1), 1, "SM Prime Holdings, Inc", new Date(), "Printed", "Check for SM Prime Holdings Inc", 1642857.14),
			new CVListing(new Date(), 1, "Rustans, Inc", new Date(), "Printed", "Check for Rustans Inc", 200000),
			new CVListing(new Date(), 1, "San Miguel Corp", new Date(), "Printed", "Check for San Miguel Corp", 100000),
			new CVListing(new Date(), 1, "DMCI", new Date(), "Printed", "Check for DMCI", 1000000),
			new CVListing(new Date(), 1, "ABS-CBN", new Date(), "Printed", "Check for ABS-CBN", 710716.12),
			new CVListing(new Date(), 1, "SMDC", new Date(), "Certified", "Check for SMDC", 756929),
			new CVListing(new Date(), 1, "Universal Robina, Inc", new Date(), "Approved", "Check for Universal Robina, Inc", 300000),
			new CVListing(new Date(), 1, "SGV & Co", new Date(), "Approved", "Check for SGV & Co", 1000000),
			new CVListing(new Date(), 1, "Accenture", new Date(), "New", "Check for Accenture", 230000),
			new CVListing(new Date(), 1, "NSO", new Date(), "New", "Check for NSO", 1500000),
		]

		return this.cvListing;
	}

	getCheckDetails() {
		this.checkDetails = [
			new CheckDetails("Banco De Oro","PCPA-9091-7001-7389",new Date(),17948303,"Local Clearing","PHP",27513.29),
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

	getPaytRequestsList(){
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

	getCancelledTransactions(){
		this.cancelledTransactionsData = [
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
			new AccountingITCancelledTransactions('JV', '2018-00329482', new Date('1/6/2019'), 'BPI/MS', 'Premium Payments', 'Chie Reyes', new Date(), 'Incorrect Amounts', 'Cancelled'),
		];

		return this.cancelledTransactionsData;
	}
	getJVListing() {
		this.jvListing = [
			new JVListing("2015-00000001",new Date(2015,10,1),"To correct entries in","Error Connection","2014-00004342","Ronwaldo Roque","Printed",1642857.14),
			new JVListing("2017-00000001",new Date(2015,10,1),"To correct entries in","Error Connection","2016-00001644","Chie Reyes","Printed",200000),
			new JVListing("2017-00000002",new Date(2015,10,1),"To correct entries in","Error Connection","2016-00001645","Lourdes Gualvez","Printed",100000),
			new JVListing("2017-00000003",new Date(2015,10,1),"To correct entries in","Error Connection","2016-00001646","Chie Reyes","Printed",1000000),
			new JVListing("2018-00000001",new Date(2015,10,1),"To correct entries in","Error Connection","2017-00000324","Chie Reyes","Printed",710716.12),
			new JVListing("2018-00000010",new Date(2015,10,1),"To correct entries in","Error Connection","2018-00000009","Lourdes Gualvez","Open",756929),
			new JVListing("2018-00000016",new Date(2015,10,1),"To correct entries in","Error Connection","2018-00000012","Lourdes Gualvez","Cancelled",300000),
			new JVListing("2018-00000045",new Date(2015,10,1),"To correct entries in","Error Connection","2018-00000041","Ronwaldo Roque","Cancelled",1000000),
			new JVListing("2018-00000099",new Date(2015,10,1),"To correct entries in","Error Connection","2018-00000098","Ronwaldo Roque","Open",230000),
			new JVListing("2018-00000123",new Date(2015,10,1),"To correct entries in","Error Connection","2018-00000122","Ronwaldo Roque","Open",1500000),
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
	getAccCVAttachment(){
		this.accCvAttachment = [ 
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_01.doc","Accounting Specifications Sample 1"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_02.doc","Accounting Specifications Sample 2"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_03.doc","Accounting Specifications Sample 3"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_04.doc","Accounting Specifications Sample 4"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_05.doc","Accounting Specifications Sample 5"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_06.doc","Accounting Specifications Sample 6"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_07.doc","Accounting Specifications Sample 7"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_08.doc","Accounting Specifications Sample 8"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_09.doc","Accounting Specifications Sample 9"),
			new AccCvAttachment("C:\\Users\\CPI\\Desktop\\PMMSC_ETC\\SRS\\05-Accounting\\Sample_10.doc","Accounting Specifications Sample 10"),
		]
		return this.accCvAttachment;
	}

	getAccCVPayReqList(){
		this.accCvPayReqList = [
			new AccCVPayReqList("OPR-2018-01-0001","San Miguel Corporation","Others","Open", new Date("09/20/2018"),"Payment for San Miguel","Rosalinda Mercedez","PHP",27513.20)
		]
		return this.accCvPayReqList;
	}

	getAccInvestments(){
		this.accInvestments = [
			new AccInvestments("BPI","BPI 1", 5, "Years", 8.875000, new Date("10/20/2018"), new Date("10/20/2018"), 14000000, 1812500 ),
			new AccInvestments("RCBC","RCBC 1",35,"Days", 1.500000,new Date("09/26/2018"),new Date("10/31/2018"),10000000,10150000)
		]
		return this.accInvestments;
	}



	getChangeTxToNewAR(){
		this.chngTxToNewAR = [
			new AcknowledgementReceipt(1,'BPI/MS INSURANCE CORPORATION',new Date(2018,9,1),'Inward Policy Balances','Cancelled','Representing payment for premium of policy CAR-2018-00001-00-0001-000',1642857.14),
			new AcknowledgementReceipt(2,'PNBGEN',new Date(2018,9,1),'Inward Policy Balances','Cancelled','Representing payment for premium of policy CAR-2018-00001-00-0001-000',200000),
			new AcknowledgementReceipt(3,'Charter Ping An',new Date(2018,9,3),'Claim Recovery','Printed','Representing claim recovery payment for Claim No CAR-2018-000001',100000),
			new AcknowledgementReceipt(4,'AXA',new Date(2018,9,4),'QSOA','Printed','Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter',1000000),
			new AcknowledgementReceipt(5,'Allied Bankers',new Date(2018,9,4),'QSOA','Cancelled','Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter',710716.12),
			new AcknowledgementReceipt(6,'Malayan',new Date(2018,9,5),'Inward Policy Balances','Cancelled','Representing payment for premium of policy CAR-2018-00001-00-0001-000',756929),
			new AcknowledgementReceipt(7,'New India',new Date(2018,9,7),'Claim Recovery','Cancelled','Representing claim recovery payment for Claim No CAR-2018-000001',30000),
			new AcknowledgementReceipt(8,'BPI/MS INSURANCE CORPORATION',new Date(2018,9,7),'Claim Recovery','Printed','Representing claim recovery payment for Claim No CAR-2018-000001',10000),
			new AcknowledgementReceipt(9,'UCPBGEN',new Date(2018,9,7),'QSOA','Printed','Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter',230000),
			new AcknowledgementReceipt(10,'FGIC',new Date(2018,9,7),'Inward Policy Balances','Cancelled','Representing payment for premium of policy CAR-2018-00001-00-0001-000',1500000),
		];
		return this.chngTxToNewAR;
	}

	getChangeTxToNewCV(){
		this.chngTxToNewCV = [
			new CheckVoucher('2015-00000001','SM Prime Holdings, Inc', new Date(2015,9,1),'Printed','Check for SM Prime Holdings, Inc',1642857.14),
			new CheckVoucher('2017-00000001','Rustan Inc.', new Date(2017,9,1),'Printed','Check for Rustan Inc.',200000),
			new CheckVoucher('2017-00000002','San Miguel Corporation', new Date(2017,9,3),'Printed','Check for San Miguel Corporation',100000),
			new CheckVoucher('2017-00000003','DMCI', new Date(2017,9,4),'Printed','Check for DMCI',1000000),
			new CheckVoucher('2018-00000001','ABS-CBN', new Date(2018,9,4),'Printed','Check for ABS-CBN',710716.12),
			new CheckVoucher('2018-00000010','SMDC', new Date(2018,9,5),'Certified','Check for SMDC',756929),
			new CheckVoucher('2018-00000016','Universal Robina, Inc.', new Date(2018,9,7),'Approved','Check for Unversal Robina, Inc.',300000),
			new CheckVoucher('2018-00000045','SGV & Co.', new Date(2018,9,7),'Approved','Check for SGV & Co.',1000000),
			new CheckVoucher('2018-00000099','Accenture', new Date(2018,9,7),'New','Check for Accenture',230000),
			new CheckVoucher('2018-00000123','NSO', new Date(2018,9,7),'New','Check for NSO',1500000),

		];
		return this.chngTxToNewCV
	}

	getChangeTxToNewJV(){
		this.chngTxToNewJv = [
			new JournalVoucher('2015-00000001', new Date(2015,9,1),'To correct entries in','Error Correction','2014-00004342','Ronwaldo Roque','Printed',1642857.14),
			new JournalVoucher('2017-00000001', new Date(2017,9,1),'To correct entries in','Error Correction','2016-00001644','Chie Reyes','Printed',200000),
			new JournalVoucher('2017-00000002', new Date(2017,9,3),'To correct entries in','Error Correction','2016-00001645','Lourdes Galvez','Printed',100000),
			new JournalVoucher('2017-00000003', new Date(2017,9,4),'To correct entries in','Error Correction','2016-00001646','Chie Reyes','Printed',1000000),
			new JournalVoucher('2018-00000001', new Date(2018,9,4),'To correct entries in','Error Correction','2017-00000324','Chie Reyes','Printed',710716.12),
			new JournalVoucher('2018-00000010', new Date(2018,9,5),'To correct entries in','Error Correction','2018-00000009','Lourdes Galvez','Open',756929),
			new JournalVoucher('2018-00000016', new Date(2018,9,7),'To correct entries in','Error Correction','2018-00000012','Lourdes Galvez','Open',300000),
			new JournalVoucher('2018-00000045', new Date(2018,9,7),'To correct entries in','Error Correction','3018-00000041','Ronwaldo Roque','Open',1000000),
			new JournalVoucher('2018-00000099', new Date(2018,9,7),'To correct entries in','Error Correction','2018-00000098','Ronwaldo Roque','Open',230000),
			new JournalVoucher('2018-00000123', new Date(2018,9,7),'To correct entries in','Error Correction','2018-00000122','Ronwaldo Roque','Open',1500000),
		];
		return this.chngTxToNewJv;
	}

	getCancelAR(){
		this.cancelAR = [
			new CancelTransactionAR(1,'BPI/MS INSURANCE CORPORATION',new Date(2018,9,1),'Inward Policy Balances','Cancelled','Representing payment for premium of policy CAR-2018-00001-00-0001-000',1642857.14),
			new CancelTransactionAR(2,'PNBGEN',new Date(2018,9,1),'Inward Policy Balances','Cancelled','Representing payment for premium of policy CAR-2018-00001-00-0001-000',200000),
			new CancelTransactionAR(3,'Charter Ping An',new Date(2018,9,3),'Claim Recovery','Printed','Representing claim recovery payment for Claim No CAR-2018-000001',100000),
			new CancelTransactionAR(4,'AXA',new Date(2018,9,4),'QSOA','Printed','Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter',1000000),
			new CancelTransactionAR(5,'Allied Bankers',new Date(2018,9,4),'QSOA','Cancelled','Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter',710716.12),
			new CancelTransactionAR(6,'Malayan',new Date(2018,9,5),'Inward Policy Balances','Cancelled','Representing payment for premium of policy CAR-2018-00001-00-0001-000',756929),
			new CancelTransactionAR(7,'New India',new Date(2018,9,7),'Claim Recovery','Cancelled','Representing claim recovery payment for Claim No CAR-2018-000001',30000),
			new CancelTransactionAR(8,'BPI/MS INSURANCE CORPORATION',new Date(2018,9,7),'Claim Recovery','Printed','Representing claim recovery payment for Claim No CAR-2018-000001',10000),
			new CancelTransactionAR(9,'UCPBGEN',new Date(2018,9,7),'QSOA','Printed','Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter',230000),
			new CancelTransactionAR(10,'FGIC',new Date(2018,9,7),'Inward Policy Balances','Cancelled','Representing payment for premium of policy CAR-2018-00001-00-0001-000',1500000),
		];
		return this.cancelAR;
	}

	getCancelCV(){
		this.cancelCV = [
			new CancelTransactionCV('2015-00000001','SM Prime Holdings, Inc', new Date(2015,9,1),'Printed','Check for SM Prime Holdings, Inc',1642857.14),
			new CancelTransactionCV('2017-00000001','Rustan Inc.', new Date(2017,9,1),'Printed','Check for Rustan Inc.',200000),
			new CancelTransactionCV('2017-00000002','San Miguel Corporation', new Date(2017,9,3),'Printed','Check for San Miguel Corporation',100000),
			new CancelTransactionCV('2017-00000003','DMCI', new Date(2017,9,4),'Printed','Check for DMCI',1000000),
			new CancelTransactionCV('2018-00000001','ABS-CBN', new Date(2018,9,4),'Printed','Check for ABS-CBN',710716.12),
			new CancelTransactionCV('2018-00000010','SMDC', new Date(2018,9,5),'Certified','Check for SMDC',756929),
			new CancelTransactionCV('2018-00000016','Universal Robina, Inc.', new Date(2018,9,7),'Approved','Check for Unversal Robina, Inc.',300000),
			new CancelTransactionCV('2018-00000045','SGV & Co.', new Date(2018,9,7),'Approved','Check for SGV & Co.',1000000),
			new CancelTransactionCV('2018-00000099','Accenture', new Date(2018,9,7),'New','Check for Accenture',230000),
			new CancelTransactionCV('2018-00000123','NSO', new Date(2018,9,7),'New','Check for NSO',1500000),

		];
		return this.cancelCV;
	}

	getCancelJV(){
		this.cancelJV = [
			new CancelTransactionJV('2015-00000001', new Date(2015,9,1),'To correct entries in','Error Correction','2014-00004342','Ronwaldo Roque','Printed',1642857.14),
			new CancelTransactionJV('2017-00000001', new Date(2017,9,1),'To correct entries in','Error Correction','2016-00001644','Chie Reyes','Printed',200000),
			new CancelTransactionJV('2017-00000002', new Date(2017,9,3),'To correct entries in','Error Correction','2016-00001645','Lourdes Galvez','Printed',100000),
			new CancelTransactionJV('2017-00000003', new Date(2017,9,4),'To correct entries in','Error Correction','2016-00001646','Chie Reyes','Printed',1000000),
			new CancelTransactionJV('2018-00000001', new Date(2018,9,4),'To correct entries in','Error Correction','2017-00000324','Chie Reyes','Printed',710716.12),
			new CancelTransactionJV('2018-00000010', new Date(2018,9,5),'To correct entries in','Error Correction','2018-00000009','Lourdes Galvez','Open',756929),
			new CancelTransactionJV('2018-00000016', new Date(2018,9,7),'To correct entries in','Error Correction','2018-00000012','Lourdes Galvez','Open',300000),
			new CancelTransactionJV('2018-00000045', new Date(2018,9,7),'To correct entries in','Error Correction','3018-00000041','Ronwaldo Roque','Open',1000000),
			new CancelTransactionJV('2018-00000099', new Date(2018,9,7),'To correct entries in','Error Correction','2018-00000098','Ronwaldo Roque','Open',230000),
			new CancelTransactionJV('2018-00000123', new Date(2018,9,7),'To correct entries in','Error Correction','2018-00000122','Ronwaldo Roque','Open',1500000),
		];
		return this.cancelJV;
	}

}