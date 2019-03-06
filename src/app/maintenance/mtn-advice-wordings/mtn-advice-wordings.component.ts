import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-mtn-advice-wordings',
  templateUrl: './mtn-advice-wordings.component.html',
  styleUrls: ['./mtn-advice-wordings.component.css']
})
export class MtnAdviceWordingsComponent implements OnInit {

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  
  passDataAdvice: any = {
        tableData: [],
        tHeader: ["Advice Word Id","Description","Active Tag","Wordings","Remarks"],
        dataTypes: ['text', 'text', 'text', 'text','text'],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 99,
        keys:[
        	'adviceWordId', 
          'description', 
          'activeTag', 
          'wordings', 
          'remarks'
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
   this.mtnService.getAdviceWordings().subscribe((data: any) => {
      // for (var i = 0; i < data.adviceWordings.length; i++) {
      //   this.passDataAdvice.tableData.push(data.adviceWordings[i]);
      // }
      this.passDataAdvice.tableData = data.adviceWordings;
      this.table.refreshTable();
    });
   this.modalOpen = true;
 }

}
