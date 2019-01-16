import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARDetails, AccountingEntries, CVListing, CheckDetails } from '@app/_models';

@Injectable({
	providedIn: 'root'
})
export class AccountingService {

	arDetails: ARDetails[]=[];
	accountingEntries:  AccountingEntries[]=[];
	cvListing: CVListing[]=[];
	checkDetails:  CheckDetails[]=[];

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
			new CVListing(new Date(2016,1,1),"00000001","SM Prime Holdings, Inc",new Date(),"Printed","Check for SM Prime Holdings Inc",1642857.14),
			new CVListing(new Date(),"00000001","Rustans, Inc",new Date(),"Printed","Check for Rustans Inc",200000),
			new CVListing(new Date(),"00000001","San Miguel Corp",new Date(),"Printed","Check for San Miguel Corp",100000),
			new CVListing(new Date(),"00000001","DMCI",new Date(),"Printed","Check for DMCI",1000000),
			new CVListing(new Date(),"00000001","ABS-CBN",new Date(),"Printed","Check for ABS-CBN",710716.12),
			new CVListing(new Date(),"00000001","SMDC",new Date(),"Certified","Check for SMDC",756929),
			new CVListing(new Date(),"00000001","Universal Robina, Inc",new Date(),"Approved","Check for Universal Robina, Inc",300000),
			new CVListing(new Date(),"00000001","SGV & Co",new Date(),"Approved","Check for SGV & Co",1000000),
			new CVListing(new Date(),"00000001","Accenture",new Date(),"New","Check for Accenture",230000),
			new CVListing(new Date(),"00000001","NSO",new Date(),"New","Check for NSO",1500000),
		]

		return this.cvListing;
	}

	getCheckDetails(){
		this.checkDetails = [
			new CheckDetails("Banco De Oro","PCPA-9091-7001-7389",new Date(),1794832,"Local Clearing","PHP",27513.29),
		]

		return this.checkDetails;
	}
}