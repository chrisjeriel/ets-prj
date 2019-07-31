import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { AccountingService, NotesService } from '@app/_services';

@Component({
  selector: 'app-acct-ar-listings',
  templateUrl: './acct-ar-listings.component.html',
  styleUrls: ['./acct-ar-listings.component.css']
})
export class AcctArListingsComponent implements OnInit {

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  passData: any = {
    tableData: [],
    tHeader: ['A.R. No.','Payor','AR Date','Payment Type','Status','Particulars','Amount'],
    dataTypes: ['sequence-6','text','date','text','text','text','currency'],
    keys: ['arNo', 'payor', 'arDate', 'tranTypeName', 'arStatDesc', 'particulars', 'arAmt'],
    colSize:['25px', '80px', '40px', '100px', '1px', '200px', '125px'],
    filters: [
        {
          key: 'arNo',
          title: 'A.R. No.',
          dataType: 'text'
        },
        {
          key: 'payor',
          title: 'Payor',
          dataType: 'text'
        },
        {
          keys: {
            from: 'arDateFrom',
            to: 'arDateTo'
          },
          title: 'AR Date',
          dataType: 'datespan'
        },
        {
          key: 'tranTypeName',
          title: 'Payment Type',
          dataType: 'text'
        },
        {
          key: 'arStatDesc',
          title: 'Status',
          dataType: 'text'
        },
        {
          key: 'particulars',
          title: 'Particulars',
          dataType: 'text'
        },
        {
          keys: {
            from: 'arAmtFrom',
            to: 'arAmtTo'
          },
          title: 'Amount',
          dataType: 'textspan'
        }
    ],
    pageLength: 10,
    pageStatus: true,
    pagination: true,
    addFlag: true,
    editFlag: true,
    pageID: 1,
    btnDisabled: true
  }

  record: any = {
      arNo: null,
      payor: null,
      arDate: null,
      paymentType: null,
      status: null,
      particulars: null,
      amount: null
    }

  searchParams: any[] = [];
  selected: any;
  otherInfo: any = {
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: ''
  }

  constructor(private router: Router,private titleService: Title, private as: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Acknowledgement Receipt");
    this.retrieveArList();
  }

  retrieveArList(){
    this.as.getArList(this.searchParams).subscribe(
      (data: any)=>{
        if(data.ar.length !== 0){
          this.passData.tableData = data.ar;
          this.table.refreshTable();
        }
      },
      (error)=>{
        this.passData.tableData = [];
        this.table.refreshTable();
      }
    )
  }

  searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        //this.passData.btnDisabled = true;
        this.passData.btnDisabled = true;
        this.retrieveArList();

   }

  toGenerateARAdd() {
  	this.router.navigate(['/accounting-in-trust', { action: 'add' }], { skipLocationChange: true });
  }

  toGenerateAREdit(data) {
    console.log(data);
    this.record = {
      tranId: data.tranId,
      arNo: data.arNo,
      payor: data.payor,
      arDate: data.arDate,
      paymentType: data.tranTypeName,
      status: data.arStatDesc,
      particulars: data.particulars,
      amount: data.arAmt
    }

    this.router.navigate(['/accounting-in-trust', { slctd: JSON.stringify(this.record), action: 'edit' }], { skipLocationChange: true });
  }

  onRowClick(data){
    if(data === null || (data !== null && Object.keys(data).length === 0)){
      this.otherInfo.createUser = '';
      this.otherInfo.createDate = '';
      this.otherInfo.updateUser = '';
      this.otherInfo.updateDate = '';
      this.selected = {};
    }else{
      this.selected = data;
      this.otherInfo.createUser = this.selected.createUser;
      this.otherInfo.createDate = this.ns.toDateTimeString(this.selected.createDate);
      this.otherInfo.updateUser = this.selected.updateUser;
      this.otherInfo.updateDate = this.ns.toDateTimeString(this.selected.updateDate);
    }
    
  }
}