import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-quotation-wordings',
  templateUrl: './mtn-quotation-wordings.component.html',
  styleUrls: ['./mtn-quotation-wordings.component.css']
})
export class MtnQuotationWordingsComponent implements OnInit {

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passData: any = {
        tableData: [],
        tHeader: ['Line', 'Line Description','Wording Id','Wording'],
        dataTypes: ['text', 'text', 'text', 'text'],
        resizable: [false, true, false, true],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 3,
        keys:['lineCd', 'lineDesc','wordingId','wording'],
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
            key: 'wordingId',
            title: 'Wording Id',
            dataType: 'text'
          },
          {
            key: 'wording',
            title: 'Wording',
            dataType: 'text'
          },
        ]
    }

  selected: any;


  constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }

  ngOnInit() { 
        this.mtnService.getMtnQuotationWordings('','').subscribe((data: any) =>{
          for (var a = data['quoteWordings'].length - 1; a >= 0; a--) {
               this.passData.tableData.push(data['quoteWordings'][a]);
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