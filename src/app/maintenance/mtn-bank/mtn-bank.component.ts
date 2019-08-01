import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-bank',
  templateUrl: './mtn-bank.component.html',
  styleUrls: ['./mtn-bank.component.css']
})
export class MtnBankComponent implements OnInit {
  @ViewChild('mdl') modal : ModalComponent;

   selected: any = null;

  bankListing: any = {
    tableData: [],
    tHeader: ['Bank', 'Short Name', 'Official Name', 'Remarks',],
    dataTypes: ['text', 'text', 'text', 'text',],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
      'bankCd',
      'shortName',
      'officialName',
      'remarks',]
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  modalOpen: boolean = false;

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	if(this.lovCheckBox){
      this.bankListing.checkFlag = true;
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
     this.bankListing.tableData = [];
     this.table.refreshTable();
    }
    else{
      for(var i = 0; i < this.bankListing.tableData.length; i++){
        if(this.bankListing.tableData[i].checked){
          this.selects.push(this.bankListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }  
  }

  cancel(){
    this.bankListing.tableData = [];
    this.table.refreshTable();
  }

   openModal(){
      setTimeout(()=>{    //<<<---    using ()=> syntax
           this.maintenanceService.getMtnBank('','','Y').subscribe((data: any) =>{
                 for(var bankCount = 0; bankCount < data.bankList.length; bankCount++){
                   this.bankListing.tableData.push(
                     new Row(data.bankList[bankCount].bankCd, 
                         data.bankList[bankCount].shortName,
                         data.bankList[bankCount].officialName,
                         data.bankList[bankCount].remarks)
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
        bankCd: '',
        shortName: '',
        ev: ev
      });
    } else {
      var isValid = isNaN(code);
      if (isValid === false){
        this.maintenanceService.getMtnBank(code,'','Y').subscribe(data => {
          if(data['bankList'].length > 0) {
            data['bankList'][0]['ev'] = ev;
            this.selectedData.emit(data['bankList'][0]);
          } else {
            this.selectedData.emit({
              bankCd: '',
              shortName: '',
              ev: ev
            });
            this.modal.openNoClose();
          }
        });
      } else {
         this.selectedData.emit({
            bankCd: '',
            shortName: '',
            ev: ev
          });
          this.modal.openNoClose();
      }
   }
  }


}

class Row{
  bankCd: string;
  shortName: string;
  officialName: number;
  remarks: string;

  constructor(bankCd: string, 
        shortName: string,
        officialName: number,
        remarks: string){

    this.bankCd = bankCd;
    this.shortName = shortName;
    this.officialName = officialName;
    this.remarks = remarks;
  }
}