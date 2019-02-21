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
        tHeader: ["Advice Word Id","Description","Active Tag","Advice Text 1","Advice Text 2","Advice Text 3","Advice Text 4","Advice Text 5","Advice Text 6","Advice Text 7","Advice Text 8","Advice Text 9","Advice Text 10","Remarks"],
        dataTypes: ['text', 'text', 'text', 'text','text', 'text', 'text', 'text','text', 'text', 'text', 'text','text', 'text'],
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
          'adviceText01', 
          'adviceText02', 
          'adviceText03', 
          'adviceText04', 
          'adviceText05', 
          'adviceText06', 
          'adviceText07', 
          'adviceText08', 
          'adviceText09', 
          'adviceText10', 
          'remarks'
          ]

    }
    selected: any;

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
      for (var i = 0; i < data.adviceWordings.length; i++) {
        this.passDataAdvice.tableData.push(data.adviceWordings[i]);
      }
      this.table.refreshTable();
    });
  }
}
