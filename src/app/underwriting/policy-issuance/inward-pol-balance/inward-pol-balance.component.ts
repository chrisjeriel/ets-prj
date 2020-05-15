import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService, MaintenanceService } from '@app/_services';
import { PolicyInwardPolBalance, PolInwardPolBalanceOtherCharges } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-inward-pol-balance',
  templateUrl: './inward-pol-balance.component.html',
  styleUrls: ['./inward-pol-balance.component.css']
})
export class InwardPolBalanceComponent implements OnInit {

  @ViewChild('instllmentTable')instllmentTable:CustEditableNonDatatableComponent;
  @ViewChild('otherTable')otherTable:CustEditableNonDatatableComponent;
  @ViewChild(LovComponent)lov:LovComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancel : CancelButtonComponent;
  @Input()fromInq: boolean = false;
  @Input() policyInfo: any;
  @Output() showAlop = new EventEmitter<any>();

  passData: any = {
    tableData: [],
    tHeader: ['Inst No','Booking Date','Due Date','Premium','Other Charges'],
    uneditable: [true,false,false,false,true,true],
    total:[null,null,'Total','premAmt','otherChargesInw'],
    dataTypes: ["number","date","date","currency","currency","currency",],
    keys:['instNo','bookingDate','dueDate','premAmt','otherChargesInw'],
    nData: {
      "instNo": null,
      "bookingDate": this.ns.toDateTimeString(0),
      "dueDate": this.ns.toDateTimeString(0),
      "premAmt": 0,
      "otherChargesInw": 0,
      "amtDue": 0,
      "createUser": this.ns.getCurrentUser(),
      "createDate": this.ns.toDateTimeString(0),
      "updateUser": this.ns.getCurrentUser(),
      "updateDate": this.ns.toDateTimeString(0),
      otherCharges:[]
    },
    addFlag: true,
    genericBtn: 'Delete',
    widths: ["1", "1", "1", "auto", "auto", "auto"],
    pageID:'installment',
    pageLength: 'unli-5',
    checkFlag: false
  };

  passData2: any = {
    tableData: [],
    tHeader: ["Code","Charge Description","Amount"],
    total:[null,null,'amount'],
    keys: ['chargeCd','chargeDesc','amount'],
    dataTypes: ['sequence-3','text','currency'],
    uneditable:[true,true],
    magnifyingGlass: ['chargeCd'],
    addFlag: true,
    genericBtn: 'Delete',
    widths: [1,'auto','auto'],
    pageLength: 'unli-5',
    pageID:'otherCharges',
    nData:{
      instNo: 0,
      chargeCd: null,
      amount: 0,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      showMG :1
    },
    checkFlag: false,
    disableGeneric: true
  };

  passLOVData:any = {
    selector: 'otherCharges',

  }
  dialogIcon:string;

  totalPrem: any;
  currency: string = "";
  dialogMsg: string = "";
  cancelFlag : boolean = false;

  defaultInterval: number = 0;

  constructor(private underwritingservice: UnderwritingService, private titleService: Title, private ns : NotesService, private ms: MaintenanceService
  ) { }

 ngOnInit() {

    this.titleService.setTitle("Pol | Inward Pol Balance");

    this.fetchData();
    if(this.policyInfo.fromInq && this.policyInfo.status == "Distributed"){
      this.passData.tHeader.push("Amount Due");
      this.passData.keys.push("amtDue");
      this.passData.total.push("amtDue");
    }
    if(this.policyInfo.fromInq){

      this.passData.addFlag=false;
      this.passData.genericBtn = undefined;
      this.passData2.genericBtn = undefined;
      this.passData2.addFlag=false;
      this.passData2.deleteFlag=false;
      this.passData.uneditable = [];
      this.passData2.uneditable = [];
      this.passData2.checkFlag= false;
      this.passData.checkFlag= false;

      this.passData.tHeader = ['Inst No','Booking Date','Due Date','Memo No','Acct. Entry Date','Premium','Comm Rate(%)','Comm Amt','VAT on R/I Comm','Other Charges','Amount Due'];
      this.passData.keys = ['instNo','bookingDate','dueDate','memoNo','acctEntDate','premAmt','commRt','commAmt','vatRiComm','otherChargesInw','amtDue'];
      this.passData.total = [null,null,null,null,'Total','premAmt',null,'commAmt','vatRiComm','otherChargesInw','amtDue'];
      this.passData.dataTypes = ["number","date","date",'text',"date","currency","percent","currency","currency","currency","currency",];
      this.passData.widths = ["1", "1", "1", "1","1", "auto", "auto", "auto", "auto", "auto", "auto"];


      for(let key of this.passData.keys)
        this.passData.uneditable.push(true);
      for(let key of this.passData2.keys)
        this.passData2.uneditable.push(true);


    }



  }

