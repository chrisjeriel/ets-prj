import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-acct-srvc-cancelled-transactions',
  templateUrl: './acct-srvc-cancelled-transactions.component.html',
  styleUrls: ['./acct-srvc-cancelled-transactions.component.css']
})
export class AcctSrvcCancelledTransactionsComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  passData: any = {
     tableData:[],
     tHeader: ['Tran Class', 'Ref. No.', 'Tran Date', 'Payee/Payor', 'Particulars', 'Cancelled By', 'Cancelled Date', 'Reason', 'Amount'],
     dataTypes: ['text', 'text', 'date', 'text', 'text', 'text', 'date', 'text', 'currency'],
     keys: ['tranClass', 'refNo', 'tranDate', 'payee','particulars','cancelledBy','cancelledDate','reason','amount'],
     nData: {
               createUser: this.ns.getCurrentUser(),
               createDate: '',
               updateUser: this.ns.getCurrentUser(),
               updateDate: ''
      },
      uneditable:[true,true,true,true,true,true,true],
      pageLength: 10,
      genericBtn: 'View Transaction Details',
      disableGeneric: true,
      paginateFlag:true,
      infoFlag:true
   };

  params :any ={
    tranId:'',
    tranClass:'',
    cancelFrom:'',
    cancelTo:''
  };

  tranId: any;
  tranClass: any;
  constructor(private titleService: Title, private accountingService: AccountingService, private route: Router, private ns: NotesService) { }


  ngOnInit() {
  	this.titleService.setTitle("Acct-Srvc | Cancelled Transactions");
    this.retrieveList();
  }

  retrieveList(){
    setTimeout(()=>{this.table.loadingFlag = true;});
    this.accountingService.getAcseCancelledTran(this.params.tranId,this.params.tranClass,this.params.cancelFrom,this.params.cancelTo).subscribe((data:any) => {
      console.log(data);
      this.passData.tableData = [];
      for (var i = 0; i < data.cancelledTran.length; i++) {
        this.passData.tableData.push(data.cancelledTran[i]);
      }
      this.table.loadingFlag = false;
      this.table.refreshTable();
    });
  }

  onClickSearch(){
    this.retrieveList();
  }

  onRowClick(data){
    if(data !== null){
      this.passData.disableGeneric = false;
      this.tranId = data.tranId;
      this.tranClass = data.tranClass;
    }else{
      this.passData.disableGeneric = true;
      this.tranId = '';
      this.tranClass = '';
    }
  }

  viewTranDetails(){
    if(this.tranClass == 'OR'){
      this.route.navigate(['accounting-service',{link:'/acct-srvc-inquiry-cncld-trans',tranId: this.tranId,from:'CancelledTran'}],{ skipLocationChange: true });
    }else if(this.tranClass == 'CV'){
      this.route.navigate(['generate-cv-service',{link:'/acct-srvc-inquiry-cncld-trans',tranId: this.tranId}],{ skipLocationChange: true });
    }else if(this.tranClass == 'JV'){
      this.route.navigate(['generate-jv-service',{link:'/acct-srvc-inquiry-cncld-trans',tranId: this.tranId}],{ skipLocationChange: true });
    }
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.route.navigateByUrl('');
      } 
  
  }
}
