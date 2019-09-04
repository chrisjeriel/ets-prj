import { Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
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
  @Input() line: string = "";
  @Input() hide: any[];

  constructor(public modalService: NgbModal, private mtnService : MaintenanceService) { }
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

    @Input() lovCheckBox: boolean = false;
    selects: any[] = [];
    addBtn:boolean = true;

  ngOnInit() {
    if(this.lovCheckBox){
      this.passData.checkFlag = true;
    }
  }

  select(data) {
  	  this.addBtn = this.table.selected.length == 0;
  }

  okBtnClick(){
    if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
    }
    else{
      for(var i = 0; i < this.passData.tableData.length; i++){
        if(this.passData.tableData[i].checked){
          this.selects.push(this.passData.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModal(){
    this.passData.tableData = [];
    this.mtnService.getEndtCode(this.line,'').subscribe((data: any) => {
      for (var i = 0; i< data.endtCode.length ; i++) {
        if(this.hide!== undefined && this.hide.indexOf(data.endtCode[i].endtCd) != -1)
          continue;
        this.passData.tableData.push(data.endtCode[i]);
      }
      this.table.refreshTable();
    });
  }

}


