import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { ORPreVATDetails , ORPreCreditableWTaxDetails } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-jv-preview-tax-details',
  templateUrl: './jv-preview-tax-details.component.html',
  styleUrls: ['./jv-preview-tax-details.component.css']
})
export class JvPreviewTaxDetailsComponent implements OnInit {
     @Input() jvDetail:any;
     @ViewChild('genTable') genTable: CustEditableNonDatatableComponent;
     @ViewChild('wthTable') wthTable: CustEditableNonDatatableComponent;
     @ViewChild('genlovMdl') genlovMdl: LovComponent;
     @ViewChild('wthlovMdl') wthlovMdl: LovComponent;
     @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
     @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

      passData: any = {
       tableData: [],
       tHeader: ['#', 'Gen Type', 'Tax Code', 'Description', 'BIR RLF Purchase Type', 'Tax Rate', 'Payor', 'Base Amount', 'Tax Amount'],
       dataTypes: ['number', 'text', 'text', 'text', 'text', 'percent', 'text', 'currency', 'currency'],
       //opts: [{ selector: "vatType", vals: ["Output", "Input"] }],
       nData: {
               showMG:1,
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
               createUser: this.ns.getCurrentUser(),
               createDate: '',
               updateUser: this.ns.getCurrentUser(),
               updateDate: ''
       },
       magnifyingGlass: ['taxCd'],
       keys: ['taxSeqno', 'genType', 'taxCd', 'genTaxDesc', 'genBirRlf', 'genTaxRate', 'payor', 'baseAmt', 'taxAmt'],
       pageID: 'genTax',
       addFlag: true,
       deleteFlag: true,
       uneditable:[true,true,true,true,true,true,false,false,false],
       total: [null,null,null,null, null, null, 'Total', 'baseAmt', 'taxAmt'],
       pageLength:5,
       widths: [1,1,50,150,'auto',100,200,150,150],
       paginateFlag:true,
       infoFlag:true,
       checkFlag: true
     };

