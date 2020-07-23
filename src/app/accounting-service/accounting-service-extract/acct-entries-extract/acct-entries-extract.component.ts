
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, PrintService, MaintenanceService } from '@app/_services';
import { LovComponent, ModalComponent, SucessDialogComponent } from '@app/_components/common';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';

@Component({
  selector: 'app-acct-entries-extract',
  templateUrl: './acct-entries-extract.component.html',
  styleUrls: ['./acct-entries-extract.component.css']
})

export class AcctEntriesExtractComponent implements OnInit {

    postingDateFlag: any = '1';

    constructor(private titleService: Title, private ns: NotesService, private ps: PrintService, private ms: MaintenanceService) { }
    params: any = {
      reportId : 'ACSER007',
      reportName : 'ACSER007',
      entryType : 'A',
      periodType : 'T',
      periodFrom : '',
      periodTo : '',
      acctParam : '',
      slTypeParam : '',
      orTag : true,
      cvTag : true,
      jvTag : true,
      closeTranTag : true,
      appendTag : 'N',
      extractUser : this.ns.getCurrentUser(),
      extractDate : '',
      currCdParam: ''
    }


    slTypeName = "";
    accountNo = "";
    accountDesc = "";
    currencyDesc = "";

    @ViewChild(LovComponent) lov : LovComponent;
    passDataLov  : any = {
    selector     : '',
    payeeClassCd : '',
    params: {},
    lovCheckBox : false
    };

    disableList:any = [];

    printerList:any = [];

    modalHeader: string = "";
    modalBody: string = "";
    dialogIcon: string = "";
    dialogMessage: string = "";
    modalMode: string = "";

    loading: boolean = false;

    passDataCsv : any[] =[];

    @ViewChild('polReportsModal') polReportsModal: ModalComponent;
    @ViewChild('appDialog') appDialog: SucessDialogComponent;

    @ViewChild(MtnCurrencyCodeComponent) currCdLov: MtnCurrencyCodeComponent;

      ngOnInit() {
        this.titleService.setTitle("Acct-Service | Extract Accounting Entries");

        this.ps.getPrinters().subscribe(
          (data:any)=>{
            if(data.length != 0){
              this.printerList = data;
            }
          }
        );
      }

