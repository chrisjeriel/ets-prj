
import { Component, OnInit, Input, ViewChild, Output, EventEmitter,ViewChildren,QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';



@Component({
  selector: 'app-print-modal-mtn-acct',
  templateUrl: './print-modal-mtn-acct.component.html',
  styleUrls: ['./print-modal-mtn-acct.component.css']
})
export class PrintModalMtnAcctComponent implements OnInit {
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  printType: string = "CSV";
  btnDisabled: boolean;
  all: any;
  curr: any;
  radioVal: any = 'all';
  selected: any[] = [];

  constructor(public modalService: NgbModal) { }

  ngOnInit() {
  }

  open() { 
  	$('#showPrintMenu > #modalBtn').trigger('click');
  }

  cancel($event){
     
  }

  okBtnClick($event){
  	this.selected.push(new SelectedData(this.radioVal,this.printType));
    this.selectedData.emit(this.selected);
    this.selected = [];
  }

}

  class SelectedData {
	  basedOn: string;
	  printType: string;
	
   constructor(basedOn: string,
	    	   printType: string) {
	  this.basedOn = basedOn;
	  this.printType = printType;

  }
}
