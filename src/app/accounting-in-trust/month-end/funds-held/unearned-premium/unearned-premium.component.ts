import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, MaintenanceService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-unearned-premium',
  templateUrl: './unearned-premium.component.html',
  styleUrls: ['./unearned-premium.component.css']
})
export class UnearnedPremiumComponent implements OnInit {

  @ViewChild('perLineTable') perLineTable:CustNonDatatableComponent;
  @ViewChild('perPolTable') perPolTable:CustNonDatatableComponent;
  passData: any = {
  	tHeader: ['Line', 'Premium', 'Deferred Premium', 'Prev. Deferred Premium','Deferred Difference'],
  	tableData: [],
  	dataTypes: ['text','currency','currency','currency','currency'],
    keys: ['lineCd','premGross','defPremGross','prevDefPremGross','defDiff'],
  	pageStatus: true,
    pagination: true,
    pageLength: 10,
    pageID: 1
  }

  detailsPerPolicy: any = {
  	tHeader: ['Policy No.', 'Effective Date', 'Expiry Date', 'Numerator', 'Denominator', 'Premium','Deferred Premium'],
  	tableData: [],
  	dataTypes: ['text','date','date','number','number','currency','currency'],
    keys:['policyNo','effDate','expiryDate','numeratorFactor','denominatorFactor','premGross','defPremGross'],
  	pageStatus: true,
    pagination: true,
    colSize: ['', '', '', '90px', '90px', '150px', '150px'],
    pageID: 2
  }

  accountingEntries: any = {
  	tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
  	tableData: [],
  	dataTypes: ['text','text','text','text','currency','currency'],
  	pageStatus: true,
    pagination: true,
    total: [null,null,null,'Total','debit','credit'],
    colSize: ['100px', '200px', '150px', '250px', '120px', '120px'],
  }

  @Input()params :any = {
    extMm :'8',
    extYear :'2019',
    extMethod :'1',
    cedingId :''
  };

  detailsList:any;
  companyList:any[] = [];
  indvSelect:any = null;
  lineDesc:any = '';

  yearList:any[] = [];
  methodList:any[] = [];

  constructor(private modalService: NgbModal, private as:AccountingService, private ms:MaintenanceService) { }

  ngOnInit() {
    let currYear = new Date().getFullYear();
    for (var i = 2015; i<= currYear+3; i++) {
      this.yearList.push(i);
    }
    this.params.cedingId = '';
    this.getUPRMethods();
    this.getCompanyList();
    this.getUPR();
    setTimeout(a=>this.perLineTable.refreshTable())
  }

  openDetailsPerPolicy() {
    this.perPolTable.refreshTable();
  	$('#detailsPerPolicy > #modalBtn').trigger('click');
  }

  openAccountingEntries(){
  	$('#accountingEntries > #modalBtn').trigger('click');
  }

  getCompanyList(){
    this.ms.getCedingCompanyList([]).subscribe(a=>{
      this.companyList = a['cedingcompany'].filter(a=>a.membershipTag== 'Y' || a.treatyTag=='Y');
    })
  }

  getUPRMethods(){
    this.ms.getRefCode('UPR_METHOD').subscribe(a=>{
      this.methodList = a['refCodeList'];
    })
  }

  getUPR(){
    $('.globalLoading').css('display','block');
    this.as.getUPRPerCede(this.params).subscribe(a=>{
      this.passData.tableData = a['perLine'];
      this.detailsList = a['perPol']
      this.perLineTable.refreshTable();
      $('.globalLoading').css('display','none');
    })
  }

  updateDetails(data){
    if(Object.keys(data).length != 0){
      this.detailsPerPolicy.tableData = this.detailsList.filter(a=>a.lineCd == data.lineCd);
      this.ms.getLineLOV(data.lineCd).subscribe(a=>{
        this.lineDesc = a['line'][0].description;
      })
      this.indvSelect = data;
    }else{
      this.indvSelect = null;
    }
  }
}