     passDataWHT: any = {
      tableData: [],
       tHeader: ['#', 'Gen Type', 'BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
       dataTypes: ['text', 'text', 'text', 'text', 'percent','text', 'currency', 'currency'],
       nData: {
               showMG:1,
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
               createUser: this.ns.getCurrentUser(),
               createDate: '',
               updateUser: this.ns.getCurrentUser(),
               updateDate: ''
       },
       magnifyingGlass: ['taxCd'],
       uneditable:[true,true,true,true,true,false,false,false],
       keys: ['taxSeqno', 'genType', 'taxCd', 'whtTaxDesc', 'whtRate', 'payor', 'baseAmt', 'taxAmt'],
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

  passLov: any = {
    selector: 'mtnGenTax',
    taxCd: '',
    taxName:'',
    chargeType : '',
    fixedTag:'',
    activeTag:'',
    hide: []
  }

  passLovWTH: any = {
    selector: 'mtnWhTax',
    taxCd: '',
    taxName:'',
    taxType:'',
    creditableTag:'',
    fixedTag:'',
    activeTag:'',
    hide: []
  }

  taxDetailsParams : any = {
    saveTaxDtl: []
  }

  forkSub: any;
  dialogIcon : any;
  dialogMessage : any;
  cancelFlag: boolean = false;

  constructor(private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.jvDetails = this.jvDetail;
    this.jvDetails.jvDate = this.ns.toDateTimeString(this.jvDetails.jvDate);
    this.jvDetails.refnoDate = this.jvDetails.refnoDate === "" ? "":this.ns.toDateTimeString(this.jvDetails.refnoDate);
  	this.retrieveJVDetails();
  }

  retrieveJVDetails(){
    var join = forkJoin(this.accountingService.acseTaxDetails(this.jvDetails.tranId,'G'),
                        this.accountingService.acseTaxDetails(this.jvDetails.tranId,'W')).pipe(map(([genTax, whTax]) => {return {genTax, whTax}; }));

    this.forkSub = join.subscribe((data: any) =>{
      this.passData.tableData = [];
      this.passData.tableData = data.genTax.taxDetails;
      this.passDataWHT.tableData = [];
      this.passDataWHT.tableData = data.whTax.taxDetails;
      this.genTable.refreshTable();
      this.wthTable.refreshTable();
    });
  }
     
  setGenTax(data){
    console.log(data.data);
    this.passData.tableData = this.passData.tableData.filter((a) => a.showMG != 1);
    for (var i = 0; i < data.data.length; i++) {
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].taxCd = data.data[i].taxCd;
      this.passData.tableData[this.passData.tableData.length - 1].genTaxDesc = data.data[i].taxName;
      this.passData.tableData[this.passData.tableData.length - 1].baseAmt = data.data[i].amount == null? 0:data.data[i].amount;
    }
    this.genTable.refreshTable();
  }

  setWHTax(data){
    this.passDataWHT.tableData = this.passDataWHT.tableData.filter((a) => a.showMG != 1);
    for (var i = 0; i < data.data.length; i++) {
      this.passDataWHT.tableData.push(JSON.parse(JSON.stringify(this.passDataWHT.nData)));
      this.passDataWHT.tableData[this.passDataWHT.tableData.length - 1].showMG = 0;
      this.passDataWHT.tableData[this.passDataWHT.tableData.length - 1].taxCd = data.data[i].taxCd;
      this.passDataWHT.tableData[this.passDataWHT.tableData.length - 1].whtTaxDesc = data.data[i].taxName;
      this.passDataWHT.tableData[this.passDataWHT.tableData.length - 1].baseAmt = data.data[i].amount == null? 0:data.data[i].amount;
    }
    this.wthTable.refreshTable();
  }

  openLOV(data){
    this.genlovMdl.openLOV();
  }

  openWHT(data){
    this.wthlovMdl.openLOV();
  }

  onClickSave(){
    $('#SaveTax #confirm-save #modalBtn2').trigger('click');
  }

  prepareData(){
    this.taxDetailsParams.saveTaxDtl = [];

    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.taxDetailsParams.saveTaxDtl.push(this.passData.tableData[i]);
        this.taxDetailsParams.saveTaxDtl[this.taxDetailsParams.saveTaxDtl.length - 1].tranId = this.jvDetails.tranId;
        this.taxDetailsParams.saveTaxDtl[this.taxDetailsParams.saveTaxDtl.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
        this.taxDetailsParams.saveTaxDtl[this.taxDetailsParams.saveTaxDtl.length - 1].updateDate = this.ns.toDateTimeString(0);
      }
    }

    for (var j = 0; j < this.passDataWHT.tableData.length; j++) {
      if(this.passDataWHT.tableData[j].edited && !this.passDataWHT.tableData[j].deleted){
        this.taxDetailsParams.saveTaxDtl.push(this.passDataWHT.tableData[j]);
        this.taxDetailsParams.saveTaxDtl[this.taxDetailsParams.saveTaxDtl.length - 1].tranId = this.jvDetails.tranId;
        this.taxDetailsParams.saveTaxDtl[this.taxDetailsParams.saveTaxDtl.length - 1].createDate = this.ns.toDateTimeString(this.passDataWHT.tableData[j].createDate);
        this.taxDetailsParams.saveTaxDtl[this.taxDetailsParams.saveTaxDtl.length - 1].updateDate = this.ns.toDateTimeString(0);
      }
    }
  }

  saveTaxDtl(cancel?){
    this.cancelFlag = cancel !== undefined;
    this.prepareData();

    this.accountingService.saveAcseTaxDetails(this.taxDetailsParams).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveJVDetails();
      }
    });
  }

  cancel(){
    this.prepareData();
    console.log(this.taxDetailsParams)
    //this.cancelBtn.clickCancel();
  }
}