  fetchData(){
    let sub = forkJoin(this.underwritingservice.getInwardPolBalance(this.policyInfo.policyId),
                        this.ms.getMtnParameters('N','INW_POL_PAYT_TERM')
                        ).pipe(map(([data, a]) => { return { data, a }; }));


    sub.subscribe((a:any)=>{
      console.log(a);
      this.defaultInterval = parseInt(a['a']['parameters'][0].paramValueN);
      let data = a['data'];

      if(data.policyList.length != 0){
        this.currency = data.policyList[0].project.coverage.currencyCd;
        if(data.policyList[0].inwPolBalance.length !=0){
          this.passData.nData.dueDate = new Date(data.policyList[0].inwPolBalance[0].dueDate).setMonth(new Date(data.policyList[0].inwPolBalance[0].dueDate).getMonth()+1);
          //this.passData.nData.bookingDate

          this.passData.tableData = data.policyList[0].inwPolBalance.filter((a,i)=>{
            a.dueDate     = this.ns.toDateTimeString(a.dueDate);
            a.bookingDate = this.ns.toDateTimeString(a.bookingDate);
            

            a.otherCharges = a.otherCharges.filter(a=>a.chargeCd!=null)
            return true;
          });
        }
        this.instllmentTable.onRowClick(null,this.passData.tableData[0]);
      }
      this.instllmentTable.refreshTable();

      var x = this.passData.tableData[this.passData.tableData.length - 1].dueDate;
      this.updateNDataDates();
      function pad(num) {
        return (num < 10) ? '0' + num : num;
      }
      //this.passData.nData.dueDate = this.ns.toDate(x).getFullYear() + '-' + pad((this.ns.toDate(x).getMonth()+1)+1) + '-' + pad(this.ns.toDate(x).getDate()) + 'T' + pad( this.ns.toDate(x).getHours()) + ':' + pad( this.ns.toDate(x).getMinutes()) + ':' + pad( this.ns.toDate(x).getSeconds());
      
    });

    this.underwritingservice.getUWCoverageInfos(null,this.policyInfo.policyId).subscribe((data:any) => {
        this.totalPrem = data.policy.project.coverage.totalPrem;
        if(data.policy.project.coverage.holdCoverTag == 'Y'){
          this.totalPrem = data.policy.project.coverage.holdCoverPremAmt;
        }
    });
  }

  updateNDataDates(){
    let index:number = this.passData.tableData.length - 1;

    this.passData.nData.bookingDate = new Date(this.passData.tableData[index].bookingDate);
    this.passData.nData.bookingDate.setMonth(this.passData.nData.bookingDate.getMonth()+2,0);
    this.passData.nData.bookingDate  = this.ns.toDateTimeString(this.passData.nData.bookingDate);

    this.passData.nData.dueDate = new Date(this.passData.nData.bookingDate);
    console.log(this.passData.nData.bookingDate)
    console.log(this.passData.nData.dueDate)
    this.passData.nData.dueDate.setDate(this.passData.nData.dueDate.getDate()+this.defaultInterval);
    console.log(this.passData.nData.dueDate)
    this.passData.nData.dueDate  = this.ns.toDateTimeString(this.passData.nData.dueDate);
  }

