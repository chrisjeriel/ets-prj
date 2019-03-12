import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-mtn-reason',
  templateUrl: './mtn-reason.component.html',
  styleUrls: ['./mtn-reason.component.css']
})
export class MtnReasonComponent implements OnInit {

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  
   constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }

    passDataReason: any = {
          tableData: [],
          tHeader: ["Reason","Description"],
          dataTypes: ['text', 'text'],
          pageLength: 6,
          fixedCol: false,
          pageID: 'reason',
          keys:[
          	'reasonCd', 
            'description', 
            ]

      }
      selected: any;
      modalOpen : boolean = false;

    ngOnInit() {
    	
      
    }



    select(data){
    	  this.selected = data;
    }

    okBtnClick(){
    	this.selectedData.emit(this.selected);
    }

   openModal(){
     this.mtnService.getMtnReason().subscribe((data: any) => {
        for (var i = 0; i < data.reason.length; i++) {
          this.passDataReason.tableData.push(data.reason[i]);
        }
        this.table.refreshTable();
      });
     this.modalOpen = true;
   }

}
