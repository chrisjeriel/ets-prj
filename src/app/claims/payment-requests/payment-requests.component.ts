import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaimPaymentRequests } from  '@app/_models';
import { Router } from '@angular/router';
import { ClaimsService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

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
   tHeader: ['Claim No', 'Insured', 'Ceding Company', 'Hist No', 'Amount Type', 'History Type', 'Curr', 'Amount'],
   dataTypes: ["text","text","text","number","text","text","text","currency"],
   resizable: [true, true, true, false, true, true, false, true],
   filters: [
            {
                key: 'ClaimNo',
                title:'Claim No.',
                dataType: 'text'
            },
            {
                key: 'insured',
                title:'Insured',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title:'Ceding Company',
                dataType: 'text'
            },
            {
                key: 'histNo',
                title:'Hist No',
                dataType: 'text'
            },
            {
                key: 'amtType',
                title:'Amount Type',
                dataType: 'text'
            },
            {
                key: 'histType',
                title:'History Type',
                dataType: 'text'
            },
            {
                key: 'curr',
                title:'Curr',
                dataType: 'text'
            },
            {
                key: 'amount',
                title:'Amount',
                dataType: 'text'
            },
        ],
        pageLength: 10,
        expireFilter: false, checkFlag: true, tableOnly: false, fixedCol: false, printBtn: false, 
  }

   @ViewChild('confirmation') confirmation;
   
  constructor(private claimsService: ClaimsService, private router: Router, private modalService: NgbModal, private titleService: Title) { }

  ngOnInit() {
  	this.btnDisabled = false;
  	this.btnDisabled_neg = true;
  	this.titleService.setTitle("Clm | Payment Requests");
  	this.passData.tableData = this.claimsService.getClaimPaymentRequestList();
  }

  open(content) {
        this.modalService.dismissAll();
        this.modalService.open(this.confirmation,  { centered: true, windowClass : 'modal-size'} );
    }
}
