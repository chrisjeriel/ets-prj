import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-currency',
  templateUrl: './mtn-currency.component.html',
  styleUrls: ['./mtn-currency.component.css']
})
export class MtnCurrencyComponent implements OnInit {

  selected: any;

  currencyListing: any = {
    tableData: [],
    tHeader: ['Currency Code', 'Currency Abbreviation', 'Currency Word', 'Currency Rate', 'Currency Description',],
    dataTypes: ['text', 'text', 'text', 'percent', 'text',],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
    	'currencyCd',
    	'currencyAbbr',
    	'currencyWord',
    	'currencyRt',
    	'currencyDesc',]
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.maintenanceService.getMtnCurrency().subscribe((data: any) =>{
  		for(var currencyCount = 0; currencyCount < data.currency.length; currencyCount++){
  			this.currencyListing.tableData.push(
  				new Row(data.currency[currencyCount].currencyCd, 
  						data.currency[currencyCount].currencyAbbr,
  						data.currency[currencyCount].currencyWord,
  						data.currency[currencyCount].currencyRt,
  						data.currency[currencyCount].currencyDesc)
  			);  		
  		}
  		this.table.refreshTable();
  	});
  }

  onRowClick(data){
  	//console.log(data);
  	this.selected = data;
  }

  confirm(){
  	this.selectedData.emit(this.selected);
  }

}

class Row{
	currencyCd: string;
	currencyAbbr: string;
	currencyWord: string;
	currencyRt: number;
	currencyDesc: string;

	constructor(currencyCd: string, 
				currencyAbbr: string,
				currencyWord: string,
				currencyRt: number,
				currencyDesc: string){
		this.currencyCd = currencyCd;
		this.currencyAbbr = currencyAbbr;
		this.currencyWord = currencyWord;
		this.currencyRt = currencyRt;
		this.currencyDesc = currencyDesc;
	}
}
