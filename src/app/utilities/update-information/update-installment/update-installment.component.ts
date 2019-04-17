import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UnderwritingService, NotesService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import {ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-update-installment',
  templateUrl: './update-installment.component.html',
  styleUrls: ['./update-installment.component.css']
})
export class UpdateInstallmentComponent implements OnInit {
  searchParams: any[] = [];
  @ViewChildren(CustNonDatatableComponent) table: QueryList<CustNonDatatableComponent>;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('instllmentTable')instllmentTable:CustEditableNonDatatableComponent;
  @ViewChild('otherTable')otherTable:CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave:ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancel : CancelButtonComponent;
  @ViewChild(LovComponent)lov:LovComponent;
  selectedPolicy: any = null;
  polNo: any[] = [];
  policyId: any = "";
  condition: any = "";
  cedingName: any = "";
  insuredDesc: any = "";
  riskName: any = "";
  inceptionDate: any = "";
  inceptionTime: any = "";
  expiryDate: any = "";
  expiryTime: any = "";
  currency: any = "";
  totalPrem: any = "";
  createUser: any = "";
  selected: any;
  fetchedData: any;
  dialogIcon:string;
  dialogMsg: string = "";
  cancelFlag : boolean = false;
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  passDataInstallmentInfo: any = {
    tableData: [],
    tHeader: ["Inst No", "Due Date", "Booking Date", "Premium Amount", "Comm Rate(%)", "Comm Amount", "Other Charges", "Amount Due"],
    dataTypes: ["number", "date", "date", "currency", "percent", "currency", "currency", "currency"],
    /*total:[null, null,'Total','premAmt', 'commRt', 'commAmt', 'otherChargesInw','amtDue'],*/
    addFlag: true,
    deleteFlag: true,
    pageID: 1,
    widths: ["1", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
    nData: {
        instNo: '',
        dueDate: '',
        bookingDate: '',
        premAmt: '',
        commRt: '',
        commAmt: '',
        otherChargesInw: 0,
        amtDue: '',
        "createUser": JSON.parse(window.localStorage.currentUser).username,
        "createDate": this.ns.toDateTimeString(0),
        "updateUser": JSON.parse(window.localStorage.currentUser).username,
        "updateDate": this.ns.toDateTimeString(0),
        otherCharges:[]
    },
    keys: ['instNo', 'dueDate', 'bookingDate', 'premAmt', 'commRt', 'commAmt', 'otherChargesInw', 'amtDue'],
    pageLength: 5
  };

  passDataOtherCharges: any = {
    tableData: [["101", "Description 101", "50000"]],
    tHeader: ["Code", "Charge Description", "Amount"],
    dataTypes: ["text", "text", "currency"],
    addFlag: true,
    deleteFlag: true,
    pageID:'otherCharges',
    uneditable:[true,true],
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
    keys: ['chargeCd','chargeDesc','amount'],
    magnifyingGlass: ['chargeCd'],
    pageLength: 5
  };

  passDataLOV: any = {
    tableData: [],
    tHeader:["Policy No", "Ceding Company", "Insured", "Risk"],  
    dataTypes: ["text","text","text","text"],
    pageLength: 10,
    resizable: [false,false,false,false],
    tableOnly: false,
    keys: ['policyNo','cedComp','insured','risk'],
    // keys: ['openPolicyNo','cedingName','insuredDesc','riskName'],
    pageStatus: true,
    pagination: true,
    filters: [
    /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
    pageID: 'createPolLov'
  }

  passLOVData:any = {
    selector: 'otherCharges',
  }

  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal,private ns: NotesService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Update Installment");

    this.retrievePolListing();
  }

  onClickCancel(){
    this.cancel.clickCancel();
  }

  showLOV() {
    $('#polLovMdl > #modalBtn').trigger('click');
  }

  clickLOV(data){
    this.passLOVData.hide = this.passDataOtherCharges.tableData.filter((a)=>{return !a.deleted}).map(a=>a.chargeCd);
    this.lov.openLOV();
  }

  onRowClick(event){
     if(Object.entries(event).length === 0 && event.constructor === Object){
      this.selected = null;
    } else {
      this.selected = event;
    }   
  }

  setDetails() {
    if(this.selected != null) {
        this.polNo = this.selected.policyNo.split('-');
        this.policyId = this.selected.policyId;
        this.cedingName = this.selected.cedComp;
        this.insuredDesc = this.selected.insured;
        this.riskName = this.selected.risk;
        this.currency = this.selected.currency;
        this.totalPrem = this.selected.premium;
        this.createUser = this.selected.createUser;

        this.retrievePolInwardBal();
    }
  }

  updateOtherCharges(data){
    if(data == null){
        this.passDataOtherCharges.disableAdd = true;
        this.passDataOtherCharges.tableData = [];
      }
    else{
      this.passDataOtherCharges.nData.instNo = data.instNo;
      this.passDataOtherCharges.disableAdd = false;
      this.passDataOtherCharges.tableData = data.otherCharges;
    }
    this.otherTable.refreshTable();
  }

  onClickSave() {
    var hasError = false;
    for(var i=0; i<this.instllmentTable.passData.tableData.length; i++) {
      if(this.instllmentTable.passData.tableData[i].add != undefined || this.instllmentTable.passData.tableData[i].edited) {
        var d = new Date();
        d.setDate(d.getDate() + 1);
        if((new Date(this.instllmentTable.passData.tableData[i].bookingDate)).getTime() < d.getTime()) {
          hasError = true;
          this.dialogIcon = 'error-message';
          this.dialogMsg = 'The booking date is already closed. The earliest open booking month is ' 
                        + this.monthNames[d.getMonth()] + ' ' + (d.getFullYear());
          break;
        }
      }
    }

    if(this.instllmentTable.getSum('premAmt') != this.totalPrem) {
      hasError = true;
      this.dialogIcon = 'error-message';
      this.dialogMsg = 'Total Premium must be equal to the sum of premium per installment.';
    }

    if(!hasError) {
      this.confirmSave.confirmModal();
    }else {
      this.successDialog.open();
    }
  }

  retrievePolListing(){
       this.underwritingService.getParListing(this.searchParams).subscribe(data => {
         var records = data['policyList'];
          this.fetchedData = records;
               for(let rec of records){
                   if(rec.altNo === 0){
                      if (rec.statusDesc === 'In Force') {
                         this.passDataLOV.tableData.push(
                                                    {
                                                        policyId: rec.policyId,
                                                        policyNo: rec.policyNo,
                                                        cessionDesc: rec.cessionDesc,
                                                        cedComp: rec.cedingName, 
                                                        insured: rec.insuredDesc,
                                                        risk: (rec.project == null) ? '' : rec.project.riskName,
                                                        object: (rec.project == null) ? '' : rec.project.objectDesc,
                                                        site: (rec.project == null) ? '' : rec.project.site,
                                                        currency: rec.currencyCd,
                                                        sumInsured: (rec.project.coverage == null) ? '' : rec.project.coverage.totalSi,
                                                        premium: (rec.project.coverage == null) ? '' : rec.project.coverage.totalPrem,
                                                        issueDate: this.ns.toDateTimeString(rec.issueDate),
                                                        inceptDate: this.ns.toDateTimeString(rec.inceptDate),
                                                        expiryDate: this.ns.toDateTimeString(rec.expiryDate),
                                                        accDate: this.ns.toDateTimeString(rec.acctDate),
                                                        status: rec.statusDesc,
                                                        createUser: rec.createUser
                                                    }
                                                );  
                     }
                   }
               }
               this.table.forEach(table => { table.refreshTable() });
       });
   }

   retrievePolInwardBal() {
     this.passDataInstallmentInfo.tableData = [];
     this.underwritingService.getInwardPolBalance(this.policyId).subscribe((data:any) => {
       this.currency = data.policyList[0].project.coverage.currencyCd;
        this.totalPrem = data.policyList[0].project.coverage.totalPrem;
        if(data.policyList[0].inwPolBalance.length !=0){
          this.passDataInstallmentInfo.tableData = data.policyList[0].inwPolBalance.filter(a=>{
            a.dueDate     = this.ns.toDateTimeString(a.dueDate);
            a.bookingDate = this.ns.toDateTimeString(a.bookingDate);
            a.otherCharges = a.otherCharges.filter(a=>a.chargeCd!=null)
            return true;
          });

          this.passDataInstallmentInfo.nData.dueDate = this.ns.toDateTimeString(data.policyList[0].inceptDate);
          this.passDataInstallmentInfo.nData.bookingDate = this.ns.toDateTimeString(data.policyList[0].issueDate); 
        }

        this.instllmentTable.onRowClick(null,this.passDataInstallmentInfo.tableData[0]);
        this.instllmentTable.refreshTable();
     }); 
   }

   setSelected(data){
    this.passDataOtherCharges.tableData = this.passDataOtherCharges.tableData.filter(a=>a.showMG != 1)
    for(let rec of data.data){
      this.passDataOtherCharges.tableData.push(JSON.parse(JSON.stringify(this.passDataOtherCharges.nData)));
      this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].showMG = 0;
      this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].chargeCd = rec.chargeCd;
      this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].chargeDesc =  rec.chargeDesc;
      this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].amount = rec.defaultAmt
      this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].edited = true;
    }
    this.instllmentTable.indvSelect.otherCharges = this.passDataOtherCharges.tableData
    this.compute();
    this.otherTable.refreshTable();
  }

  compute(){
    for(let rec of this.passDataInstallmentInfo.tableData){
      if(rec.otherCharges.length != 0)
        rec.otherChargesInw = rec.otherCharges.filter((a)=>{return !a.deleted}).map(a=>a.amount).reduce((sum,curr)=>sum+curr,0);
      rec.amtDue = rec.premAmt + rec.otherChargesInw;
    }
    this.instllmentTable.refreshTable();
  }

  delInst(){
    if(this.passDataInstallmentInfo.tableData.filter(a=>!a.deleted).length == 1){
      this.dialogIcon = 'error-message';
      this.dialogMsg = 'A policy must have one or more installments.';
      this.successDialog.open();
      return null;
    }

    if(this.passDataInstallmentInfo.tableData[this.passDataInstallmentInfo.tableData.length -1 ].add){
      this.passDataInstallmentInfo.tableData.pop();
    }else{
      this.passDataInstallmentInfo.tableData.forEach(a=>{
        if(a==this.instllmentTable.displayData[this.instllmentTable.displayData.filter(a=>a!=this.instllmentTable.fillData).length -1 ]){
          a.deleted = true;
          a.edited = true;
        }
      })
    }
    this.instllmentTable.markAsDirty();
    this.instllmentTable.refreshTable();
  }

   save(can?){
     this.cancelFlag = can !== undefined;
     let params:any = {
      policyId:this.policyId,
      savePolInward : [],
      delPolInward : [],
      saveOtherCharges : [],
      delOtherCharges : [],
      newSavePolInward: []
     }

     for(let inst of this.passDataInstallmentInfo.tableData){
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
        let instFlag: boolean = false;
        for(let chrg of inst.otherCharges){
          if(chrg.edited && !chrg.deleted ){
            chrg.createDate     = this.ns.toDateTimeString(chrg.createDate);
            chrg.updateDate = this.ns.toDateTimeString(chrg.updateDate);
            chrg.updateUser = JSON.parse(window.localStorage.currentUser).username;
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
          inst.updateUser = JSON.parse(window.localStorage.currentUser).username;
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

     this.underwritingService.saveInwardPolBal(params).subscribe((data:any)=>{
        if(data.returnCode == -1){
          this.dialogIcon = 'success';
          this.successDialog.open();
          this.otherTable.markAsPristine();
          this.instllmentTable.markAsPristine();
          this.retrievePolInwardBal();
        }else{
          this.dialogIcon = 'error';
          this.successDialog.open();
        }
      });
    }

   delOth(){
    if(this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length -1 ].add){
      this.passDataOtherCharges.tableData.pop();
    }else{
      this.passDataOtherCharges.tableData.forEach(a=>{
        if(a==this.otherTable.displayData[this.otherTable.displayData.filter(a=>a!=this.otherTable.fillData).length -1 ]){
          a.deleted = true;
          a.edited = true;
        }
      })
    }
    this.instllmentTable.indvSelect.otherCharges = this.passDataOtherCharges.tableData;
    this.otherTable.markAsDirty();
    this.otherTable.refreshTable();
    this.compute();
  }

}
