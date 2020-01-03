import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, PrintService } from '@app/_services';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-cv-register',
  templateUrl: './cv-register.component.html',
  styleUrls: ['./cv-register.component.css']
})
export class CvRegisterComponent implements OnInit {

  @ViewChild('paytTypeLov') paytTypeLov : LovComponent;

  dateRadio: string = "1";
  desRadio: string = "1";
  rType: string = "S";
  iCloTag:boolean = true;
  iCanTag:boolean = true;
  tDate: boolean = true;
  pDate: boolean = false;

  params :any = {
    reportId: 'ACITR061B',
    reportName : 'ACITR061B',
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

  onClickPrint() {
    this.params.tranPostDate = this.dateRadio;
    this.params.printedBy = this.ns.getCurrentUser();
    this.params.incClosedTran = this.iCloTag ? 'Y' : 'N';
    this.params.incCancelTran = this.iCanTag ? 'Y' : 'N';
    this.params.reportType = this.rType;

    if (this.rType == "S") {
      this.params.reportId = "ACITR061B";
    } else if (this.rType == "D"){
      this.params.reportId = "ACITR061B_DTL";
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
      "acitr061Params.chkDate" : this.params.chkDate,
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

  tickBox(event) {
    var el = event.target.closest('input');
    this.tDate = false;
    this.pDate = false;
    $('.rdo').prop('checked', false);
    $(el).prop('checked', true);
  }
}
