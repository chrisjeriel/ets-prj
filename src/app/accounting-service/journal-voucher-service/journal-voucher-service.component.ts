import { Component, OnInit, ViewChild} from '@angular/core';
import { AccountingService } from '../../_services';
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

  constructor(private accountingService: AccountingService,private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-Service | Journal Voucher");
    this.retrieveJVlist();
  }

  onClickAdd(event){
    this.router.navigate(['/generate-jv-service', {from: 'add',
                                           exitLink:'/journal-voucher'}], { skipLocationChange: true });
  }

  retrieveJVlist(){
    //this.table.overlayLoader = true;
    this.accountingService.getACSEJvList(null).subscribe((data:any) => {
      this.passDataJVListing.tableData = [];

      for(var i=0; i< data.jvList.length;i++){
        this.passDataJVListing.tableData.push(data.jvList[i]);
        this.passDataJVListing.tableData[this.passDataJVListing.tableData.length - 1].jvNo = String(data.jvList[i].jvYear) + '-' +  String(data.jvList[i].jvNo);
      }

      /*this.passDataJVListing.tableData.forEach(a => {
        if(a.transactions.tranStat != 'O' && a.transactions.tranStat != 'C') {
          a.jvStatus = a.transactions.tranStat;
          a.jvStatusName = a.transactions.tranStatDesc;
        }
      });*/

      //this.passDataJVListing.tableData = this.passDataJVListing.tableData.filter(a => String(a.jvStatusName).toUpperCase() == this.tranStat.toUpperCase());
      this.table.refreshTable();
    });
  }

  onClickEdit(event){
    /*this.router.navigate(['/generate-jv-service',
      {jvType: this.type} 
      ], { skipLocationChange: true });*/
  }

  onRowClick(data){
      this.type = data.jvType;
      this.status = data.jvStatus;
      this.routeData = data;
      if(data.jvStatus == 'Printed' || data.jvStatus == 'Cancelled'){
        this.passDataJVListing.btnDisabled = true;
      }else{
        this.passDataJVListing.btnDisabled = false; 
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
    console.log(event)
    this.router.navigate(['generate-jv-service', { tranId     : event.tranId,
                                                   from       : 'jv-listing', 
                                                   exitLink   : '/journal-voucher-service'}], 
                                                  { skipLocationChange: true });
  }

}
