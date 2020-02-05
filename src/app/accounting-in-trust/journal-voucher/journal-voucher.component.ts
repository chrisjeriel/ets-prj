import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingService,NotesService, UserService } from '../../_services';
import { Title } from '@angular/platform-browser';
import { Router, NavigationExtras } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.css']
})
export class JournalVoucherComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @ViewChild(LoadingTableComponent) table2: LoadingTableComponent;

  private routeData: any;

  passDataJVListing: any = {
      tableData: [],
      tHeader: ["JV No", "JV Date","Particulars","JV Type", "JV Ref. No.", "Prepared By","Amount"],
      sortKeys: ['JV_NO2', 'JV_DATE', 'PARTICULARS', 'TRAN_TYPE', 'REFNO', 'PREPARED_NAME', 'JV_AMT'],
      dataTypes: ['text','date','text','text','text','text','currency',],
      filters: [
      {
        key: 'jvNo',
        title: 'J.V. No.',
        dataType: 'text'
      },
      {
        keys: {
            from: 'jvDateFrom',
            to: 'jvDateTo'
          },
          title: 'JV Date',
          dataType: 'datespan'
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
      {
        keys: {
            from: 'jvAmtFrom',
            to: 'jvAmtTo'
          },
          title: 'Amount',
          dataType: 'textspan'
      }
    ],
      addFlag:true,
      editFlag:true,
      disableEdit:true,
      //totalFlag:true,
      pageLength: 10,
      pageStatus: true,
      pagination: true,
      exportFlag: true,
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
    searchParams: any = {
      'paginationRequest.count': 10,
      'paginationRequest.position': 1
    };

  constructor(private accountingService: AccountingService,private router: Router, private titleService: Title, private ns : NotesService, private userService: UserService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Journal Voucher");
    this.userService.emitModuleId("ACIT031");
    this.accountingService.arFilter = '';
    this.accountingService.cvFilter = '';
    this.accountingService.prqFilter = '';

    if(this.accountingService.jvFilter != '') {
      this.tranStat = this.accountingService.jvFilter;
    }

    setTimeout(() => {
      this.table.refreshTable();
      this.searchParams.recount = 'Y';
      this.retrieveJVlist();
    }, 0);
  }

  retrieveJVlist(){
    switch(this.tranStat) {
      case 'new':
        this.searchParams['tranStat'] = '';
        this.searchParams['jvStat'] = 'N';

        break;
      case 'for approval':
        this.searchParams['tranStat'] = '';
        this.searchParams['jvStat'] = 'F';

        break;
      case 'approved':
        this.searchParams['tranStat'] = '';
        this.searchParams['jvStat'] = 'A';

        break;
      case 'closed':
        this.searchParams['jvStat'] = '';
        this.searchParams['tranStat'] = 'C';

        break;
      case 'printed':
        this.searchParams['tranStat'] = '';
        this.searchParams['jvStat'] = 'P';

        break;
      case 'posted':
        this.searchParams['jvStat'] = '';
        this.searchParams['tranStat'] = 'P';

        break;
      case 'deleted':
        this.searchParams['jvStat'] = '';
        this.searchParams['tranStat'] = 'D';
    }

    /*if(this.table2 != undefined)
        this.table2.lengthFirst = false;
    if(this.searchParams.recount != 'N'){
      this.accountingService.getJVListingLength(this.searchParams).subscribe(data=>{
        this.passDataJVListing.count = data;
        console.log(data)
        this.table2.setLength(1);
      })
      this.searchParams.recount = 'N';
    }

    this.table2.overlayLoader = true;*/
    this.table.overlayLoader = true;
    this.accountingService.getJVListing(this.searchParams).subscribe((data:any) => {
      var rec = data.transactions;

      /*this.table2.placeData(rec.map(a => {
        a.jvListings.jvNo = String(a.jvListings.jvYear) + '-' + String(a.jvListings.jvNo);
        a.jvListings.transactions = a;
        return a.jvListings;
      }), 1);*/

      this.passDataJVListing.tableData = [];
      this.passDataJVListing.tableData = rec.map(a => {
        a.jvListings.jvNo = String(a.jvListings.jvYear) + '-' + String(a.jvListings.jvNo);
        a.jvListings.transactions = a;
        return a.jvListings;
      });
      this.table.refreshTable();
      this.table.filterDisplay(this.table.filterObj, this.table.searchString);
    });
  }

  onDblClick(data){
  }

  onClickAdd(event){
    this.accountingService.jvFilter = this.tranStat;
    this.router.navigate(['/generate-jv', {from: 'add',
                                             exitLink:'/journal-voucher'}], { skipLocationChange: true }); 
  }

  onClickEdit(event){
    this.accountingService.jvFilter = this.tranStat;
    this.router.navigate(['/generate-jv', { tranId            : this.dataInfo.tranId,
                                                tranTypeCd        : this.dataInfo.trantypeCd,
                                                closeDateTran     : this.dataInfo.transactions.closeDate === null ? '' : this.dataInfo.transactions.closeDate, 
                                                createDateTran    : this.dataInfo.transactions.createDate, 
                                                createUserTran    : this.dataInfo.transactions.createUser, 
                                                deleteDateTran    : this.dataInfo.transactions.deleteDate  === null ? '' : this.dataInfo.transactions.deleteDate,
                                                postDateTran      : this.dataInfo.transactions.postDate  === null ? '' : this.dataInfo.transactions.postDate, 
                                                tranClassTran     : this.dataInfo.transactions.tranClass, 
                                                tranClassNoTran   : this.dataInfo.transactions.tranClassNo, 
                                                tranDateTran      : this.dataInfo.transactions.tranDate, 
                                                tranIdTran        : this.dataInfo.transactions.tranId, 
                                                tranStatTran      : this.dataInfo.transactions.tranStat, 
                                                tranYearTran      : this.dataInfo.transactions.tranYear, 
                                                updateDateTran    : this.dataInfo.transactions.updateDate, 
                                                updateUserTran    : this.dataInfo.transactions.updateUser, 
                                                from              : 'jv-listing', 
                                                exitLink          : '/journal-voucher'}], 
                                              { skipLocationChange: true });
  }

  toGenerateJVEdit(event) {
    this.accountingService.jvFilter = this.tranStat;
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

  export(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'JournalVoucherList_'+currDate+'.xls'

    var mystyle = {
      headers:true, 
      column: {style:{Font:{Bold:"1"}}}
    };

    alasql.fn.datetime = function(dateStr) {
      var date = new Date(dateStr);
      return date.toLocaleString();
    };

    alasql('SELECT jvNo AS [J.V. No], datetime(jvDate) AS [J.V. Date], particulars AS Particulars, tranTypeName AS [JV Type], refNo AS [JV Ref. No.], preparedName AS [Prepared By],jvAmt AS Amount INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passDataJVListing.tableData]);
  }

  searchQuery(data) {
    /*for(let key of Object.keys(data)) {
      this.searchParams[key] = data[key];
    }*/

    data.forEach(a => {
      this.searchParams[a.key] = a.search;
    });

    this.retrieveJVlist();
  }

  onChangeRadioStatus() {
    this.searchParams.recount = 'Y';
    this.searchParams['paginationRequest.position'] = 1;
    delete this.searchParams['length'];

    this.retrieveJVlist();
  }

}
