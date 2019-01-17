import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARDetails, AccountingEntries, CVListing, AmountDetailsCV, AccountingEntriesCV, QSOA, AttachmentInfo, CheckDetails, VATDetails, CreditableTax, JVListing} from '@app/_models';

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
	jvListing: JVListing[]=[];
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
			new CheckDetails("Banco De Oro","PCPA-9091-7001-7389",new Date(),17948303,"Local Clearing","PHP",27513.29),
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
			new QSOA("Q Ending",1341234,3424,42342,141),
			new QSOA("Q Ending",1341234,3424,35223,1231345),
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
}