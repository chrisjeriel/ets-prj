import { Component, OnInit, Input, ViewChild, Output, EventEmitter,ViewChildren,QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'



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

  constructor(private modalService: NgbModal) { }
   reportsList: any[] = [
								{val:"QUOTER009A", desc:"Quotation Letter" },
								{val:"QUOTER009B", desc:"RI Preparedness to Support Letter and RI Confirmation of Acceptance Letter" },
								{val:"QUOTER009C", desc:"Risk Not Commensurate" },
								{val:"QUOTER009D", desc:"Treaty Exclusion Letter" }
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
  requiredBool: boolean = false;

  ngOnInit() {
  }
 
tabController(event) {
        if (this.printType == 'SCREEN'){
          this.refreshPrintModal(true);
        } else if (this.printType == 'PRINTER'){
          this.refreshPrintModal(false);
        } else if (this.printType == 'PDF'){
          this.refreshPrintModal(true);
        }
}

tabSelectedReportController(event){
        if (this.selectedReport == this.reportsList[0].val){
          this.reportId = this.reportsList[0].val
          $("a").removeClass('').addClass('disabled-a');
          this.wordingText = null;
        } else if (this.selectedReport == this.reportsList[1].val){
          this.reportId = this.reportsList[1].val
          $("a").removeClass('').addClass('disabled-a');
          this.wordingText = null;
        } else if (this.selectedReport == this.reportsList[2].val){
          this.reportId = this.reportsList[2].val
          $("a").removeClass('').addClass('disabled-a');
          this.wordingText = null;
        } else if (this.selectedReport == this.reportsList[3].val){
          this.reportId = this.reportsList[3].val
          $("a").removeClass('disabled-a').addClass('');
          this.wordingText = null;
        }

}

 refreshPrintModal(condition : boolean){
         if (condition){
            this.selectPrinterDisabled = true;
            this.selectCopiesDisabled = true;
            $("#noOfCopies").val("");
            $("#noOfCopies").css({"box-shadow": ""});
            $("#printerName").css({"box-shadow":""});
            $("#printerName").val("");
            this.requiredBool = false;
            this.printName = null;
            this.printCopies = null;
         } else {
            this.selectPrinterDisabled = false;
            this.selectCopiesDisabled = false;
            $("#noOfCopies").val("");
            $("#noOfCopies").css({"box-shadow": ""});
            $("#printerName").css({"box-shadow":""});
            $("#printerName").val("");
            this.requiredBool = true;
            this.printName = null;
            this.printCopies = null;

         }
        
    }

   open(content?) { 
     this.modal.openNoClose();
    }

  reportsParamsLOV(){
    $('#reportsParamLOV #modalBtn').trigger('click') ;
  }

  setReportsParams(data){
    if (this.isEmptyObject(data)){
        this.wordingText = "";
    } else {
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
   this.selected.push(new SelectedData(this.selectedReport,this.printType, this.printName, this.printCopies, this.wordingText));
   this.selectedData.emit(this.selected);
   this.selected = [];
 }

}
class SelectedData {
  reportName: string;
  printType: string;
  printerName: string;
  printCopies: number;
  wordingTxt: string;

  constructor(reportName: string,
    printType: string,
    printerName: string,
    printCopies: number,
    wordingTxt: string) {

  this.reportName = reportName;
  this.printType = printType;
  this.printerName = printerName;
  this.printCopies = printCopies;
  this.wordingTxt = wordingTxt;
  }
}
