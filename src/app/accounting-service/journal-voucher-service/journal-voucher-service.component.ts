import { Component, OnInit, ViewChild} from '@angular/core';
import { AccountingService, NotesService } from '../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-journal-voucher-service',
  templateUrl: './journal-voucher-service.component.html',
  styleUrls: ['./journal-voucher-service.component.css']
})
export class JournalVoucherServiceComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  private routeData: any;
  type: string="";
  status: string="";

  passDataJVListing: any = {
      tableData: [],
      tHeader: ["JV No", "JV Date","Particulars","JV Type", "JV Ref. No.", "Prepared By","Amount"],
      dataTypes: ['text','date','text','text','text','text','currency',],
      addFlag:true,
      editFlag:true,
      pageLength: 10,
      pageStatus: true,
      pagination: true,
      exportFlag   : true,
      keys:['jvNo','jvDate','particulars','tranTypeName','refNo','preparedName','jvAmt'],
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

  constructor(private accountingService: AccountingService,private router: Router, private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
    /*this.titleService.setTitle("Acct-Service | Journal Voucher");*/
    this.accountingService.arFilter = '';
    this.accountingService.cvFilter = '';
    this.accountingService.prqFilter = '';

    if(this.accountingService.jvFilter != '') {
      this.tranStat = this.accountingService.jvFilter;
    }

    setTimeout(() => {
      this.table.refreshTable();
      this.retrieveJVlist();
    }, 0);
  }

  onClickAdd(event){
    this.accountingService.jvFilter = this.tranStat;
    this.router.navigate(['/generate-jv-service', {from: 'add',
                                           exitLink:'/journal-voucher-service'}], { skipLocationChange: true });
  }

  retrieveJVlist(){
    /*this.table.overlayLoader = true;
    this.accountingService.getACSEJvList(null).subscribe((data:any) => {
      this.passDataJVListing.tableData = [];

      for(var i=0; i< data.jvList.length;i++){
        this.passDataJVListing.tableData.push(data.jvList[i]);
        this.passDataJVListing.tableData[this.passDataJVListing.tableData.length - 1].jvNo = String(data.jvList[i].jvYear) + '-' +  String(data.jvList[i].jvNo);
      }

      this.passDataJVListing.tableData.forEach(a => {
        if(a.tranStat != 'O' && a.tranStat != 'C') {
          a.jvStatus = a.jvStatus;
          a.statusName = a.statusName;
        }
      });

      this.passDataJVListing.tableData = this.passDataJVListing.tableData.filter(a => String(a.statusName).toUpperCase() == this.tranStat.toUpperCase());
      this.table.refreshTable();

      this.table.filterDisplay(this.table.filterObj, this.table.searchString);
    });*/

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
        
        break;
    }

    this.table.overlayLoader = true;
    this.accountingService.getACSEJvList(this.searchParams).subscribe((data:any) => {
      this.passDataJVListing.tableData = [];

      /*for(var i=0; i< data.jvList.length;i++){
        this.passDataJVListing.tableData.push(data.jvList[i]);
        this.passDataJVListing.tableData[this.passDataJVListing.tableData.length - 1].jvNo = String(data.jvList[i].jvYear) + '-' +  String(data.jvList[i].jvNo);
      }*/

      this.passDataJVListing.tableData = data.jvList.map(a => {
        a.jvNo = String(a.jvYear) + '-' + String(a.jvNo);

        if(a.tranStat != 'O' && a.tranStat != 'C') {
          a.jvStatus = a.jvStatus;
          a.statusName = a.statusName;
        }

        return a;
      });

      this.table.refreshTable();
      this.table.filterDisplay(this.table.filterObj, this.table.searchString);
    });
  }

  onClickEdit(event){
    this.accountingService.jvFilter = this.tranStat;
    this.router.navigate(['generate-jv-service', { tranId     : this.dataInfo.tranId,
                                                   from       : 'jv-listing', 
                                                   exitLink   : '/journal-voucher-service'}], 
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

  onRowDblClick(data) {
    if (this.type == null || this.type == 'undefined'){
    } else {
        if(this.status == 'Printed' ||this.status == 'Cancelled'){
           this.router.navigate(['/journal-voucher-service'], { skipLocationChange: true });
       } else {
           this.router.navigate(['/generate-jv-service', {jvType: this.type}], { skipLocationChange: true });
       }
    }
  }

  toGenerateJVEdit(event) {
    this.accountingService.jvFilter = this.tranStat;
    this.router.navigate(['generate-jv-service', { tranId     : event.tranId,
                                                   from       : 'jv-listing', 
                                                   exitLink   : '/journal-voucher-service'}], 
                                                  { skipLocationChange: true });
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
    data.forEach(a => {
      this.searchParams[a.key] = a.search;
    });

    this.retrieveJVlist();
  }

}
