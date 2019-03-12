import { Component, OnInit, ViewChild, Output, EventEmitter,Input } from '@angular/core';
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
  @Input() line:string = "";
  @Input() type:string = "";
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passData: any = {
        tableData: [],
        tHeader: ['Wording Id','Wording'],
        dataTypes: ['sequence-3', 'text'],
        resizable: [false, true, false, true],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 'quotation-wordings'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
        keys:['wordingId','wording'],
        filters:[
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
  modalOpen:boolean = false;


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
     this.passData.tableData = [];
     this.mtnService.getMtnQuotationWordings(this.line,'').subscribe((data: any) =>{
          for (var a = 0; a < data['quoteWordings'].length ; a++) {
            if(data['quoteWordings'][a].type === this.type){
              this.passData.tableData.push(data['quoteWordings'][a]);
            }               
          }
          this.table.refreshTable();
        });
     this.modalOpen = true;
  }


}
