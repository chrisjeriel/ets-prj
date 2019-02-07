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
        pageID: 2,
        keys:['insuredId', 'insuredName' ]

    }

  selected: any;


  constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }

  ngOnInit() {
  	  	this.mtnService.getMtnInsured().subscribe((data: any) => {
  	  		for (var a = data.insured.length - 1; a >= 0; a--) {
  	  			this.passData.tableData.push(data.insured[a]);
  	  		}
  	  		this.table.refreshTable();
  	  	});

  }

  select(data){
  	  this.selected = data;
  }

  okBtnClick(){
  	this.selectedData.emit(this.selected);
  }

}
