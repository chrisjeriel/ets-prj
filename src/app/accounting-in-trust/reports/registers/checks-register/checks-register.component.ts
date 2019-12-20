import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, PrintService } from '@app/_services';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-checks-register',
  templateUrl: './checks-register.component.html',
  styleUrls: ['./checks-register.component.css']
})
export class ChecksRegisterComponent implements OnInit {

  @ViewChild('bankLov') bankLov               : LovComponent;
  @ViewChild('bankAcctLov') bankAcctLov       : LovComponent;

  tDate: boolean = true;
  pDate: boolean = false;
  dateRadio: string = "1";
  desRadio: string = "1";
  iCloTag:boolean = true;
  iCanTag:boolean = true;
  bankName: string = "";
  bankAcctName: string = "";

  params :any = {
    reportId: 'ACITR061D',
    reportName : 'ACITR061D',
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
    sortBy: '',
    bank: '',
    bankAcct: '',
  }

  passDataLov  : any = {
    selector     : ''
  };

  printerList: string[] = [];
  selectedPrinter: string = '';


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

  tickBox(event) {
  	var el = event.target.closest('input');

  	this.tDate = false;
  	this.pDate = false;

  	$('.rdo').prop('checked', false);
  	$(el).prop('checked', true);
  }

  onClickPrint() {
    this.params.tranPostDate = this.dateRadio;
    this.params.printedBy = this.ns.getCurrentUser();
    this.params.incClosedTran = this.iCloTag ? 'Y' : 'N';
    this.params.incCancelTran = this.iCanTag ? 'Y' : 'N';

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
      "acitr061Params.chkDate" : this.params.chkDate,
      "acitr061Params.sortBy" : this.params.sortBy,
      "acitr061Params.bank" : this.params.bank,
      "acitr061Params.bankAcct" : this.params.bankAcct,
      "printerName": this.selectedPrinter,
      "pageOrientation": 'LANDSCAPE',
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
    if(fromUser.toLowerCase() == 'bank'){
      //this.passDataLov.selector = 'mtnBank';
      this.passDataLov.selector = 'bankLov';
      this.passDataLov.glDepFor = 'acit';
      this.bankLov.openLOV();
    } else if(fromUser.toLowerCase() == 'bank-acct'){
      this.passDataLov.selector = 'bankAcct';
      this.passDataLov.bankCd = this.params.bank;
      this.passDataLov.from = 'acit';
      this.bankAcctLov.openLOV();
    }
  }

  checkCode(ev, str) {
    this.ns.lovLoader(ev, 1);

    if(str == 'bank') {
      this.passDataLov.bank = this.params.bank;
      this.passDataLov.glDepFor = 'acit';
      this.bankName = '';
      this.bankLov.checkCode('bankLov', ev);

      setTimeout(() => {
        this.ns.lovLoader(ev, 0);
      },500);
      
    } else if(str == 'bank-acct') {
      this.bankAcctLov.checkCode(this.params.bankAcct, ev);
    }
  }

  setData(data,from){
    

    if(from.toLowerCase() == 'bank'){
      if (data.data != null) {
        this.bankName   = data.data.officialName;
        this.params.bank = data.data.bankCd;
        this.bankAcctName = '';
        this.params.bankAcct = '';
      }
    }else if(from.toLowerCase() == 'bank-acct'){
      this.bankName   = data.data.bankName;
      this.params.bank = data.data.bankCd;
      this.bankAcctName   = data.data.accountName + " | " + data.data.accountNo;
      this.params.bankAcct = data.data.bankAcctCd;
      /*var chkNo = this.checkSeriesList.filter(e => e.bank == this.saveAcitCv.bank && e.bankAcct == this.saveAcitCv.bankAcct && e.usedTag == 'N').sort((a,b) => a.checkNo - b.checkNo);
      if(chkNo.length == 0){
        this.saveAcitCv.checkNo = '';
        this.warnMsg = 'There is no Check No available for this Account No.\nPlease proceed to maintenance module to generate Check No.';
        this.warnMdl.openNoClose();
      }else{
        this.saveAcitCv.checkNo = chkNo[0].checkNo;
      }*/
    }
  }

}
