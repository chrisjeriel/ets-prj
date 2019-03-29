import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-mtn-reports-params',
  templateUrl: './mtn-reports-params.component.html',
  styleUrls: ['./mtn-reports-params.component.css']
})
export class MtnReportsParamsComponent implements OnInit {
  @Input()  reportId: string;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }
  
  passDataReportsParam: any = {
  		tableData: [],
  		tHeader: ["Wordings"],
  		dataTypes: ['text'],
  		pageLength: 10,
  		pageId: 'reportsParam1',
  		tableOnly: true,
  		keys:['text'],
  }

  selected: any;
  modalOpen : boolean = false;

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];



  ngOnInit() {
  	if(this.lovCheckBox){
      this.passDataReportsParam.checkFlag = true;
    }
  }

  select(data){
  	  this.selected = data;
  }

  okBtnClick(){
  	if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
    }
    else{
      for(var i = 0; i < this.passDataReportsParam.tableData.length; i++){
        if(this.passDataReportsParam.tableData[i].checked){
          this.selects.push(this.passDataReportsParam.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModal(){
    if (this.isEmptyObject(this.passDataReportsParam.tableData)){
    } else {
        this.passDataReportsParam.tableData = [];
    }
     this.mtnService.getMtnQuotationPrintingWordings(this.reportId).subscribe((data: any) =>{
          for (var a = 0; a < data.reportsParam.length ; a++) {
              this.passDataReportsParam.tableData.push(data.reportsParam[a]);
          }
          this.table.refreshTable();
        });
     this.modalOpen = true;
  }

   onClickCancel(event){
        //do some adding
         this.cancel.next(event);
    }

    isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

}
