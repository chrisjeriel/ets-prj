
import { Component, OnInit, Input, ViewChild, Output, EventEmitter,ViewChildren,QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'
import { QuotationService } from '@app/_services';



@Component({
  selector: 'app-print-modal',
  templateUrl: './print-modal.component.html',
  styleUrls: ['./print-modal.component.css']
})
export class PrintModalComponent implements OnInit {
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @Input() printDefaultType: boolean;
  @Input() passData: any = {
     cessionDesc: null,
     status: null,
     quoteId: null,
     reasonCd: null
   }

  constructor(public modalService: NgbModal, private qs: QuotationService) { }
   reportsList: any[] = [
								{val:"QUOTER009A", desc:"Quotation Letter" },
								{val:"QUOTER009B", desc:"RI Preparedness to Support Letter" },
                {val:"QUOTER009C", desc:"RI Confirmation of Acceptance Letter" },
								{val:"QUOTER009D", desc:"Risk Not Commensurate" },
								{val:"QUOTER009E", desc:"Treaty Exclusion Letter" },
                {val:"QUOTER012", desc:"Hold Cover Letter (Quotation)"}
					     ]               
   selected: any[] = [];

					     
  selectWordingDisabled: boolean = true;
  selectPrinterDisabled: boolean = true;
  selectCopiesDisabled: boolean = true;
  selectedReport: any = null;
  printType: string = "SCREEN";
  printName: any = null;
  printCopies: any = null;
  reportId: any = null;
  wordingText: any = null;
  titleText: any = null;
  wordings: boolean = true;
  reports: boolean = false;
  requiredBool: boolean = false;
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  btnDisabled: boolean;
  default: boolean = true;

  ngOnInit() {

  }
 
tabSelectedReportController(event?){
        if(this.selectedReport == "QUOTER009C" || this.selectedReport == "QUOTER009E"){
          this.qs.getReptext({quoteId : this.passData.quoteId, reportId : this.selectedReport}).subscribe(a=>{
            this.wordingText = a['repText'];
          })
        }

        if (this.selectedReport == "QUOTER009A"){
          this.refreshModal(true);
        } else if (this.selectedReport == "QUOTER009B"){
          this.reportId = "QUOTER009C"
          this.refreshModal(true);
        } else if (this.selectedReport == "QUOTER009C"){

          this.reportId = "QUOTER009C"
          this.refreshModal(false);
        } else if (this.selectedReport == "QUOTER009D"){
          this.reportId = "QUOTER009D"
          this.refreshModal(true); 
        } else if (this.selectedReport == "QUOTER009E"){
          this.reportId = "QUOTER009D"
          this.refreshModal(false);
        } else if (this.selectedReport == "QUOTER012"){
          this.refreshModal(false);
        }
        this.reportId = this.selectedReport;

}

refreshModal(isDisable : boolean){
  if(isDisable){
          $("a").removeClass('').addClass('disabled-a');
          this.btnDisabled = false;
          this.wordingText = null;
          this.titleText = null;
          this.wordings = true;
          $("#title").css({"box-shadow": ""});
          $("#word").css({"box-shadow": ""});
  } else {
          $("a").removeClass('disabled-a').addClass('');
          this.btnDisabled = false;
          this.wordingText = null;
          this.titleText = null;
          this.wordings = false;
  }
}

   open(content?) { 
     this.modal.openNoClose();
     if(this.isEmptyObject(this.passData.cessionDesc)){
     } else {
        if(this.passData.cessionDesc.toUpperCase() === 'RETROCESSION'){

          this.reportsList = [];
          this.reportsList.push({val:"QUOTER009A", desc:"Quotation Letter" });
          this.reportsList.push({val:"QUOTER009B", desc:"RI Preparedness to Support Letter" });
          this.reportsList.push({val:"QUOTER009C", desc:"RI Confirmation of Acceptance Letter" });
          if (this.passData.status === '10'){
            this.reportsList.push({val:"QUOTER009D", desc:"Risk Not Commensurate" });
            
          } else if (this.passData.status === '9' && this.passData.reasonCd === 'NT'){
            this.reportsList.push({val:"QUOTER009E", desc:"Treaty Exclusion Letter"});
            
            this.reportId = this.reportsList[0].val;
            this.refreshModal(false);
          } else {
             
            
            this.refreshModal(true);
            $("#title").css({"box-shadow": ""});
            $("#word").css({"box-shadow": ""});
          }

       } else if (this.passData.cessionDesc.toUpperCase() === 'DIRECT'){
          this.reportsList = [];
          this.reportsList.push({val:"QUOTER009A", desc:"Quotation Letter" });
          if (this.passData.status === '10'){
            this.reportsList.push({val:"QUOTER009D", desc:"Risk Not Commensurate" });

            
          } else if (this.passData.status === '9' && this.passData.reasonCd === 'NT'){
            this.reportsList.push({val:"QUOTER009E", desc:"Treaty Exclusion Letter"});
            
            this.reportId = this.reportsList[0].val;
            this.refreshModal(false);
          }
       } 
       this.selectedReport = this.reportsList[0].val;
       this.tabSelectedReportController();

    }
    
  }

  reportsParamsLOV(){
    $('#reportsParamLOV #modalBtn').trigger('click') ;
  }

  setReportsParams(data){
    if (this.isEmptyObject(data)){
        this.titleText = "";
        this.wordingText = "";
    } else {
        this.titleText = data.title;
        this.wordingText = data.text;
    }
     $('#showPrintMenu #modalBtn').trigger('click');
  }

  cancel($event){
     $('#showPrintMenu #modalBtn').trigger('click');
  }

  isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

 okBtnClick($event){
   if (this.selectedReport == "QUOTER009C" || this.selectedReport == "QUOTER009E"){
        if (this.isEmptyObject(this.wordingText)){
             this.dialogIcon = "error-message";
             this.dialogMessage = "Please choose wordings";
             console.log('teststststs')
             $('#quotation #successModalBtn').trigger('click');
             setTimeout(()=>{$('.globalLoading').css('display','none');},0);
        } else {
           this.selected.push(new SelectedData(this.selectedReport,this.printType,this.wordingText));
           this.selectedData.emit(this.selected);
           this.selected = [];
        }
    } else {
     this.selected.push(new SelectedData(this.selectedReport,this.printType,this.wordingText));
     this.selectedData.emit(this.selected);
     this.selected = [];
    }   
  }
 }
class SelectedData {
  reportName: string;
  printType: string;
  wordingTxt: string;

  constructor(reportName: string,
    printType: string,
    wordingTxt: string) {

  this.reportName = reportName;
  this.printType = printType;
  this.wordingTxt = wordingTxt;
  }
}


