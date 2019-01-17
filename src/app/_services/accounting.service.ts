import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARDetails, AccountingEntries, CVListing, AmountDetailsCV, AccountingEntriesCV, QSOA, AttachmentInfo } from '@app/_models';

@Injectable({
	providedIn: 'root'
})
export class AccountingService {

	arDetails: ARDetails[]=[];
	accountingEntries:  AccountingEntries[]=[];
	cvListing: CVListing[]=[];
	amountDetailsCVData: AmountDetailsCV[] = [];
	accountingEntriesCVData: AccountingEntriesCV[] = []; 
	qsoaData: QSOA[] = [];
	attachmentInfo: AttachmentInfo[] = [];

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
			new CVListing(null,null,null,null,null,null,null),
			new CVListing(null,null,null,null,null,null,null),
			new CVListing(null,null,null,null,null,null,null),
			new CVListing(null,null,null,null,null,null,null),
		]

		return this.cvListing;
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
}