import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AgainstNegativeTreaty, AgainstLoss } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-jv-offsetting-against-negative-treaty',
  templateUrl: './jv-offsetting-against-negative-treaty.component.html',
  styleUrls: ['./jv-offsetting-against-negative-treaty.component.css']
})
export class JvOffsettingAgainstNegativeTreatyComponent implements OnInit {
  
  @Input() jvDetail:any;
  @ViewChild('quarterTable') quarterTable: CustEditableNonDatatableComponent;
  @ViewChild('trytytrans') trytytransTable: CustEditableNonDatatableComponent;
  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;

  /*passData: any = {
    tableData: this.accountingService.getAgainstNegativeTreaty(),
    tHeader: ['Quarter Ending','Currency', 'Currency Rate', 'Amount','Amount(PHP)'],
    resizable: [true, true, true, true, true,true, true, true],
    dataTypes: ['date','text','percent','currency','currency'],
    nData: new AgainstNegativeTreaty(new Date(),null,null,null,null),
    total:[null,null,'Total','amount','amountPhp'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 5,
    pageID: 'passdata',
    widths: [203,50,130,130,130],

  };*/

  passData: any = {
      tableData: [],
      tHeader: ['Quarter Ending', 'Currency', 'Currency Rate', 'Amount', 'Amount(PHP)'],
      dataTypes: ['date', 'text', 'percent', 'currency', 'currency'],
      nData: {
        tranId:'',
        quarterNo : '',
        cedingId : '',
        quarterEnding : '',
        currCd : '',
        currRate : '',
        balanceAmt : '',
        localAmt : '',
        createUser : '',
        createDate : '',
        updateUser : '',
        updateDate : ''
      },
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 3,
      pageID: 'passDataNegative',
      uneditable: [true, false],
      keys: ['quarterEnding', 'currCd', 'currRate', 'balanceAmt', 'localAmt'],
      widths: [203,50,130,130,130],
  }

  claimsOffset: any = {
    tableData: [],
    tHeader: ['Claim No', 'Hist No','Hist Category', 'Hist Type', 'Payment For', 'Insured', 'Ex-Gratia', 'Curr','Curr Rate', 'Reserve Amount','Paid Amount',' Paid Amount (Php)'],
    dataTypes: ['text', 'sequence-2', 'text', 'text', 'text', 'text','checkbox', 'text', 'percent', 'currency', 'currency', 'currency'],
    nData: {
      showMG:1,
      claimNo:'',
      claimId:'',
      histNo: '',
      histCategoryDesc: '',
      histTypeDesc: '',
      paymentFor: '',
      insuredDesc: '',
      exGratia: '',
      currCd: '',
      currRate: '',
      reserveAmt: '',
      currAmt: '',
      localAmt: '',
      createUser: this.ns.getCurrentUser(),
      createDate:'',
      updateUser: this.ns.getCurrentUser(),
      updateDate: ''
    },
    magnifyingGlass: ['claimNo'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null,null, null, null,null, null, null, 'Total', 'reserveAmt', 'currAmt', 'localAmt'],
    genericBtn: 'Save',
    widths: [110,47,98,125,78,354,62,50,64,110,110,110],
    keys:['claimNo','histNo','histCategoryDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currCd','currRate','reserveAmt','currAmt','localAmt']
  }

  jvDetails: any = {
    cedingName: '',
    deleteInwPol: [],
    saveInwPol:[]
  }

  passLov: any = {
    selector: 'acitJVNegativeTreaty',
    cedingId: '',
    hide: []
  }

  quarterNo: any;

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal, private ns: NotesService) { }

  ngOnInit() {
  }

  retrieveClmOffset(){
    this.accountingService.getAcitJVClmOffset(this.jvDetail.tranId,this.jvDetails.ceding,this.quarterNo).subscribe((data:any) =>{
      this.claimsOffset.tableData = [];
      for( var i = 0 ; i < data.claimOffset.length; i++){
        this.claimsOffset.tableData.push(data.claimOffset[i]);

      }
      this.trytytransTable.refreshTable();
    });
  }

  retrieveNegativeTreaty(){
    this.accountingService.getNegativeTreaty(this.jvDetail.tranId,this.jvDetails.ceding).subscribe((data:any) => {
      this.passData.tableData = [];
      for (var i = 0; i < data.negativeTrty.length; i++) {
         this.passData.tableData.push(data.negativeTrty[i]);
         this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = this.ns.toDateTimeString(data.negativeTrty[i].quarterEnding);
      }
      this.quarterTable.refreshTable();
      this.quarterTable.onRowClick(null,this.passData.tableData[0]);
    });
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  checkCode(ev){
     this.ns.lovLoader(ev, 1);
     this.cedingCoLov.checkCedingCo(this.jvDetails.ceding, ev);
    
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveNegativeTreaty();
  }

  openLOV(data){
    this.passLov.hide = this.claimsOffset.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.claimNo});
    console.log(this.passLov.hide)
    this.lovMdl.openLOV();
  }

  setClaimOffset(data){
    console.log(data)
    this.claimsOffset.tableData = this.claimsOffset.tableData.filter((a) => a.showMG != 1);
    for(var  i=0; i < data.data.length;i++){
      this.claimsOffset.tableData.push(JSON.parse(JSON.stringify(this.claimsOffset.nData)));
      //this.claimsOffset.tableData.push(data)
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].showMG = 0;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].edited  = true;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].itemNo = null;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].claimId = data.data[i].claimId;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].projId = data.data[i].projId;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].histNo = data.data[i].histNo;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].policyId = data.data[i].policyId;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].currCd = data.data[i].currencyCd;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].currRate = data.data[i].currencyRt;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].claimNo = data.data[i].claimNo;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].histCategoryDesc = data.data[i].histCategoryDesc;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].histTypeDesc = data.data[i].histTypeDesc;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].insuredDesc = data.data[i].insuredDesc;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].reserveAmt = data.data[i].reserveAmt;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].currAmt = data.data[i].paytAmt * 1; //change to currency rt
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].localAmt = data.data[i].paytAmt;
    }
    this.trytytransTable.refreshTable();
  }

  onrowClick(data){
    if(data!==null){
      console.log(data)
      this.quarterNo = data.quarterNo;
      this.retrieveClmOffset();
    }else{
      this.claimsOffset.tableData = [];
    }
    
  }

}


/*this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].instNo = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].paymentFor = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].currAmt = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].localAmt = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].remarks = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].exGratia = data.data[i].;*/