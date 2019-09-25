import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ORPreVATDetails , ORPreCreditableWTaxDetails } from '@app/_models';

@Component({
  selector: 'app-jv-preview-tax-details',
  templateUrl: './jv-preview-tax-details.component.html',
  styleUrls: ['./jv-preview-tax-details.component.css']
})
export class JvPreviewTaxDetailsComponent implements OnInit {
  
     passData: any = {
      tableData: [],
      tHeader: ['#', 'Gen Type', 'Tax Code', 'Description', 'BIR RLF Purchase Type', 'Tax Rate', 'Payor', 'Base Amount', 'Tax Amount'],
      //tHeader: ['VAT Type', 'BIR RLF Purchase Type', 'Payor', 'Base Amount', 'VAT Amount'],
      dataTypes: ['number', 'text', 'text', 'text', 'text', 'percent', 'text', 'currency', 'currency'],
      //opts: [{ selector: "vatType", vals: ["Output", "Input"] }],
  	  nData: {},//new ORPreVATDetails(null,null,null,null,null),
      pageID: 3,
      addFlag: true,
      deleteFlag: true,
      //total: [null, null, null, 'Total', 'vatAmount'],
      pageLength:5,
      genericBtn: 'Save',
      //widths: [150,250,'auto',150,150,],
      paginateFlag:true,
      infoFlag:true
    }

    passDataCreditable: any = {
     tableData: [],
     tHeader: ['#', 'Gen Type', 'BIR Tax Code', 'Description', 'WTax Rate', 'Payor', 'Base Amount', 'Tax Amount'],
      //tHeader: ['BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
     dataTypes: ['number', 'text', 'text', 'text', 'percent','text', 'currency', 'currency'],
     nData: {}, //new ORPreCreditableWTaxDetails(null,null,null,null,null,null),
     pageID: 4,
     addFlag: true,
     deleteFlag: true,
     pageLength:5,
     //total: [null, null, null, null,'Total', 'wTaxAmount'],
     widths: [130,200,150,'auto',150,150,],
     genericBtn: 'Save',
     paginateFlag:true,
     infoFlag:true
    }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passData.tableData = this.accountingService.getORPrevTaxDetails();
  	this.passDataCreditable.tableData = this.accountingService.getORPrevCredWTaxDetails();
  }

     

}
