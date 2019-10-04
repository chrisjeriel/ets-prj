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
      //totalFlag:true,
      pageLength: 10,
      pageStatus: true,
      pagination: true,
      keys:['jvNo','jvDate','particulars','tranTypeName','refNo','preparedName','jvAmt']
  };

  dataInfo : any = {
    tranId: '',
    createUser:'',
    createDate:'',
    updateUser:'',
    updateDate:''
  }

  tranStat: string = 'new';

  constructor(private accountingService: AccountingService,private router: Router, private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-Service | Journal Voucher");
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
    //this.table.overlayLoader = true;
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
    });
  }

  onClickEdit(event){
    this.accountingService.jvFilter = this.tranStat;
    /*this.router.navigate(['/generate-jv-service',
      {jvType: this.type} 
      ], { skipLocationChange: true });*/
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

}
