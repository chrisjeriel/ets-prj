import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, PrintService } from '@app/_services';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-cr-register',
  templateUrl: './cr-register.component.html',
  styleUrls: ['./cr-register.component.css']
})
export class CrRegisterComponent implements OnInit {

  @ViewChild('paytTypeLov') paytTypeLov : LovComponent;

  dateRadio: string = "1";
  desRadio: string = "1";
  selPaytType: string = "ALL PAYMENT TYPES";
  selPaytMode: string = "ALL PAYMENT MODES";
  tranTypeList: any = [];
  rType: string = "S";
  iCloTag:boolean = true;
  iCanTag:boolean = true;

  params :any = {
  	reportId: 'ACSER060A',
  	reportName : 'ACSER060A',
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
  from: string = '';

  passDataCsv: any[] = [];

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

    if(fromUser == 'acseTranType'){
      this.passDataLov.selector = 'acseTranType';
      this.passDataLov.from = 'acse';
      this.passDataLov.params = {
        tranClass: 'OR'
      }
      this.paytTypeLov.openLOV();
    }else{
      this.passDataLov.selector = 'acctPaytMode';
      this.passDataLov.from = 'acse';
      this.paytTypeLov.openLOV();
    }
  }

  changePaytType(event){
    this.ns.lovLoader(event, 1);
    this.passDataLov.selector = 'acseTranType';
    this.passDataLov.from = 'acse';
    this.from = 'paytType';
    this.passDataLov.params = {
      tranClass: 'OR',
      tranTypeCd: this.params.paytType
    }
    this.paytTypeLov.checkCode('acseTranType',null,null,null,null,null,event);
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

    /*if(from == 'acseTranType'){
      this.selPaytType   = data.data.tranTypeName;
      this.params.paytType = data.data.tranTypeCd;
    }*/

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
    this.params.tranPostDate = this.dateRadio;
    this.params.printedBy = this.ns.getCurrentUser();
    this.params.incClosedTran = this.iCloTag ? 'Y' : 'N';
    this.params.incCancelTran = this.iCanTag ? 'Y' : 'N';
    this.params.reportType = this.rType;

    if (this.rType == "S") {
      this.params.reportId = "ACSER060A";
    } else if (this.rType == "D"){
      this.params.reportId = "ACSER060A_DTL";
    }

    if(this.params.destination == 'exl'){
      this.passDataCsv = [];
      this.getExtractToCsv();
      return;
    }

    let params :any = {
      "reportId" : this.params.reportId,
      "acser060Params.reportId" : this.params.reportId,
      "acser060Params.reportName" : this.params.reportName,
      "acser060Params.tranPostDate" : this.params.tranPostDate, 
      "acser060Params.fromDate" : this.params.fromDate, 
      "acser060Params.toDate" : this.params.toDate, 
      "acser060Params.paytType" : this.params.paytType, 
      "acser060Params.paytMode" : this.params.paytMode, 
      "acser060Params.reportType" : this.params.reportType, 
      "acser060Params.incClosedTran" : this.params.incClosedTran, 
      "acser060Params.incCancelTran" : this.params.incCancelTran, 
      "acser060Params.destination" : this.params.destination, 
      "acser060Params.printedBy" : this.params.printedBy,
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

  getExtractToCsv(){
    console.log('extract to csv from trial balance processing');
    this.ms.getExtractToCsv(this.ns.getCurrentUser(),this.params.reportId,null,'','','',this.params.paytMode,this.params.paytType,this.params.fromDate,this.params.toDate,
                            this.params.incClosedTran,this.params.incCancelTran,this.params.tranPostDate)
      .subscribe(data => {
        console.log(data);
    
        var months = new Array("Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
        "Oct", "Nov", "Dec");

        alasql.fn.myFormat = function(d){
          if(d == null){
            return '';
          }
          var date = new Date(d);
          var day = (date.getDate()<10)?"0"+date.getDate():date.getDate();
          var mos = months[date.getMonth()];
          return day+'-'+mos+'-'+date.getFullYear(); 
        };

        alasql.fn.negFmt = function(m){
          return (m==null || m=='') ? 0 : Number(m);
        };

        alasql.fn.isNull = function(n){
          return n==null?'':n;
        };

        alasql.fn.checkNullNo = function(o){
          return (o==null || o=='')?'': Number(o);
        };

        var name = this.params.reportId;
        var query = '';

        if(this.params.reportId == 'ACSER060A'){
          this.passDataCsv = data['listAcser060a'];
          query = 'SELECT printedBy as [PRINTED BY], period AS [PERIOD], checkNullNo(glAcctId) as [ACCOUNT ID],isNull(shortCode) as [ACCOUNT CODE],'+
          'isNull(shortDesc) as [ACCOUNT DESCRIPTION], negFmt(currency(debitAmt)) as [DEBIT], negFmt(currency(creditAmt)) as [CREDIT]';
        }

        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);

      });
    }
}