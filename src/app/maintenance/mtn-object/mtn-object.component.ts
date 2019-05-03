import { Component, OnInit, ViewChild, Output, EventEmitter,Input } from '@angular/core';
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
  @Input() line: string = "";
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passData: any = {
        tableData: [],
        tHeader: ['Object','Object Description'],
        dataTypes: ['sequence-3', 'text'],
        resizable: [false, true, false, true, false, true ],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 'object',
        keys:['objectId','description'],
        filters:[
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
        ]
    }

  selected: any = null;
  modalOpen: boolean = false;

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

  constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }

  ngOnInit() {
    if(this.lovCheckBox){
      this.passData.checkFlag = true;
    }
  }

  select(data){
  	// if(Object.is(this.selected, data)){
    if(Object.entries(data).length === 0 && data.constructor === Object){
      this.selected = null
    } else {
      this.selected = data;
    }
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
    this.mtnService.getMtnObject(this.line,'').subscribe((data: any )=> {
          for(var lineCount = 0; lineCount < data['object'].length; lineCount++){
            this.passData.tableData.push(
              new Row(
                  data['object'][lineCount].lineCd, 
                  data['object'][lineCount].lineDesc,
                  data['object'][lineCount].objectId,
                  data['object'][lineCount].description,
                  data['object'][lineCount].activeTag,
                  data['object'][lineCount].remarks
                  )
            );      
          }
          this.table.refreshTable();
        });
        this.modalOpen = true;
  }

  checkCode(line, code, ev) {
    if(String(code).trim() === ''){
      this.selectedData.emit({
        objectId: '',
        objectDesc: '',
        ev: ev
      });
    } else {
      this.mtnService.getMtnObject(line, code).subscribe(data => {      
        if(data['object'].length > 0) {
          data['object'][0]['ev'] = ev;
          this.selectedData.emit(data['object'][0]);
        } else {
          this.selectedData.emit({
            objectId: '',
            objectDesc: '',
            ev: ev
          });
            
          $('#objectMdl > #modalBtn').trigger('click');
        }
        
      });
    }
  }

}


class Row {
  lineCd : string;
  lineDesc: string;
  objectId: number ;
  description :string; 
  activeTag :string;
  remarks: string;

	constructor(lineCd : string,lineDesc: string,objectId: number ,description :string,activeTag :string,remarks: string) {
    this.lineCd  = lineCd;
    this.lineDesc = lineDesc;
    this.objectId = objectId;
    this.description  = description;
    this.activeTag  = activeTag;
    this.remarks = remarks;
	
	}
}