  updateOtherCharges(data){
    if(data == null){
        this.passData.disableGeneric = true;
        this.passData2.disableAdd = true;
        this.passData2.disableGeneric = true;
        this.passData2.tableData = [];
      }
    else{
      this.passData2.nData.instNo = data.instNo;
      this.passData2.disableAdd = false;
      this.passData.disableGeneric = false;
      this.passData2.disableGeneric = true;
      this.passData2.tableData = data.otherCharges;
    }
    this.otherTable.refreshTable();
  }

  clickLOV(data){
    this.passLOVData.hide = this.passData2.tableData.filter((a)=>{return !a.deleted}).map(a=>a.chargeCd);
    this.lov.openLOV();
  }

  setSelected(data){
    console.log(data.data)
    this.passData2.tableData = this.passData2.tableData.filter(a=>a.showMG != 1)
    for(let rec of data.data){
      this.passData2.tableData.push(JSON.parse(JSON.stringify(this.passData2.nData)));
      this.passData2.tableData[this.passData2.tableData.length - 1].showMG = 0;
      this.passData2.tableData[this.passData2.tableData.length - 1].chargeCd = rec.chargeCd;
      this.passData2.tableData[this.passData2.tableData.length - 1].chargeDesc =  rec.chargeDesc;
      this.passData2.tableData[this.passData2.tableData.length - 1].edited = true;
      if(rec.chargeType === 'P'){
        this.passData2.tableData[this.passData2.tableData.length - 1].amount = (rec.premRt/100) * this.totalPrem;
      }else{
        this.passData2.tableData[this.passData2.tableData.length - 1].amount = rec.defaultAmt
      }
    }
    this.instllmentTable.indvSelect.otherCharges = this.passData2.tableData
    this.compute();
    this.otherTable.refreshTable();
  }

  compute(){
    /*var test = this.ns.toDate(x).getFullYear() + '-' + pad((this.ns.toDate(x).getMonth()+1)) + '-' + pad(this.ns.toDate(x).getDate()) + 'T' + pad( this.ns.toDate(x).getHours()) + ':' + pad( this.ns.toDate(x).getMinutes()) + ':' + pad( this.ns.toDate(x).getSeconds());
    var dateNew = this.ns.toDate(test).getFullYear()*/

    var x = this.passData.tableData[this.passData.tableData.length - 1].dueDate;
    function pad(num) {
      return (num < 10) ? '0' + num : num;
    }

    //this.passData.nData.dueDate = this.ns.toDate(x).getFullYear() + '-' + pad((this.ns.toDate(x).getMonth()+1)) + '-' + pad(this.ns.toDate(x).getDate()) + 'T' + pad( this.ns.toDate(x).getHours()) + ':' + pad( this.ns.toDate(x).getMinutes()) + ':' + pad( this.ns.toDate(x).getSeconds());

    for(let rec of this.passData.tableData){
      if(rec.otherCharges.length != 0)
        rec.otherChargesInw = rec.otherCharges.filter((a)=>{return !a.deleted}).map(a=>a.amount).reduce((sum,curr)=>sum+curr,0);
      //rec.amtDue = rec.premAmt + rec.otherChargesInw;
    }
    this.updateNDataDates();
    this.instllmentTable.refreshTable();
  }

