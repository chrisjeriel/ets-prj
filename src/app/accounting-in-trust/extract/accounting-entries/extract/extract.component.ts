import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, PrintService } from '@app/_services';
import { LovComponent, ModalComponent, SucessDialogComponent } from '@app/_components/common';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.css']
})
export class ExtractComponent implements OnInit {

    postingDateFlag: any = '1';

    constructor(private titleService: Title, private ns: NotesService, private ps: PrintService) { }
    params: any = {
  	  reportId : 'ACITR058',
  		reportName : 'ACITR058',
  		entryType : 'A',
  		periodType : 'T',
  		periodFrom : '',
  		periodTo : '',
  		acctParam : '',
  		slTypeParam : '',
  		arTag : true,
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
    @ViewChild('polReportsModal') polReportsModal: ModalComponent;
    @ViewChild('appDialog') appDialog: SucessDialogComponent;

  	@ViewChild(MtnCurrencyCodeComponent) currCdLov: MtnCurrencyCodeComponent;

      ngOnInit() {
        this.titleService.setTitle("Acct-IT | Extract Accounting Entries");

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
        param.arTag = param.arTag ? 'Y' : 'N';
        param.cvTag = param.cvTag ? 'Y' : 'N';
        param.jvTag = param.jvTag ? 'Y' : 'N';
        param.closeTranTag = param.closeTranTag ? 'Y' : 'N';
        param.forceExtract = forceExtract != undefined ? 'Y' : 'N';
        this.loading = true;
        this.ps.extractReport({ reportId: param.reportId, acitr058Params:param }).subscribe((data:any)=>{

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



}
