import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { PolicyInwardPolBalance, PolInwardPolBalanceOtherCharges } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

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

  passData: any = {
    tableData: [],
    tHeader: ['Inst No','Due Date','Booking Date','Premium','Other Charges','Amount Due'],
    uneditable: [true,false,false,false,true,true],
    total:[null,null,'Total','premAmt','otherChargesInw','amtDue'],
    dataTypes: ["number","date","date","currency","currency","currency",],
    keys:['instNo','dueDate','bookingDate','premAmt','otherChargesInw','amtDue'],
    nData: {
      "instNo": null,
      "bookingDate": this.ns.toDateTimeString(0),
      "dueDate": this.ns.toDateTimeString(0),
      "premAmt": 0,
      "otherChargesInw": 0,
      "amtDue": 0,
      "createUser": JSON.parse(window.localStorage.currentUser).username,
      "createDate": this.ns.toDateTimeString(0),
      "updateUser": JSON.parse(window.localStorage.currentUser).username,
      "updateDate": this.ns.toDateTimeString(0),
      otherCharges:[]
    },
    addFlag: true,
    deleteFlag: true,
    widths: ["1", "1", "1", "auto", "auto", "auto"],
    pageID:'installment',
    pageLength: 5,
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
    deleteFlag: true,
    widths: [1,'auto','auto'],
    pageLength: 5,
    pageID:'otherCharges',
    nData:{
      instNo: 0,
      chargeCd: null,
      amount: 0,
      createUser: JSON.parse(window.localStorage.currentUser).username,
      createDate: this.ns.toDateTimeString(0),
      updateUser: JSON.parse(window.localStorage.currentUser).username,
      updateDate: this.ns.toDateTimeString(0),
      showMG :1
    },
    checkFlag: false
  };

  passLOVData:any = {
    selector: 'otherCharges',

  }
  dialogIcon:string;

  totalPrem: string = "";
  currency: string = "";
  dialogMsg: string = "";
  cancelFlag : boolean = false;

  constructor(private underwritingservice: UnderwritingService, private titleService: Title, private ns : NotesService
  ) { }

 ngOnInit() {
   
    this.titleService.setTitle("Pol | Inward Pol Balance");
    this.fetchData();
    if(this.policyInfo.fromInq){
      this.passData.addFlag=false;
      this.passData.deleteFlag=false;
      this.passData2.addFlag=false;
      this.passData2.deleteFlag=false;
      this.passData.uneditable = [];
      this.passData2.uneditable = [];
      this.passData2.checkFlag= false;
      this.passData.checkFlag= false;
      for(let key of this.passData.keys)
        this.passData.uneditable.push(true);
      for(let key of this.passData2.keys)
        this.passData2.uneditable.push(true);
    }
  }

  fetchData(){
    console.log(this.policyInfo.policyId)
    this.underwritingservice.getInwardPolBalance(this.policyInfo.policyId).subscribe((data:any)=>{
      this.currency = data.policyList[0].project.coverage.currencyCd;
      this.totalPrem = data.policyList[0].project.coverage.totalPrem;
      if(data.policyList[0].inwPolBalance.length !=0){
        this.passData.tableData = data.policyList[0].inwPolBalance.filter(a=>{
          a.dueDate     = this.ns.toDateTimeString(a.dueDate);
          a.bookingDate = this.ns.toDateTimeString(a.bookingDate);
          a.otherCharges = a.otherCharges.filter(a=>a.chargeCd!=null)
          return true;
        });

        this.passData.nData.dueDate = this.ns.toDateTimeString(data.policyList[0].inceptDate);
        this.passData.nData.bookingDate = this.ns.toDateTimeString(data.policyList[0].issueDate); 
      }
      this.instllmentTable.onRowClick(null,this.passData.tableData[0]);
      this.instllmentTable.refreshTable();
    })
  }

  updateOtherCharges(data){
    if(data == null){
        this.passData2.disableAdd = true;
        this.passData2.tableData = [];
      }
    else{
      this.passData2.nData.instNo = data.instNo;
      this.passData2.disableAdd = false;
      this.passData2.tableData = data.otherCharges;
    }
    this.otherTable.refreshTable();
  }

  clickLOV(data){
    this.passLOVData.hide = this.passData2.tableData.filter((a)=>{return !a.deleted}).map(a=>a.chargeCd);
    this.lov.openLOV();
  }

  setSelected(data){
    this.passData2.tableData = this.passData2.tableData.filter(a=>a.showMG != 1)
    for(let rec of data.data){
      this.passData2.tableData.push(JSON.parse(JSON.stringify(this.passData2.nData)));
      this.passData2.tableData[this.passData2.tableData.length - 1].showMG = 0;
      this.passData2.tableData[this.passData2.tableData.length - 1].chargeCd = rec.chargeCd;
      this.passData2.tableData[this.passData2.tableData.length - 1].chargeDesc =  rec.chargeDesc;
      this.passData2.tableData[this.passData2.tableData.length - 1].amount = rec.defaultAmt
      this.passData2.tableData[this.passData2.tableData.length - 1].edited = true;
    }
    this.instllmentTable.indvSelect.otherCharges = this.passData2.tableData
    this.compute();
    this.otherTable.refreshTable();
  }

  compute(){
    for(let rec of this.passData.tableData){
      if(rec.otherCharges.length != 0)
        rec.otherChargesInw = rec.otherCharges.filter((a)=>{return !a.deleted}).map(a=>a.amount).reduce((sum,curr)=>sum+curr);
      rec.amtDue = rec.premAmt + rec.otherChargesInw;
    }
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
      newSavePolInward: []
    }
    for(let inst of this.passData.tableData){
      if(inst.edited && !inst.deleted && inst.instNo!==null){
        inst.dueDate     = this.ns.toDateTimeString(inst.dueDate);
        inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
        inst.createDate     = this.ns.toDateTimeString(inst.createDate);
        inst.updateDate = this.ns.toDateTimeString(inst.updateDate);
        inst.updateUser = JSON.parse(window.localStorage.currentUser).username;
        params.savePolInward.push(inst);
      }else if(inst.deleted){
        params.delPolInward.push(inst);
      }
      if(!inst.deleted && inst.instNo!==null ){
        for(let chrg of inst.otherCharges){
          if(chrg.edited && !chrg.deleted ){
            chrg.createDate     = this.ns.toDateTimeString(chrg.createDate);
            chrg.updateDate = this.ns.toDateTimeString(chrg.updateDate);
            chrg.updateUser = JSON.parse(window.localStorage.currentUser).username;
            params.saveOtherCharges.push(chrg);
          }else if(chrg.deleted){
            params.delOtherCharges.push(chrg);
          }
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
    if(this.instllmentTable.getSum('premAmt') == this.totalPrem)
      this.confirmSave.confirmModal();
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

    if(this.passData.tableData[this.passData.tableData.length -1 ].add){
      this.passData.tableData.pop();
    }else{
      this.passData.tableData.forEach(a=>{
        if(a==this.instllmentTable.displayData[this.instllmentTable.displayData.filter(a=>a!=this.instllmentTable.fillData).length -1 ]){
          a.deleted = true;
          a.edited = true;
        }
      })
    }
    this.instllmentTable.markAsDirty();
    this.instllmentTable.refreshTable();
  }

  delOth(){
    if(this.passData2.tableData[this.passData2.tableData.length -1 ].add){
      this.passData2.tableData.pop();
    }else{
      this.passData2.tableData.forEach(a=>{
        if(a==this.otherTable.displayData[this.otherTable.displayData.filter(a=>a!=this.otherTable.fillData).length -1 ]){
          a.deleted = true;
          a.edited = true;
        }
      })
    }
    this.otherTable.markAsDirty();
    this.otherTable.refreshTable();
  }


}

