import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARDetails, AccountingEntries, CVListing } from '@app/_models';

@Injectable({
	providedIn: 'root'
})
export class AccountingService {

	arDetails: ARDetails[]=[];
	accountingEntries:  AccountingEntries[]=[];
	cvListing: CVListing[]=[];

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
}