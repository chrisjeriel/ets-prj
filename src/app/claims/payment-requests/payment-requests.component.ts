import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaimPaymentRequests } from  '@app/_models';
import { Router } from '@angular/router';
import { ClaimsService, NotesService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-payment-requests',
  templateUrl: './payment-requests.component.html',
  styleUrls: ['./payment-requests.component.css']
})
export class PaymentRequestsComponent implements OnInit {

  btnDisabled: boolean;
  btnDisabled_neg: boolean;
  tableData: any[] = [];
  allData: any[] = [];
  tHeader: any[] = [];
  resizables: boolean[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];
  pageLength: number;

   passData: any = {
     tableData: [], 
     tHeader: ['Claim No', 'Hist No.', 'Policy No', 'Payment Request No', 'Payee', 'Payment Type', 'Status', 'Curr', 'Amount', 'Particulars','Request Date','Requested By','Acct. Ref. No.','Acct. Tran. Date','Insured','Risk','Loss Date'],
     dataTypes: ['text','text','text','text','text','text','text','text','currency','text','date','text','text','date','text','text','date'],
     keys:['claimNo','histNo','policyNo','paytReqNo','payee','paymentType','status','currCd','reqAmount','particulars','reqDate','requestedBy','acctRefNo','tranDate','insuredDesc','riskName','lossDate'],
     uneditable:[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
     widths:[94,1,166,1],
    pageLength: 10,
    searchFlag:true,
    paginateFlag:true,
    pageInfoFlag:true
  }

  selected:any = null;

   @ViewChild('confirmation') confirmation;
   @ViewChild('inqTable') inqTable: CustEditableNonDatatableComponent;
   
  constructor(private claimsService: ClaimsService, private router: Router, private modalService: NgbModal, private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
  	this.btnDisabled = false;
  	this.btnDisabled_neg = true;
  	this.titleService.setTitle("Clm | Payment Request Inquiry");
  	this.getList();
  }

  getList(){
    this.claimsService.getClaimPaytReqInq(null).subscribe(a=>{
      this.passData.tableData = a['list'].map(b=>{
        b.reqDate = this.ns.toDateTimeString(b.reqDate);
        b.tranDate = this.ns.toDateTimeString(b.tranDate);
        b.lossDate = this.ns.toDateTimeString(b.lossDate);
        b.createDate = this.ns.toDateTimeString(b.createDate);
        b.updateDate = this.ns.toDateTimeString(b.updateDate);
        return b;
      });
      this.inqTable.refreshTable();
    })
  }

  open(content) {
        this.modalService.dismissAll();
        this.modalService.open(this.confirmation,  { centered: true, windowClass : 'modal-size'} );
    }


  toPaytReq(data){
    console.log(data)
    let line = data.policyNo.split('-')[0];
      this.router.navigate(
                      ['/claims-claim', {
                          from: 'edit',
                          readonly: true,
                          claimId: data.claimId,
                          claimNo: data.claimNo,
                          line: line,
                          exitLink: 'payment-request',
                          tab: 'paymentRequest',

                          clmStatus:data.clmStatus,
                          insuredDesc:data.insuredDesc,
                          policyId:data.policyId,
                          policyNo:data.policyNo,
                          projId:data.projId,
                          riskId:'',
                          riskName:data.riskName,
                      }],
                      { skipLocationChange: true }
        );
  }
}
