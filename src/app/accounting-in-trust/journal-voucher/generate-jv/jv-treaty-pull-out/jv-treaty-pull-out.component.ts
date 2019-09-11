import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AgainstNegativeTreaty, AgainstLoss } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';

@Component({
  selector: 'app-jv-treaty-pull-out',
  templateUrl: './jv-treaty-pull-out.component.html',
  styleUrls: ['./jv-treaty-pull-out.component.css']
})
export class JvTreatyPullOutComponent implements OnInit {
  
  @Output() emitData = new EventEmitter<any>();
  @Input() cedingParams:any;
  @Input() jvDetail:any;
  @ViewChild('quarterTable') quarterTable: CustEditableNonDatatableComponent;
  @ViewChild('invTable') invTable: CustEditableNonDatatableComponent;
  @ViewChild(QuarterEndingLovComponent) quarterModal: QuarterEndingLovComponent; 

  passData: any = {
      tableData: [],
      tHeader: ['Quarter Ending', 'Currency', 'Currency Rate', 'Amount', 'Amount(PHP)'],
      dataTypes: ['date', 'text', 'percent', 'currency', 'currency'],
      nData: {
        showMG:1,
        tranId:'',
        quarterNo : '',
        cedingId : '',
        quarterEnding : '',
        currCd : '',
        currRate : '',
        balanceAmt : '',
        localAmt : '',
        createUser : this.ns.getCurrentUser(),
        createDate : '',
        updateUser : this.ns.getCurrentUser(),
        updateDate : ''
      },
      magnifyingGlass: ['quarterEnding'],
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      disableAdd: true,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 3,
      pageID: 'passDataNegative',
      uneditable: [true,true,true,false,true],
      total: [null, null, 'Total', 'balanceAmt', 'localAmt'],
      keys: ['quarterEnding', 'currCd', 'currRate', 'balanceAmt', 'localAmt'],
      widths: [203,50,130,130,130],
  };

  invesmentData: any = {
    tableData:[],
    tHeader:['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value'],
    dataTypes:['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','maturityValue'],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true,
    magnifyingGlass: ['invtCode'],
    nData: {
      tranId : '',
      itemNo : '',
      invtId : '',
      invtCode : '',
      certNo : '',
      invtType : '',
      invtTypeDesc : '',
      invtSecCd : '',
      securityDesc : '',
      maturityPeriod : '',
      durationUnit : '',
      interestRate : '',
      purchasedDate : '',
      maturityDate : '',
      destInvtId : '',
      bank : '',
      bankName : '',
      bankAcct : '',
      pulloutType : '',
      currCd : '',
      currRate : '',
      invtAmt : '',
      incomeAmt : '',
      bankCharge : '',
      whtaxAmt : '',
      maturityValue : '',
      localAmt : '',
      createUser : this.ns.getCurrentUser(),
      createDate : '',
      updateUser : this.ns.getCurrentUser(),
      updateDate : '',
      showMG: 1
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 
           'invtAmt' , 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue'],
    uneditable: [false, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true ],
    checkFlag: true,
    pageID: 6,
    widths:[140, 150, 127, 130, 90, 83, 85, 1, 1, 1, 85, 120, 120, 120, 120, 120, 120]
  };

  jvDetails: any = {
    cedingName: '',
    deleteNegTrty: [],
    saveNegTrty:[],
    saveClmOffset: [],
    deleteClmOffset : []
  }

  passLov: any = {
    selector: 'clmResHistPayts',
    cedingId: '',
    hide: []
  }

  readOnly: boolean = false;

  constructor(private ns: NotesService) { }

  ngOnInit() {
  	this.passData.disableAdd = false;
  	this.retrieveInvPullOut();
  }

  retrieveInvPullOut(){

  }

  showCedingCompanyLOV(){
  	$('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    console.log(data)
    this.jvDetails.cedingName = data.payeeName;
    this.jvDetails.ceding = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    //this.retrieveNegativeTreaty();
    this.check(this.jvDetails);
  }

  check(data){
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  quarterEndModal(){
    this.quarterModal.modal.openNoClose();
  }

}
