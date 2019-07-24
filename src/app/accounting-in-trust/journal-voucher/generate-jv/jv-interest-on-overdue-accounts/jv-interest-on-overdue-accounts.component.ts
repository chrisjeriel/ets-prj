import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInterestOverdue} from '@app/_models';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'

@Component({
  selector: 'app-jv-interest-on-overdue-accounts',
  templateUrl: './jv-interest-on-overdue-accounts.component.html',
  styleUrls: ['./jv-interest-on-overdue-accounts.component.css']
})


export class JvInterestOnOverdueAccountsComponent implements OnInit {
  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @Input() tranId:any;

  passData: any = {
    tableData: [],
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.', 'Eff Date','Due Date','No. of Days Overdue','Curr','Curr Rate','Premium',"Overdue Interest"],
    resizable: [true, true, true, true, true, true, true, true, true,true,true],
    dataTypes: ['text','text','text','number','date','date','number','text','percent','currency','currency'],
    nData: new AccJvInterestOverdue(null,null,null,null,new Date(),new Date(),null,null,null,null,null),
    total:[null,null,null,null,null,null,null,null,'Total','premium','overdueInt'],
    magnifyingGlass: ['soaNo'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 10,
    widths: [180,180,120,1,1,1,1,1,85,120,120]
  };

  jvDetails: any = {
    cedingName: ''
  }

  constructor(private accountingService: AccountingService,private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
  }

  checkCode(ev){
     this.ns.lovLoader(ev, 1);
     this.cedingCoLov.checkCedingCo(this.jvDetails.ceding, ev);
    
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    console.log(data)
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    console.log(this.jvDetails.ceding);
  }
}
