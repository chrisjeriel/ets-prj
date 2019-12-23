import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, PrintService } from '@app/_services';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-ar-register',
  templateUrl: './ar-register.component.html',
  styleUrls: ['./ar-register.component.css']
})
export class ArRegisterComponent implements OnInit {

  @ViewChild('paytTypeLov') paytTypeLov : LovComponent;
  @ViewChild(SucessDialogComponent) successDiag : SucessDialogComponent;

  dateRadio: string = "1";
  desRadio: string = "1";
  selPaytType: string = "ALL PAYMENT TYPES";
  selPaytMode: string = "ALL PAYMENT MODES";
  tranTypeList: any = [];
  rType: string = "S";
  iCloTag:boolean = true;
  iCanTag:boolean = true;

  params :any = {
  	reportId: 'ACITR061A',
  	reportName : 'ACITR061A',
  	tranPostDate: 1,
    fromDate:'',
    toDate:'',
    paytType: '',
    paytMode: '',
    reportType: 'S',
    incClosedTran: 'Y',
    incCancelTran: 'Y',
    destination: ''
  }

  passDataLov  : any = {
    selector     : '',
    payeeClassCd : ''
  };

  printerList: string[] = [];
  selectedPrinter: string = '';
  dialogIcon: string = '';
  dialogMessage: string = '';
  from: string = '';

  constructor(private ms: MaintenanceService, private ns: NotesService, private printService: PrintService) { }

  ngOnInit() {
     this.getPrinters();
  }

  getPrinters(){
    this.printService.getPrinters().subscribe(
      (data:any)=>{
        if(data.length != 0){
          this.printerList = data;
        }
      }
    );
  }

  showLov(fromUser){
    console.log(fromUser);

    if(fromUser == 'acitTranType'){
      this.passDataLov.selector = 'acitTranType';
      this.passDataLov.from = 'acit';
      this.passDataLov.params = {
        tranClass: 'AR'
      }
      this.paytTypeLov.openLOV();
    }else{
      this.passDataLov.selector = 'acctPaytMode';
      this.passDataLov.from = 'acit';
      this.paytTypeLov.openLOV();
    }
  }

  changePaytType(event){
    this.ns.lovLoader(event, 1);
    this.passDataLov.selector = 'acitTranType';
    this.passDataLov.from = 'acit';
    this.from = 'paytType';
    this.passDataLov.params = {
      tranClass: 'AR',
      tranTypeCd: this.params.paytType
    }
    this.paytTypeLov.checkCode('acitTranType',null,null,null,null,null,event);
  }

  changePaytMode(event){
    this.ns.lovLoader(event, 1);
    this.passDataLov.selector = 'acctPaytMode';
    this.from = 'paytMode';
    this.passDataLov.paytMode = this.params.paytMode;
    this.paytTypeLov.checkCode('acctPaytMode',null,null,null,null,null,event);
  }

  setData(data,from){
    setTimeout(() => {
      this.ns.lovLoader(data.ev, 0);
    },0);

    console.log(data.data);

    if(data.data == null){
      if(this.from == 'paytType'){
        this.selPaytType = '';
        this.params.paytType = '';
      }else if(this.from == 'paytMode'){
        this.selPaytMode = '';
        this.params.paytMode = '';
      }
    }else{
      if(this.from == 'paytType'){
        this.selPaytType   = data.data.tranTypeName;
        this.params.paytType = data.data.tranTypeCd;
      }else if(this.from == 'paytMode'){
        this.selPaytMode   = data.data.paytModeName;
        this.params.paytMode = data.data.paytMode;
      }
    }

  }


  onClickPrint() {
    if(this.checkDateRange()){
      this.dialogIcon = 'info';
      this.dialogMessage = 'Please fill in the date range.';
      this.successDiag.open();
    }else if(this.checkPrinter()){
      this.dialogIcon = 'info';
      this.dialogMessage = 'Please select a printer.';
      this.successDiag.open();
    }else if(this.checkDestination()){
      this.dialogIcon = 'info';
      this.dialogMessage = 'Please select a destination.';
      this.successDiag.open();
    }
    else{
      this.params.tranPostDate = this.dateRadio;
      this.params.printedBy = this.ns.getCurrentUser();
      this.params.incClosedTran = this.iCloTag ? 'Y' : 'N';
      this.params.incCancelTran = this.iCanTag ? 'Y' : 'N';
      this.params.reportType = this.rType;

      if (this.rType == "S") {
        this.params.reportId = "ACITR061A";
      } else if (this.rType == "D"){
        this.params.reportId = "ACITR061A_DTL";
      }

      let params :any = {
        "reportId" : this.params.reportId,
        "acitr061Params.reportId" : this.params.reportId,
        "acitr061Params.reportName" : this.params.reportName,
        "acitr061Params.tranPostDate" : this.params.tranPostDate, 
        "acitr061Params.fromDate" : this.params.fromDate, 
        "acitr061Params.toDate" : this.params.toDate, 
        "acitr061Params.paytType" : this.params.paytType, 
        "acitr061Params.paytMode" : this.params.paytMode, 
        "acitr061Params.reportType" : this.params.reportType, 
        "acitr061Params.incClosedTran" : this.params.incClosedTran, 
        "acitr061Params.incCancelTran" : this.params.incCancelTran, 
        "acitr061Params.destination" : this.params.destination, 
        "acitr061Params.printedBy" : this.params.printedBy,
        "printerName": this.selectedPrinter,
        "pageOrientation": 'PORTRAIT',
        "paperSize": 'LEGAL'
      }

      console.log(params);

      if(this.params.destination.toUpperCase() == 'SCREEN'){
        this.printService.print(this.params.destination,this.params.reportId, params);
      }else{
        this.printService.directPrint(params).subscribe(
          (data:any)=>{
            console.log(data);
            if(data.errorList.length == 0 && data.messageList.length != 0){
              /*if(isReprint == undefined){
                this.successPrintMdl.openNoClose();
                
              }else{
                this.reprintMdl.closeModal();  
                 this.printLoading = false;
              }*/
            }else{
              console.log('error');
            }
          }
        );
      }
    }
  }

  //VALIDATIONS STARTS HERE
  checkDateRange(){
    if(this.params.fromDate == null || this.params.fromDate.length == 0 ||
       this.params.toDate == null || this.params.toDate.length == 0){
      return true;
    }
    return false;
  }

  checkDestination(){
    if(this.params.destination == null || this.params.destination.length == 0){
      return true;
    }
    return false;
  }

  checkPrinter(){
    if(this.params.destination.toUpperCase() == 'PRINTER' && (this.selectedPrinter == null || this.selectedPrinter.length == 0)){
      return true;
    }
    return false;
  }

}
