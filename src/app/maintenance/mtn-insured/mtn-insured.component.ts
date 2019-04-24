import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
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
        tHeader: ['Insured Id', 'Insured Name','Address'],
        dataTypes: ['sequence-3', 'text', 'text'],
        resizable: [false, true, false, true, true, false, false],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 'Insured',
        keys:['insuredId', 'insuredName','address']

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
    while(this.passData.tableData.length>0){
      this.passData.tableData.pop();
    }
    this.mtnService.getMtnInsured('').subscribe((data: any) => {      
          this.passData.tableData = data.insured;
          this.table.refreshTable();
          this.modalOpen = true;
        });
    this.modalOpen = true;

  }

  checkCode(code, id, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        insuredId: '',
        insuredName: '',
        ev: ev
      });
    } else {
      this.mtnService.getMtnInsured(code).subscribe(data => {
        if(data['insured'].length > 0) {
          data['insured'][0]['ev'] = ev;
          data['insured'][0].insuredId = this.pad(data['insured'][0].insuredId, 6); //Ensures 6 digit for insured ID
          this.selectedData.emit(data['insured'][0]);
        } else {
          this.selectedData.emit({
            insuredId: '',
            insuredName: '',
            ev: ev
          });        

          $(id + ' #modalBtn').trigger('click');
        }      
      });
    }
  }

  pad(str, num?) {
    if(str === '' || str == null){
      return '';
    }
    
    return String(str).padStart(num != null ? num : 3, '0');
  }

}
