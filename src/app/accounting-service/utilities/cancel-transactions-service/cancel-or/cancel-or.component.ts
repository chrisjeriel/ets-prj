import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancel-or',
  templateUrl: './cancel-or.component.html',
  styleUrls: ['./cancel-or.component.css']
})
export class CancelOrComponent implements OnInit {

   passDataOR : any = {
  	tableData: [
  		{
  			orNo: '',
  			payor: 'BPI/MS INSURANCE CORPORATION',
  			orDate: new Date('2018-10-01'),
  			paymentType: 'Official Receipt',
  			status: 'New',
  			particulars: 'Representing payment for premium of policy CAR-2018-00001-00-0001-000',
  			amount: 1642857.14
  		},
  		{
  			orNo: '',
  			payor: 'PNBGEN',
  			orDate: new Date('2018-10-01'),
  			paymentType: 'Official Receipt',
  			status: 'New',
  			particulars: 'Representing payment for premium of policy CAR-2018-00001-00-0001-000',
  			amount: 200000
  		},
  		{
  			orNo: 'VAT-000003',
  			payor: 'Charter Ping An',
  			orDate: new Date('2018-10-03'),
  			paymentType: 'Official Receipt',
  			status: 'Printed',
  			particulars: 'Representing claim recovery payment for Claim No CAR-2018-000001',
  			amount: 100000
  		},
  		{
  			orNo: 'VAT-000004',
  			payor: 'AXA',
  			orDate: new Date('2018-10-04'),
  			paymentType: 'Official Receipt',
  			status: 'Printed',
  			particulars: 'Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter',
  			amount: 1000000
  		},
  		{
  			orNo: '',
  			payor: 'Allied Bankers',
  			orDate: new Date('2018-10-04'),
  			paymentType: 'Official Receipt',
  			status: 'New',
  			particulars: 'Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter',
  			amount: 710716.12
  		},
  		{
  			orNo: '',
  			payor: 'Malayan',
  			orDate: new Date('2018-10-05'),
  			paymentType: 'Official Receipt',
  			status: 'New',
  			particulars: 'Representing payment for premium of policy CAR-2018-00001-00-0001-000',
  			amount: 756929
  		},
  		{
  			orNo: '',
  			payor: 'New India',
  			orDate: new Date('2018-10-07'),
  			paymentType: 'Official Receipt',
  			status: 'New',
  			particulars: 'Representing claim recovery payment for Claim No CAR-2018-000001',
  			amount: 30000
  		},
  		{
  			orNo: 'VAT-000008',
  			payor: 'BPI/MS INSURANCE CORPORATION',
  			orDate: new Date('2018-10-07'),
  			paymentType: 'Official Receipt',
  			status: 'Printed',
  			particulars: 'Representing claim recovery payment for Claim No CAR-2018-000001',
  			amount: 10000
  		},
  		{
  			orNo: 'VAT-000009',
  			payor: 'UCPBGEN',
  			orDate: new Date('2018-10-07'),
  			paymentType: 'Official Receipt',
  			status: 'Printed',
  			particulars: 'Representing payment for the Quarterly Statement of Account balance of BPI/MS for 3rd Quarter',
  			amount: 230000
  		},
  		{
  			orNo: '',
  			payor: 'FGIC',
  			orDate: new Date('2018-10-07'),
  			paymentType: 'Official Receipt',
  			status: 'New',
  			particulars: 'Representing payment for premium of policy CAR-2018-00001-00-0001-000',
  			amount: 1500000
  		}
  	],
  	tHeader:['OR No.','Payor','OR Date', 'Payment Type', 'Status', 'Particulars', 'Amount'],
  	dataTypes:['text','text','date','text','text','text','currency'],
  	uneditable:[true, true, true, true, true, true, true],
  	searchFlag: true,
  	infoFlag:true,
  	paginateFlag:true,
  	checkFlag:true,
  	widths:[1,210,1,1,1,'auto',105]

  }

  constructor() { }

  ngOnInit() {
  }

}
