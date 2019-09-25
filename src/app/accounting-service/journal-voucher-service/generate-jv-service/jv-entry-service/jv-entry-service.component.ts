import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService } from '@app/_services'; 
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-jv-entry-service',
  templateUrl: './jv-entry-service.component.html',
  styleUrls: ['./jv-entry-service.component.css']
})
export class JvEntryServiceComponent implements OnInit {
   
  @Input() data: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  entryData:any = {
    jvYear:'',
    jvNo: '',
    status: '',
    autoTag:'',
    refNo:'',
    refNoDate:'',
    jvType: '',
    particulars: '',
    currencyCd:'',
    jvAmt:'',
    localAmt:'',
    preparedBy:'',
    preparedDate:'',
    approvedBy:'',
    approvedDate:''
  }

  jvDatas: any = {
    closeDate : '', 
    createDate : '', 
    createUser : '', 
    deleteDate : '',   
    postDate : '', 
    tranClass : '', 
    tranClassNo : '', 
    tranDate : '', 
    tranId : '', 
    tranStat : '', 
    tranYear : '', 
    updateDate : '', 
    updateUser : '', 
  }

  approvedStat: boolean = false;
  constructor(private titleService: Title, private ns: NotesService, private decimal : DecimalPipe, private accountingService: AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Acc-Service | Journal Voucher");
  }

  tabController(event) {
  	this.onChange.emit(this.data);
  }

  newJV(){
    this.getDefName();
    setTimeout(() => {
        this.jvDatas.closeDate = null; 
        this.jvDatas.createDate = this.ns.toDateTimeString(0)
        this.jvDatas.createUser =  this.ns.getCurrentUser();
        this.jvDatas.deleteDate = null;
        this.jvDatas.postDate = null;
        this.jvDatas.tranClass = 'JV'; 
        this.jvDatas.tranTypeCd = null; 
        this.jvDatas.tranClassNo = null; 
        this.jvDatas.tranDate = this.ns.toDateTimeString(0), 
        this.jvDatas.tranId = null; 
        this.jvDatas.tranStat = 'O'; 
        this.jvDatas.tranYear = null;
        this.jvDatas.updateDate = this.ns.toDateTimeString(0), 
        this.jvDatas.updateUser = this.ns.getCurrentUser();

        this.entryData.jvYear = '';
        this.entryData.jvNo =  '';
        this.entryData.jvStatus =  'N';
        this.entryData.jvStatusName =  'New';
        this.entryData.tranTypeName = '';
        this.entryData.jvDate = this.ns.toDateTimeString(0);
        this.entryData.autoTag = 'N';
        this.entryData.refNo = '';
        this.entryData.refnoTranId = '';
        this.entryData.refNoDate = '';
        this.entryData.jvType =  '';
        this.entryData.particulars =  '';
        this.entryData.currCd = 'PHP';
        this.entryData.currRate = 1;
        this.entryData.jvAmt = 0;
        this.entryData.localAmt = 0;
        this.entryData.preparedBy = this.ns.getCurrentUser();
        this.entryData.preparedDate = this.ns.toDateTimeString(0);
        this.entryData.approvedBy = '';
        this.entryData.approvedName ='';
        this.entryData.approvedPosition = '';
        this.entryData.approvedDate = '';
        this.entryData.createUser = '';
        this.entryData.createDate = '';
        this.entryData.updateUser = '';
        this.entryData.updateDate = '';
           
        this.entryData.currRate = this.decimal.transform(this.entryData.currRate,'1.6-6');
        this.entryData.jvAmt = this.decimal.transform(this.entryData.jvAmt,'1.2-2');
        this.entryData.localAmt = this.decimal.transform(this.entryData.localAmt,'1.2-2');
    },0);
  }
  
  getDefName(){
    this.accountingService.getAcctDefName(this.ns.getCurrentUser()).subscribe((data:any) => {
      this.entryData.preparedName = data.employee.employeeName;
      this.entryData.preparedPosition = data.employee.designation;
    });
  }
}

