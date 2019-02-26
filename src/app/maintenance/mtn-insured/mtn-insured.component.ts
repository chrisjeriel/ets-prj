import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-mtn-insured',
  templateUrl: './mtn-insured.component.html',
  styleUrls: ['./mtn-insured.component.css']
})
export class MtnInsuredComponent implements OnInit {
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passData: any = {
        tableData: [],
        tHeader: ['Insured Id', 'Insured Name' ],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text'],
        resizable: [false, true, false, true, true, false, false],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 'Insured',
        keys:['insuredId', 'insuredName' ]

    }

  selected: any;


  constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }

  ngOnInit() {
  	  	
  }

  select(data){
  	  this.selected = data;
  }

  okBtnClick(){
  	this.selectedData.emit(this.selected);
  }

  openModal(){
    while(this.passData.tableData.length>0){
      this.passData.tableData.pop();
    };

    this.mtnService.getMtnInsured().subscribe((data: any) => {
      this.passData.tableData = data.insured;
      this.table.refreshTable();
    });
  }

}
