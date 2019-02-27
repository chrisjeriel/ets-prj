import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ORPreVATDetails , ORPreCreditableWTaxDetails } from '@app/_models';

@Component({
  selector: 'app-jv-preview-tax-details',
  templateUrl: './jv-preview-tax-details.component.html',
  styleUrls: ['./jv-preview-tax-details.component.css']
})
export class JvPreviewTaxDetailsComponent implements OnInit {
  
     passDataAccountingVATTaxDetails: any = {
      tableData: [],
      tHeader: ['VAT Type', 'BIR RLF Purchase Type', 'Payor', 'Base Amount', 'VAT Amount'],
      dataTypes: ['text', 'text', 'text', 'currency', 'currency'],
      //opts: [{ selector: "vatType", vals: ["Output", "Input"] }],
  	  nData: new ORPreVATDetails(null,null,null,null,null),
      pageID: 3,
      addFlag: true,
      deleteFlag: true,
      total: [null, null, null, 'Total', 'vatAmount'],
      pageLength:5,
      genericBtn: 'Save',
      widths: [150,250,'auto',150,150,],
      paginateFlag:true,
      infoFlag:true
    }

    passDataAccountingCreditableTaxDetails: any = {
     tableData: [],
      tHeader: ['BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
      dataTypes: ['text', 'text', 'percent','text', 'currency', 'currency'],
      // opts:[
      //   {
      //     selector: 'birTaxCode',
      //     vals: ['WC002', 'WC010', 'WC020'],
      //   }
      // ],
      nData: new ORPreCreditableWTaxDetails(null,null,null,null,null,null),
      pageID: 4,
      addFlag: true,
      deleteFlag: true,
      pageLength:5,
      total: [null, null, null, null,'Total', 'wTaxAmount'],
      widths: [130,200,150,'auto',150,150,],
      genericBtn: 'Save',
      paginateFlag:true,
      infoFlag:true
    }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passDataAccountingVATTaxDetails.tableData = this.accountingService.getORPrevTaxDetails();
  	this.passDataAccountingCreditableTaxDetails.tableData = this.accountingService.getORPrevCredWTaxDetails();
  }

     

}
