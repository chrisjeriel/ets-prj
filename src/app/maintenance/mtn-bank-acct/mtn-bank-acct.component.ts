import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-bank-acct',
  templateUrl: './mtn-bank-acct.component.html',
  styleUrls: ['./mtn-bank-acct.component.css']
})
export class MtnBankAcctComponent implements OnInit {
  @ViewChild('mdl') modal : ModalComponent;

  selected: any = null;

  bankAcctListing: any = {
    tableData: [],
    tHeader: ['Bank Name', 'Code', 'Account No', 'Status','DCB Tag'],
    dataTypes: ['text', 'number', 'text', 'text','checkbox'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 'bankAccount',
    keys:[
      'bankName',
      'bankAcctCd',
      'accountNo',
      'acctStatusName',
      'dcbTag']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  modalOpen: boolean = false;

  @Input() lovCheckBox: boolean = false;
  @Input() bankCd: any;

  selects: any[] = [];

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	if(this.lovCheckBox){
      this.bankAcctListing.checkFlag = true;
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
     this.bankAcctListing.tableData = [];
     this.table.refreshTable();
    }
    else{
      for(var i = 0; i < this.bankAcctListing.tableData.length; i++){
        if(this.bankAcctListing.tableData[i].checked){
          this.selects.push(this.bankAcctListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }  
  }

  cancel(){
    this.bankAcctListing.tableData = [];
    this.table.refreshTable();
  }

  openModal(){
      setTimeout(()=>{    //<<<---    using ()=> syntax
           this.maintenanceService.getMtnBankAcct(this.bankCd,'','','Y').subscribe((data: any) =>{
                 for(var bankCount = 0; bankCount < data.bankAcctList.length; bankCount++){
                   this.bankAcctListing.tableData.push(
                     new Row(data.bankAcctList[bankCount].bankName, 
                         data.bankAcctList[bankCount].bankAcctCd,
                         data.bankAcctList[bankCount].accountNo,
                         data.bankAcctList[bankCount].acctStatusName,
                         data.bankAcctList[bankCount].dcbTag)
                   );      
                 }
                 this.table.refreshTable();
               });
                 this.modalOpen = true;
       }, 100);
      
  }



}

class Row{
  bankName: string;
  bankAcctCd: string;
  accountNo: number;
  acctStatusName: string;
  dcbTag : string;

  constructor(bankName: string, 
        bankAcctCd: string,
        accountNo: number,
        acctStatusName: string,
        dcbTag : string){

    this.bankName = bankName;
    this.bankAcctCd = bankAcctCd;
    this.accountNo = accountNo;
    this.acctStatusName = acctStatusName;
    this.dcbTag = dcbTag;
  }
}
