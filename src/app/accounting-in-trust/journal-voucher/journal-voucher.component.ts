import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingService,NotesService } from '../../_services';
import { Title } from '@angular/platform-browser';
import { Router, NavigationExtras } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.css']
})
export class JournalVoucherComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

  private routeData: any;

  passDataJVListing: any = {
      tableData: [],
      tHeader: ["JV No", "JV Date","Particulars","JV Type", "JV Ref. No.", "Prepared By","Amount"],
      dataTypes: ['text','date','text','text','text','text','currency',],
       filters: [
      {
        key: 'jvNo',
        title: 'J.V. No.',
        dataType: 'text'
      },
      {
        key: 'jvDate',
        title: 'JV Date',
        dataType: 'date'
      },
      {
        key: 'particulars',
        title: 'Particulars',
        dataType: 'text'
      },
      {
        key: 'jvType',
        title: 'J.V Type',
        dataType: 'text'
      },
      {
        key: 'jvRefNo',
        title: 'J.V Ref No',
        dataType: 'text'
      },
      {
        key: 'preparedBy',
        title: 'Prepared By',
        dataType: 'text'
      },
      /*{
        key: 'jvStatus',
        title: 'J.V Status',
        dataType: 'text'
      },*/
      {
        key: 'amount',
        title: 'Amount',
        dataType: 'text'
      }
    ],
      addFlag:true,
      editFlag:true,
      disableEdit:true,
      //totalFlag:true,
      pageLength: 10,
      pageStatus: true,
      pagination: true,
      keys:['jvNo','jvDate','particulars','tranTypeName','refNo','preparedName','jvAmt'],
      uneditable:[true,true,true,true,true,true,true],
      colSize: ['120px','98px','171px','335px','110px','118px','115px'],
    };

    dataInfo : any = {
      tranId: '',
      createUser:'',
      createDate:'',
      updateUser:'',
      updateDate:''
    }

    tranStat: string = 'new';

  constructor(private accountingService: AccountingService,private router: Router, private titleService: Title, private ns : NotesService) { }

  ngOnInit() {
     this.titleService.setTitle("Acct-IT | Journal Voucher");

    setTimeout(() => {
      this.table.refreshTable();
      this.retrieveJVlist();
    }, 0);
  }

  retrieveJVlist(){
    this.table.overlayLoader = true;
    this.accountingService.getJVListing(null).subscribe((data:any) => {
      this.passDataJVListing.tableData = [];

      for(var i=0; i< data.transactions.length;i++){
        this.passDataJVListing.tableData.push(data.transactions[i].jvListings);
        this.passDataJVListing.tableData[this.passDataJVListing.tableData.length - 1].jvNo = String(data.transactions[i].jvListings.jvYear) + '-' +  String(data.transactions[i].jvListings.jvNo).padStart(8,'0');
        this.passDataJVListing.tableData[this.passDataJVListing.tableData.length - 1].transactions = data.transactions[i];
      }

      this.passDataJVListing.tableData.forEach(a => {
        if(a.transactions.tranStat != 'O') {
          a.jvStatus = a.transactions.tranStat;
          a.jvStatusName = a.transactions.tranStatDesc;
        }
      });

      this.passDataJVListing.tableData = this.passDataJVListing.tableData.filter(a => String(a.jvStatusName).toUpperCase() == this.tranStat.toUpperCase());
      this.table.refreshTable();
    });
  }

  onDblClick(data){
  }

  onClickAdd(event){
      this.router.navigate(['/generate-jv', {from: 'add',
                                             exitLink:'/journal-voucher'}], { skipLocationChange: true }); 
  }

  onClickEdit(event){
      this.router.navigate(['/generate-jv']); 
  }

  toGenerateJVEdit(event) {
    this.router.navigate(['/generate-jv', { tranId            : event.tranId,
                                            tranTypeCd        : event.trantypeCd,
                                            closeDateTran     : event.transactions.closeDate, 
                                            createDateTran    : event.transactions.createDate, 
                                            createUserTran    : event.transactions.createUser, 
                                            deleteDateTran    : event.transactions.deleteDate,
                                            postDateTran      : event.transactions.postDate, 
                                            tranClassTran     : event.transactions.tranClass, 
                                            tranClassNoTran   : event.transactions.tranClassNo, 
                                            tranDateTran      : event.transactions.tranDate, 
                                            tranIdTran        : event.transactions.tranId, 
                                            tranStatTran      : event.transactions.tranStat, 
                                            tranYearTran      : event.transactions.tranYear, 
                                            updateDateTran    : event.transactions.updateDate, 
                                            updateUserTran    : event.transactions.updateUser, 
                                            from              : 'jv-listing', 
                                            exitLink          : '/journal-voucher'}], 
                                          { skipLocationChange: true });
  }

  onRowClick(data){
    if(data != null){
      this.dataInfo            = data;
      this.dataInfo.tranId     = data.tranId;
      this.dataInfo.createUser = data.createUser;
      this.dataInfo.createDate = this.ns.toDateTimeString(data.createDate);
      this.dataInfo.updateUser = data.updateUser;
      this.dataInfo.updateDate = this.ns.toDateTimeString(data.updateDate);
      this.passDataJVListing.disableEdit = false;
    }else{
      this.dataInfo.createUser = '';
      this.dataInfo.createDate = '';
      this.dataInfo.updateUser = '';
      this.dataInfo.updateDate = '';
    }
  }
}
