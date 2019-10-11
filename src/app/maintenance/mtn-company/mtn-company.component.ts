import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-company',
  templateUrl: './mtn-company.component.html',
  styleUrls: ['./mtn-company.component.css']
})
export class MtnCompanyComponent implements OnInit {
  @ViewChild('mdl') modal : ModalComponent;

  selected: any = null;

  companyListing: any = {
    tableData: [],
    tHeader: ['Company Id', 'Short Name', 'Company Name'],
    dataTypes: ['text', 'text', 'text',],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
      'companyId',
      'companyAbbr',
      'companyName']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  modalOpen: boolean = false;

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	if(this.lovCheckBox){
      this.companyListing.checkFlag = true;
    }
  }

  onRowClick(data){
    // if(Object.is(this.selected, data)){
    if(Object.entries(data).length === 0 && data.constructor === Object){
      this.selected = null
    } else {
      this.selected = data;
    }
  }

  confirm(){
    if(!this.lovCheckBox){
     this.selectedData.emit(this.selected);
     this.companyListing.tableData = [];
     this.table.refreshTable();
    }
    else{
      for(var i = 0; i < this.companyListing.tableData.length; i++){
        if(this.companyListing.tableData[i].checked){
          this.selects.push(this.companyListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }  
  }

  cancel(){
    this.companyListing.tableData = [];
    this.table.refreshTable();
  }

  openModal(){
      setTimeout(()=>{    //<<<---    using ()=> syntax
           this.maintenanceService.getMtnCompany('').subscribe((data: any) =>{
                 for(var companyCount = 0; companyCount < data.companyListing.length; companyCount++){
                   this.companyListing.tableData.push(
                     new Row(data.companyListing[companyCount].companyId, 
                         data.companyListing[companyCount].companyAbbr,
                         data.companyListing[companyCount].companyName)
                   );      
                 }
                 this.table.refreshTable();
               });
                 this.modalOpen = true;
       }, 100);
      
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        companyId: '',
        companyName: '',
        ev: ev
      });
    } else {
      var isValid = isNaN(code);
      if (isValid === false){
        this.maintenanceService.getMtnCompany(code).subscribe(data => {
          if(data['companyListing'].length > 0) {
            data['companyListing'][0]['ev'] = ev;
            this.selectedData.emit(data['companyListing'][0]);
          } else {
            this.selectedData.emit({
              companyId: '',
              companyName: '',
              ev: ev
            });
            this.modal.openNoClose();
          }
        });
      } else {
         this.selectedData.emit({
            companyId: '',
            companyName: '',
            ev: ev
          });
          this.modal.openNoClose();
      }
   }
  }


}

class Row{
  companyId: string;
  companyAbbr: string;
  companyName: number;

  constructor(companyId: string, 
        companyAbbr: string,
        companyName: number){

    this.companyId   = companyId;
    this.companyAbbr = companyAbbr;
    this.companyName = companyName;
  }
}
