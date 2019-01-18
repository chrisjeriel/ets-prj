import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARDetails, AccountingEntries, CVListing, AmountDetailsCV, AccountingEntriesCV, QSOA, AttachmentInfo, CheckDetails, VATDetails, CreditableTax, AccountingRequestsListRP } from '@app/_models';

@Injectable({
	providedIn: 'root'
})
export class AccountingService {

	arDetails: ARDetails[]=[];
	accountingEntries:  AccountingEntries[]=[];
	cvListing: CVListing[]=[];
	checkDetails:  CheckDetails[]=[];
	amountDetailsCVData: AmountDetailsCV[] = [];
	accountingEntriesCVData: AccountingEntriesCV[] = []; 
	qsoaData: QSOA[] = [];
	attachmentInfo: AttachmentInfo[] = [];
	vatDetails: VATDetails[]=[];
	creditableTax: CreditableTax[]=[];
	paytRequestListData: AccountingRequestsListRP[] = [];

	constructor(private http: HttpClient) { }

	getAmountDetails(){
		this.arDetails = [
			new ARDetails("Gross Amount",2000000,2000000,"None",0),
			new ARDetails("Vatable Sales",1785714.29,1785714.29,"Add",1785714.29),
			new ARDetails("VAT-Exempt Sales",0,0,"Add",0),
			new ARDetails("VAT Zero-Rated Sales",0,0,"Add",0),
			new ARDetails("VAT (12%)",214285.71,214285.71,"Add",214285.71),
			new ARDetails("Creditable WTax (20%)",357142.86,357142.86,"Minus",357142.86),
		]

		return this.arDetails;
	}

	getAccountingEntries(){
		this.accountingEntries = [
			new AccountingEntries(null,null,null,null,null,null),
			new AccountingEntries(null,null,null,null,null,null),
			new AccountingEntries(null,null,null,null,null,null),
			new AccountingEntries(null,null,null,null,null,null),
		]

		return this.accountingEntries;
	}

	getCVListing(){
		this.cvListing = [
			new CVListing(new Date(2016,1,1),1,"SM Prime Holdings, Inc",new Date(),"Printed","Check for SM Prime Holdings Inc",1642857.14),
			new CVListing(new Date(),1,"Rustans, Inc",new Date(),"Printed","Check for Rustans Inc",200000),
			new CVListing(new Date(),1,"San Miguel Corp",new Date(),"Printed","Check for San Miguel Corp",100000),
			new CVListing(new Date(),1,"DMCI",new Date(),"Printed","Check for DMCI",1000000),
			new CVListing(new Date(),1,"ABS-CBN",new Date(),"Printed","Check for ABS-CBN",710716.12),
			new CVListing(new Date(),1,"SMDC",new Date(),"Certified","Check for SMDC",756929),
			new CVListing(new Date(),1,"Universal Robina, Inc",new Date(),"Approved","Check for Universal Robina, Inc",300000),
			new CVListing(new Date(),1,"SGV & Co",new Date(),"Approved","Check for SGV & Co",1000000),
			new CVListing(new Date(),1,"Accenture",new Date(),"New","Check for Accenture",230000),
			new CVListing(new Date(),1,"NSO",new Date(),"New","Check for NSO",1500000),
		]

		return this.cvListing;
	}

	getCheckDetails(){
		this.checkDetails = [
			new CheckDetails("Banco De Oro","PCPA-9091-7001-7389",new Date(),1794832,"Local Clearing","PHP",27513.29),
		]

		return this.checkDetails;
	}

	getAmountDetailsCV(){
		this.amountDetailsCVData = [
			new AmountDetailsCV('Gross Amount (VAT Inc)', 28013.44, 28013.44, 'None', 0),
			new AmountDetailsCV('Ex-VAT', 25012, 25012, 'Add', 25012),
			new AmountDetailsCV('VAT (12%)', 3001.44, 3001.44, 'Add', 3001.44),
			new AmountDetailsCV('Witholding Tax (2%)', 500.24, 500.24, 'Less', -500.24),
		];
		return this.amountDetailsCVData;
	}

	getAccountingEntriesCV(){
		this.accountingEntriesCVData = [
			new AccountingEntriesCV(null,null,null,null,null,null),
		];
		return this.accountingEntriesCVData;
	}

	getQSOAData(){
		this.qsoaData = [
			new QSOA(new Date(2018,	2,31),500000,100000,6000000,500000,6500000,600000),
			new QSOA(new Date(2018,5,30),500000,700000,500000,800000,1000000,1500000),
		];
		return this.qsoaData;
	}

	getAttachmentInfo(){
		this.attachmentInfo = [
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_01.doc","Accounting Specifications Sample 1"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_02.doc","Accounting Specifications Sample 2"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_03.doc","Accounting Specifications Sample 3"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_04.doc","Accounting Specifications Sample 4"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_05.doc","Accounting Specifications Sample 5"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_06.doc","Accounting Specifications Sample 6"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_07.doc","Accounting Specifications Sample 7"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_08.doc","Accounting Specifications Sample 8"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_09.doc","Accounting Specifications Sample 9"),
			new AttachmentInfo("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\05-Accounting\\Sample_10.doc","Accounting Specifications Sample 10 "),
		]
		return this.attachmentInfo;
	}

	getVATDetails(){
		this.vatDetails = [
			new VATDetails("Output","Services","San Miguel Corporation",25012,3001.44),
		]
		return this.vatDetails;
	}

	getCreditableTax(){
		this.creditableTax = [
			new CreditableTax("WC002","WTax on Investment Income PHP",2,"BPI/MS INSURANCE CORPORATION",25012,500.24),
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
}