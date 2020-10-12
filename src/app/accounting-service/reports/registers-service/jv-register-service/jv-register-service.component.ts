import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, PrintService } from '@app/_services';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-jv-register-service',
  templateUrl: './jv-register-service.component.html',
  styleUrls: ['./jv-register-service.component.css']
})
export class JvRegisterServiceComponent implements OnInit {

  @ViewChild('paytTypeLov') paytTypeLov : LovComponent;

  dateRadio: string = "1";
  desRadio: string = "1";
  rType: string = "S";
  iCloTag:boolean = true;
  iCanTag:boolean = true;
  tDate: boolean = true;
  pDate: boolean = false;
  tranName: string = "";

  params :any = {
    reportId: 'ACSER060C',
    reportName : 'ACSER060C',
    tranPostDate: 1,
    fromDate:'',
    toDate:'',
    paytType: '',
    paytMode: '',
    reportType: 'S',
    incClosedTran: 'Y',
    incCancelTran: 'Y',
    destination: '',
    chkDate: '',
    jvType: '',
  }

  passDataLov  : any = {
    selector     : ''
  };

  printerList: string[] = [];
  selectedPrinter: string = '';

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

  onClickPrint() {
    this.params.tranPostDate = this.dateRadio;
    this.params.printedBy = this.ns.getCurrentUser();
    this.params.incClosedTran = this.iCloTag ? 'Y' : 'N';
    this.params.incCancelTran = this.iCanTag ? 'Y' : 'N';
    this.params.reportType = this.rType;

    if (this.rType == "S") {
      this.params.reportId = "ACSER060C";
    } else if (this.rType == "D"){
      this.params.reportId = "ACSER060C_DTL";
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
      "acser060Params.chkDate" : this.params.chkDate,
      "acser060Params.jvType" : this.params.jvType,
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

  showLov(fromUser){
    console.log(fromUser);

    if(fromUser == 'acseTranType'){
      this.passDataLov.selector = 'acseTranType';
      this.passDataLov.from = 'acse';
      this.passDataLov.params = {
        tranClass: 'JV',
        baeTag: 'N',
        autoTag: 'N'
      }
      this.paytTypeLov.openLOV();
    }
  }

  changePaytType(event){
    this.ns.lovLoader(event, 1);
    this.passDataLov.selector = 'acseTranType';
    this.passDataLov.from = 'acse';
    this.passDataLov.params = {
      tranClass: 'JV',
      tranTypeCd: this.params.jvType
    }
    this.paytTypeLov.checkCode('acseTranType',null,null,null,null,null,event);
  }

  setData(data,from){
    setTimeout(() => {
      this.ns.lovLoader(data.ev, 0);
    },0);

    console.log(data.data);

    if(from == 'acseTranType'){
      this.params.jvType   = data.data.tranTypeCd;
      this.tranName = data.data.tranTypeName;
    }

  }

  getExtractToCsv(){
    console.log('extract to csv from trial balance processing');
    this.ms.getExtractToCsv(this.ns.getCurrentUser(),this.params.reportId,null,'','','',this.params.paytMode,this.params.paytType,this.params.fromDate,this.params.toDate,
                            this.params.incClosedTran,this.params.incCancelTran,this.params.tranPostDate,this.params.chkDate)
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

        if(this.params.reportId == 'ACSER060C'){
          this.passDataCsv = data['listAcser060c'];
          query = 'SELECT printedBy as [PRINTED BY], period AS [PERIOD], checkNullNo(glAcctId) as [ACCOUNT ID],isNull(shortCode) as [ACCOUNT CODE],'+
          'isNull(shortDesc) as [ACCOUNT DESCRIPTION], negFmt(currency(debitAmt)) as [DEBIT], negFmt(currency(creditAmt)) as [CREDIT]';
        }

        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);

      });
    }

}
