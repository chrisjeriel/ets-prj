import { Component, OnInit } from '@angular/core';
import { ClaimPaymentRequests } from  '@app/_models';
import { Router } from '@angular/router';
import { ClaimsService } from '../../_services';
@Component({
  selector: 'app-payment-requests',
  templateUrl: './payment-requests.component.html',
  styleUrls: ['./payment-requests.component.css']
})
export class PaymentRequestsComponent implements OnInit {

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

  constructor(private claimsService: ClaimsService, private router: Router) { }

  ngOnInit() {

  	this.passData.tableData = this.claimsService.getClaimPaymentRequestList();

  }

}
