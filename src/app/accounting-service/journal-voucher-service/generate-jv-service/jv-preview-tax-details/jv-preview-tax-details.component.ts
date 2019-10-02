import { Component, OnInit, Input } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { ORPreVATDetails , ORPreCreditableWTaxDetails } from '@app/_models';

@Component({
  selector: 'app-jv-preview-tax-details',
  templateUrl: './jv-preview-tax-details.component.html',
  styleUrls: ['./jv-preview-tax-details.component.css']
})
export class JvPreviewTaxDetailsComponent implements OnInit {
     @Input() jvDetail:any;

      passData: any = {
       tableData: [],
       tHeader: ['#', 'Gen Type', 'Tax Code', 'Description', 'BIR RLF Purchase Type', 'Tax Rate', 'Payor', 'Base Amount', 'Tax Amount'],
       dataTypes: ['number', 'text', 'text', 'text', 'text', 'percent', 'text', 'currency', 'currency'],
       //opts: [{ selector: "vatType", vals: ["Output", "Input"] }],
       nData: {
               tranId: '',
               taxType: 'G',
               taxSeqNo: '',
               taxCd: '',
               genType: 'M',
               taxName: '',
               purchaseType: '',
               taxRate: '',
               payor: '',
               baseAmt: 0,
               taxAmt: 0,
               createUser: '',
               createDate: '',
               updateUser: '',
               updateDate: ''
       },
       keys: ['taxSeqNo', 'genType', 'taxCd', 'taxName', 'purchaseType', 'taxRate', 'payor', 'baseAmt', 'taxAmt'],
       pageID: 'genTax',
       addFlag: true,
       deleteFlag: true,
       total: [null,null,null,null, null, null, 'Total', 'baseAmt', 'taxAmt'],
       pageLength:5,
       widths: [1,1,50,150,'auto',100,200,150,150],
       paginateFlag:true,
       infoFlag:true,
       checkFlag: true
     };

     passDataCreditable: any = {
      tableData: [],
       tHeader: ['#', 'Gen Type', 'BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
       dataTypes: ['text', 'text', 'text', 'text', 'percent','text', 'currency', 'currency'],
       nData: {
               tranId: '',
               taxType: 'W',
               taxSeqNo: '',
               taxCd: '',
               genType: 'M',
               taxName: '',
               purchaseType: '',
               taxRate: '',
               payor: '',
               baseAmt: 0,
               taxAmt: 0,
               createUser: '',
               createDate: '',
               updateUser: '',
               updateDate: ''
       },
       keys: ['taxSeqNo', 'genType', 'taxCd', 'taxName', 'taxRate', 'payor', 'baseAmt', 'taxAmt'],
       pageID: 'whTax',
       addFlag: true,
       deleteFlag: true,
       pageLength:5,
       total: [null,null,null,null, null, 'Total', 'baseAmt', 'taxAmt'],
       widths: [1,1,50,200,100,200,150,150],
       paginateFlag:true,
       infoFlag:true,
       checkFlag: true
     };

    jvDetails : any = {
     jvNo: '', 
     jvYear: '', 
     jvDate: '', 
     jvType: '',
     jvStatus: '',
     refnoDate: '',
     refnoTranId: '',
     currCd: '',
     currRate: '',
     jvAmt: '',
     localAmt: ''
  };

  constructor(private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
  	this.retrieveJVDetails();
  }

  retrieveJVDetails(){
    this.jvDetails = this.jvDetail;
    this.jvDetails.jvDate = this.ns.toDateTimeString(this.jvDetails.jvDate);
    this.jvDetails.refnoDate = this.jvDetails.refnoDate === "" ? "":this.ns.toDateTimeString(this.jvDetails.refnoDate);
  }
     

}
