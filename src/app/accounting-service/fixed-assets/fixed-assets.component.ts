import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fixed-assets',
  templateUrl: './fixed-assets.component.html',
  styleUrls: ['./fixed-assets.component.css']
})
export class FixedAssetsComponent implements OnInit {

  fixedAssetDetailsData: any = {
  	tableData: this.accountingService.getAccountingSFixedAssets(),
  	tHeader: ['Type', 'Prop No.', 'Description', 'Location', 'User', 'Acquisition Date', 'Acquisition Cost', 'Depreciation Method', 'No. Of Month', 'Monthly Depreciation', 'Accum Depreciation', 'Accum As Of', 'Disposal Date', 'Disposal Value'],
  	dataTypes: ['text', 'number', 'text', 'text', 'text', 'date', 'currency', 'text', 'number', 'currency', 'currency', 'date', 'date', 'text'],
  	filters: [
  		{
            key: 'type',
            title:'Type',
            dataType: 'text'
        },
        {
            key: 'propNo',
            title:'Prop No.',
            dataType: 'text'
        },
        {
            key: 'description',
            title:'Description',
            dataType: 'text'
        },
        {
            key: 'location',
            title:'Location',
            dataType: 'text'
        },
        {
            key: 'user',
            title:'User',
            dataType: 'text'
        },
        {
            key: 'acquisitionDate',
            title:'Acquisition Date',
            dataType: 'date'
        },
        {
            key: 'acquisitionCost',
            title:'Acquisition Cost',
            dataType: 'text'
        },
        {
            key: 'depreciationMethod',
            title:'Dep. Method',
            dataType: 'text'
        },
        {
            key: 'noOfMonth',
            title:'No. of Month',
            dataType: 'text'
        },
        {
            key: 'monthlyDepreciation',
            title:'Monthly Dep.',
            dataType: 'text'
        },
        {
            key: 'accumulatedDepreciation',
            title:'Accum Dep.',
            dataType: 'text'
        },
        {
            key: 'accumulatedAsOf',
            title:'Accum As Of',
            dataType: 'date'
        },
        {
            key: 'disposalDate',
            title:'Disposal Date',
            dataType: 'date'
        },
        {
            key: 'disposalValue',
            title:'Disposal Value',
            dataType: 'text'
        },
  	],
  	addFlag: true,
  	deleteFlag: true,
  	saveFlag: true,
  	printBtn: true,
  	pagination: true,
  	pageStatus: true,
  	pageId: 1,
  	pageLength: 20,
    colSize: [''],
  	keys: ['type', 'propNo', 'description', 'location','user', 'acquisitionDate', 'acquisitionCost', 'depreciationMethod', 'noOfMonth', 'monthlyDepreciation', 'accumulatedDepreciation', 'accumulatedAsOf', 'disposalDate', 'disposalValue'],
  }

  monthlyDepreciationDetails: any = {
  	tableData: this.accountingService.getAccountingSMonthlyDepreciationDetails(),
  	tHeader: ['Asset Description', 'Month End.', 'Depreciation Amount', 'Reference No.', ],
  	dataTypes: ['text', 'date', 'currency', 'text',],
  	filters: [
  		{
            key: 'assetDescription',
            title:'Asset Desc.',
            dataType: 'text'
        },
        {
            key: 'monthEnd',
            title:'Month End',
            dataType: 'text'
        },
        {
            key: 'depreciationAmount',
            title:'Dep. Amount',
            dataType: 'text'
        },
        {
            key: 'referenceNo',
            title:'Reference No.',
            dataType: 'text'
        },
  	],
  	addFlag: true,
  	deleteFlag: true,
  	saveFlag: true,
  	printBtn: true,
  	pagination: true,
  	pageStatus: true,
  	pageId: 2,
  	pageLength: 20,
    colSize: ['', '50px', '100px', '250px'],
  	keys: ['assetDescription', 'monthEnd', 'depreciationAmount', 'referenceNo',],
  }

  constructor(private accountingService: AccountingService, private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
	if ($event.nextId === 'Exit') {
		this.router.navigateByUrl('');
	} 

  }

}