  save(can?){
    this.cancelFlag = can !== undefined;
    let params:any = {
      policyId:this.policyInfo.policyId,
      savePolInward : [],
      delPolInward : [],
      saveOtherCharges : [],
      delOtherCharges : [],
      newSavePolInward: [],
      user: this.ns.getCurrentUser()
    }
    for(let inst of this.passData.tableData){
        inst.commAmt = '';
        inst.commRt = '';
      if(inst.edited && !inst.deleted && inst.instNo!==null){
        inst.dueDate     = this.ns.toDateTimeString(inst.dueDate);
        inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
        inst.createDate     = this.ns.toDateTimeString(inst.createDate);
        inst.updateDate = this.ns.toDateTimeString(inst.updateDate);
        inst.updateUser = this.ns.getCurrentUser();
        params.savePolInward.push(inst);
      }else if(inst.deleted){
        params.delPolInward.push(inst);
      }
      if(!inst.deleted && inst.instNo!==null ){
        let instFlag: boolean = false;
        for(let chrg of inst.otherCharges){
          if(chrg.edited && !chrg.deleted ){
            chrg.createDate     = this.ns.toDateTimeString(chrg.createDate);
            chrg.updateDate = this.ns.toDateTimeString(chrg.updateDate);
            chrg.updateUser = this.ns.getCurrentUser();
            params.saveOtherCharges.push(chrg);
            instFlag = true;
          }else if(chrg.deleted){
            params.delOtherCharges.push(chrg);
            instFlag = true;
          }
        }
        if(instFlag){
          inst.dueDate     = this.ns.toDateTimeString(inst.dueDate);
          inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
          inst.createDate     = this.ns.toDateTimeString(inst.createDate);
          inst.updateDate = this.ns.toDateTimeString(inst.updateDate);
          inst.updateUser = this.ns.getCurrentUser();
          params.savePolInward.push(inst);
        }
      }
      if(inst.instNo==null){
        inst.dueDate     = this.ns.toDateTimeString(inst.dueDate);
        inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
        for(let chrg of inst.otherCharges){
          chrg.createDate     = this.ns.toDateTimeString(chrg.createDate);
          chrg.updateDate = this.ns.toDateTimeString(chrg.updateDate);
        }
        params.newSavePolInward.push(inst);
      }
    }
    this.underwritingservice.saveInwardPolBal(params).subscribe((data:any)=>{
      if(data.returnCode == -1){
        this.dialogIcon = 'success';
        this.successDiag.open();
        this.otherTable.markAsPristine();
        this.instllmentTable.markAsPristine();
        this.fetchData();
      }else{
        this.dialogIcon = 'error';
        this.successDiag.open();
      }
    });
  }

  onClickSave(){
    if(this.instllmentTable.getSum('premAmt').toFixed(2) == this.totalPrem)
      this.confirmSave.confirmModal();
    else if(this.passData.tableData.every(a=>a.premAmt != 0)){
      console.log(this.instllmentTable.getSum('premAmt'))
      console.log(this.totalPrem)
      this.dialogIcon = 'error';
      //this.dialogMsg = 'Total Premium must be equal to the sum of premium per installment.';
      this.successDiag.open();
    }
    else{
      this.dialogIcon = 'error-message';
      this.dialogMsg = 'Total Premium must be equal to the sum of premium per installment.';
      this.successDiag.open();
    }
  }

  onClickCancel(){
    this.cancel.clickCancel();
  }

  delInst(){
    if(this.passData.tableData.filter(a=>!a.deleted).length == 1){
      this.dialogIcon = 'error-message';
      this.dialogMsg = 'A policy must have one or more installments.';
      this.successDiag.open();
      return null;
    }

    if(this.instllmentTable.indvSelect.add){
       this.passData.tableData = this.passData.tableData.filter(a=> a!=this.instllmentTable.indvSelect);
       this.instllmentTable.refreshTable();
    }else{
      this.instllmentTable.selected = [this.instllmentTable.indvSelect];
      this.instllmentTable.confirmDelete();
    }
    this.passData2.tableData = [];
    this.passData2.disableAdd = true;
    this.passData2.disableGeneric = true;
    this.instllmentTable.markAsDirty();
    this.instllmentTable.refreshTable();
    this.otherTable.refreshTable();
  }

  delOth(){
   // if(this.otherTable.indvSelect.add){
   //     this.passData2.tableData = this.passData2.tableData.filter(a=> a!=this.otherTable.indvSelect);
   //     this.otherTable.refreshTable();
   //  }else{
   //    this.otherTable.indvSelect.deleted = true;
   //  }
    this.otherTable.selected = [this.otherTable.indvSelect];
    this.otherTable.confirmDelete();
    this.instllmentTable.indvSelect.otherCharges = this.passData2.tableData;
    this.otherTable.refreshTable();
  }

  onOtherClick(data){
    if(this.otherTable.indvSelect == null){
      this.passData2.disableGeneric = true;
    }else{
      this.passData2.disableGeneric = false;
    }
  }
}

