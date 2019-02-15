import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-object',
  templateUrl: './mtn-object.component.html',
  styleUrls: ['./mtn-object.component.css']
})
export class MtnObjectComponent implements OnInit {

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passData: any = {
        tableData: [],
        tHeader: ['Line', 'Line Description','Object','Object Description','Active Tag','Remarks' ],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text'],
        resizable: [false, true, false, true, false, true ],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 'object',
        keys:['lineCd', 'lineDesc','objectId','description','activeTag','remarks'],
        filters:[
          {
              key: 'lineCd',
              title: 'Line',
              dataType: 'text'
          },
          {
            key: 'lineDesc',
            title: 'Line Desc',
            dataType: 'text'
          },
          {
            key: 'objectId',
            title: 'Object',
            dataType: 'text'
          },
          {
            key: 'description',
            title: 'Object Desc',
            dataType: 'text'
          },
          {
            key: 'activeTag',
            title: 'Active Tag',
            dataType: 'text'
          },
          {
            key: 'remarks',
            title: 'Remarks',
            dataType: 'text'
          },
        ]
    }

  selected: any;


  constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }

  ngOnInit() {
  	  	this.mtnService.getMtnObject('','').subscribe((data: any )=> {
  	  		for (var a = data['object'].length - 1; a >= 0; a--) {
            this.passData.tableData.push(data['object'][a]);
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
