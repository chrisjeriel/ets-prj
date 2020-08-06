import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, PrintService, MaintenanceService } from '@app/_services';
import { SucessDialogComponent, ModalComponent } from '@app/_components/common';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';

@Component({
  selector: 'app-acct-trial-bal-extract',
  templateUrl: './acct-trial-bal-extract.component.html',
  styleUrls: ['./acct-trial-bal-extract.component.css']
})
export class AcctTrialBalExtractComponent implements OnInit {
  
  constructor(private titleService: Title, private ns : NotesService, private ps: PrintService, private ms: MaintenanceService) { }



  @Output() accCodeChange : EventEmitter<any> = new EventEmitter();

  params: any = {
      reportId : 'ACSER008',
      reportName : 'ACSER008',
      type : 'T',
      periodFrom : '',
      periodTo : '',
      extractUser : this.ns.getCurrentUser(),
      extractDate : '',
      currCdParam: ''
    }

   loading: Boolean = false;

   modalHeader: string = "";
   modalBody: string = "";
   dialogIcon: string = "";
   dialogMessage: string = "";
   modalMode: string = "";

   passDataCsv : any[] =[];

   @ViewChild('polReportsModal') polReportsModal: ModalComponent;
   @ViewChild('appDialog') appDialog: SucessDialogComponent;

   currencyDesc:String = '';
   @ViewChild(MtnCurrencyCodeComponent) currCdLov: MtnCurrencyCodeComponent;

   rType:any;

   selectedPrinter:any;
   printerList = [];

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Trial Balance");
  }


  onClickExtract(forceExtract?){

    let param:any = JSON.parse(JSON.stringify(this.params));
    param.forceExtract = forceExtract != undefined ? 'Y' : 'N';
    this.loading = true;
    this.ps.extractReport({ reportId: param.reportId, acser008Params:param }).subscribe((data:any)=>{
        this.modalMode = "";
        this.loading = false;
        if (data.errorList.length > 0) {
          
          if (data.errorList[0].errorMessage.includes("parameters already exists.")) {
            this.modalMode = "reExtract";
            this.modalHeader = "Confirmation";
            this.polReportsModal.openNoClose();
          } else {
            this.dialogIcon = 'error';
            this.appDialog.open();
          }
          
        } else {
          if (data.params.extractCount != 0) {
            this.modalHeader = "Extraction Completed";
            this.modalBody = "Successfully extracted " + data.params.extractCount + " record/s.";
            this.polReportsModal.openNoClose();
          } else {
            this.modalHeader = "Extraction Completed";
            this.modalBody = "No record/s extracted.";
            this.polReportsModal.openNoClose();
          }
        }
        console.log(data)
    },
    (err) => {
      alert("Exception when calling services.");
    });
  }

  setCurrency(data){
    if(data != null){
      this.params.currCdParam = data.currencyCd;
      this.currencyDesc = data.description;
    }else{
      this.params.currCdParam = '';
      this.currencyDesc = '';
    }
    this.ns.lovLoader(data.ev, 0);
  }

  showCurrLOV(){
    this.currCdLov.modal.openNoClose();
  }

  checkCode(ev, field){
    this.ns.lovLoader(ev, 1);
    if(field == 'currCd') {
      this.currCdLov.checkCode(this.params.currCdParam, ev);
    }
  }

  onClickPrint(){
    if(this.params.destination == 'exl'){
      this.passDataCsv = [];
      this.getExtractToCsv();
      return;
    }
  }

   getExtractToCsv(){
    console.log(this.params.reportId);
      console.log(this.ns.getCurrentUser() + ' >> current user');
      this.ms.getExtractToCsv(this.ns.getCurrentUser(),'ACSER008')
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
        //if(this.params.reportId == 'ACSER008'){
          this.passDataCsv = data['listAcser008'];
          this.passDataCsv.forEach(a=>{a.extType = a.extType == 'N' ? 'Net' : 'Total Debit & Total Credits'});
          query = 'SELECT checkNullNo(extractId) as [EXTRACT ID],extractUser as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],checkNullNo(glAcctId) as [GL ACCT ID],'+
          'isNull(acctCode) as [ACCT CODE],isNull(acctName) as [ACCT NAME],isNull(currCd) as [CURRENCY],checkNullNo(slTypeCd) as [SL TYPE CD],'+
          'isNull(slTypeName) as [SL TYPE NAME],checkNullNo(slCd) as [SL CD],isNull(slName) as [SL NAME],negFmt(currency(totalCredit)) as [TOTAL CREDIT],'+
          'negFmt(currency(totalDebit)) as [TOTAL DEBIT],myFormat(periodFrom) as [PERIOD FROM],myFormat(periodTo) as [PERIOD TO],isNull(currCdParam) as [CURR CD PARAM],'+
          'isNull(extType) as [EXT TYPE]';
        //}

        console.log(this.passDataCsv);
        this.ns.export('ACSER008', query, this.passDataCsv);
      });
  }

}