      onClickExtract(forceExtract?){

        let param:any = JSON.parse(JSON.stringify(this.params));
        param.orTag = param.orTag ? 'Y' : 'N';
        param.cvTag = param.cvTag ? 'Y' : 'N';
        param.jvTag = param.jvTag ? 'Y' : 'N';
        param.closeTranTag = param.closeTranTag ? 'Y' : 'N';
        param.forceExtract = forceExtract != undefined ? 'Y' : 'N';
        this.loading = true;
        this.ps.extractReport({ reportId: param.reportId, acser007Params:param }).subscribe((data:any)=>{

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

      showLov(selector){

        if(selector == 'slType'){
          this.passDataLov.selector = 'slType';
          this.passDataLov.from = 'acit';
          this.lov.openLOV();
        }else if(selector == 'acitChartAcct'){
          this.passDataLov.selector = 'acitChartAcct';
          this.passDataLov.from = 'acit';
          this.lov.openLOV();
        }
      }

      setData(data){
        if(data.selector == 'slType' ){
          if(data.data != null){
            this.params.slTypeParam = data.data.slTypeCd;
            this.slTypeName = data.data.slTypeName;
          }else{
            this.params.slTypeParam = '';
            this.slTypeName = '';
          }
        }else if (data.selector == "acitChartAcct"){
          if(data.data != null){
            this.params.acctParam = data.data.glAcctId;
            this.accountNo = data.data.shortCode;
            this.accountDesc = data.data.shortDesc;
          }else{
            this.params.acctParam ='';
            this.accountNo ='';
            this.accountDesc ='';
          }
        }
        
        this.ns.lovLoader(data.ev, 0);
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
         if(field == 'slType'){
            this.lov.checkCode('slType',null,null,null,null,null,ev,this.params.slTypeParam)
         }
         else if(field == 'currCd') {
          this.currCdLov.checkCode(this.params.currCdParam, ev);
        }
      }

      onChangeEntryType(){
        if(this.params.entryType == 'A'){
          this.disableList = [];
        }else if(this.params.entryType == 'U'){
          this.params.periodType = 'T';
          this.params.acctParam = '';
          this.params.slTypeParam = '';
          this.slTypeName = '';
          this.params.closeTranTag = false;
          this.accountNo ='';
          this.accountDesc ='';
          this.disableList = ['accountNo','slTypeParam','closeTranTag'];
        }
      }

      onChangePeriodType(){
        if(this.params.periodType == 'P'){
          this.params.closeTranTag = true;
        }
      }

      checkDateRange(){
        if(this.params.periodFrom == null || this.params.periodFrom.length == 0 ||
           this.params.periodTo == null || this.params.periodTo.length == 0){
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

      selectedPrinter:any = null;

      checkPrinter(){
        if(this.params.destination.toUpperCase() == 'PRINTER' && (this.selectedPrinter == null || this.selectedPrinter.length == 0)){
          return true;
        }
        return false;
      }

      onClickPrint() {
        if(this.checkDateRange()){
          this.dialogIcon = 'info';
          this.dialogMessage = 'Please fill in the date range.';
          this.appDialog.open();
        }else if(this.checkPrinter()){
          this.dialogIcon = 'info';
          this.dialogMessage = 'Please select a printer.';
          this.appDialog.open();
        }else if(this.checkDestination()){
          this.dialogIcon = 'info';
          this.dialogMessage = 'Please select a destination.';
          this.appDialog.open();
        }

          if(this.params.destination == 'exl'){
            this.passDataCsv = [];
            this.getExtractToCsv();
            return;
          }


        // else{
        //   this.params.tranPostDate = this.dateRadio;
        //   this.params.printedBy = this.ns.getCurrentUser();
        //   this.params.incClosedTran = this.iCloTag ? 'Y' : 'N';
        //   this.params.incCancelTran = this.iCanTag ? 'Y' : 'N';
        //   this.params.reportType = this.rType;

        //   if (this.rType == "S") {
        //     this.params.reportId = "ACITR061A";
        //   } else if (this.rType == "D"){
        //     this.params.reportId = "ACITR061A_DTL";
        //   }

        //   if(this.params.destination == 'exl'){
        //     this.passDataCsv = [];
        //     this.getExtractToCsv();
        //     return;
        //   }

        //   let params :any = {
        //     "reportId" : this.params.reportId,
        //     "acitr061Params.reportId" : this.params.reportId,
        //     "acitr061Params.reportName" : this.params.reportName,
        //     "acitr061Params.tranPostDate" : this.params.tranPostDate, 
        //     "acitr061Params.fromDate" : this.params.fromDate, 
        //     "acitr061Params.toDate" : this.params.toDate, 
        //     "acitr061Params.paytType" : this.params.paytType, 
        //     "acitr061Params.paytMode" : this.params.paytMode, 
        //     "acitr061Params.reportType" : this.params.reportType, 
        //     "acitr061Params.incClosedTran" : this.params.incClosedTran, 
        //     "acitr061Params.incCancelTran" : this.params.incCancelTran, 
        //     "acitr061Params.destination" : this.params.destination, 
        //     "acitr061Params.printedBy" : this.params.printedBy,
        //     "printerName": this.selectedPrinter,
        //     "pageOrientation": 'PORTRAIT',
        //     "paperSize": 'LEGAL'
        //   }

        //   console.log(params);

        //   if(this.params.destination.toUpperCase() == 'SCREEN'){
        //     this.printService.print(this.params.destination,this.params.reportId, params);
        //   }else{
        //     this.printService.directPrint(params).subscribe(
        //       (data:any)=>{
        //         console.log(data);
        //         if(data.errorList.length == 0 && data.messageList.length != 0){
        //           /*if(isReprint == undefined){
        //             this.successPrintMdl.openNoClose();
                    
        //           }else{
        //             this.reprintMdl.closeModal();  
        //              this.printLoading = false;
        //           }*/
        //         }else{
        //           console.log('error');
        //         }
        //       }
        //     );
        //   }
        // }
      }

  getExtractToCsv(){
    console.log(this.params.reportId);
      console.log(this.ns.getCurrentUser() + ' >> current user');
      this.ms.getExtractToCsv(this.ns.getCurrentUser(),'ACSER007')
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
       // if(this.params.reportId == 'ACSER007'){
          this.passDataCsv = data['listAcser007'];
          query = 'SELECT extractId as [EXTRACT ID], extractUser as [EXTRACT USER], myFormat(extractDate) as [EXTRACT DATE], tranId as [TRAN ID], myFormat(tranDate) as [TRAN DATE],' +
          'isNull(tranClass) as [TRAN CLASS], isNull(refNo) as [REF NO], checkNullNo(tranTypeCd) as [TRAN TYPE CD], isNull(currCd) as [CURRENCY],' +
          'isNull(payee) as [PAYEE], isNull(particulars) as [PARTICULARS], isNull(tranStatus) as [TRAN STATUS], isNull(acctStatus) as [ACCT STATUS],' +
          'checkNullNo(glAcctId) as [GL ACCT ID], isNull(acctCode) as [ACCT CODE], isNull(acctName), checkNullNo(slTypecd) as [SL TYPE CD],' +
          'isNull(slTypeName) as [SL TYPE NAME], checkNullNo(slCd) as [SL CD], slName as [SL NAME], negFmt(currency(creditAmt)) as [CREDIT AMT],'+
          'negFmt(currency(debitAmt)) as [DEBIT AMT], negFmt(currency(localCreditAmt)) as [LOCAL CREDIT AMT], negFmt(currency(localDebitAmt)) as [LOCAL DEBIT AMT],'+
          'isNull(entryType) as [ENTRY TYPE], isNull(periodType) as [PERIOD TYPE], myFormat(periodFrom) as [PERIOD FROM], myFormat(periodTo) as [PERIOD TO],'+
          'checkNullNo(acctParam) as [ACCT PARAM], isNull(acctParamName) as [ACCT PARAM NAME], isNull(acctParamCode) as [ACCT PARAM CODE], isNull(slTypeParam) as [SL TYPE PARAM],'+
          'isNull(slTypeParamName) as [SL TYPE PARAM NAME], isNull(orTag) as [OR TAG], isNull(cvTag) as [CV TAG], isNull(jvTag) as [JV TAG], isNull(closeTranTag) as [CLOSE TRAN TAG],' +
          'isNull(appendTag) as [APPEND TAG], isNull(currCdParam) as [CURR CD PARAM], isNull(tranTypeName) as [TRAN TYPE NAME], isNull(tranStatusDesc) AS [TRAN STATUS DESC],' +
          'isNull(acctStatusDesc) AS [ACCT STATUS DESC]';
       // }

        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);
      });
  }

}
