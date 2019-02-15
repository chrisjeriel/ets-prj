import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-mtn-endt-code',
  templateUrl: './mtn-endt-code.component.html',
  styleUrls: ['./mtn-endt-code.component.css']
})
export class MtnEndtCodeComponent implements OnInit {
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passData: any = {
        tableData: [],
        tHeader: ['Endt Code', 'Endt Title', 'Endt Description', 'Remarks'],
        dataTypes: ['text', 'text', 'text', 'text'],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 99,
        keys:[
        	'endtCd',
        	'endtTitle',
        	'description',
        	'remarks']

    }
    selected: any;

  ngOnInit() {
  	this.mtnService.getEndtCode("CAR").subscribe((data: any) => {
  		console.log(data.endtCode);
  		for (var i = data.endtCode.length - 1; i >= 0; i--) {
  			this.passData.tableData.push(data.endtCode[i]);
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

