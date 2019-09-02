import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { ARUnappliedCollection } from '@app/_models';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-ar-others',
  templateUrl: './ar-others.component.html',
  styleUrls: ['./ar-others.component.css']
})
export class ArOthersComponent implements OnInit {

  @Input() arDetails: any;

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancel: CancelButtonComponent;

  @Output() emitCreateUpdate: EventEmitter<any> = new EventEmitter();

  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];

  cancelFlag: boolean = false;

  totalLocalAmt: number = 0;

  passData: any = {
    tableData: [],
    tHeader: ['Item','Reference No.','Description','Curr','Curr Rate','Amount','Amount (PHP)'],
    dataTypes: ['text','text','text','text','percent','currency','currency'],
    nData: {
      tranId: '',
      billId: '',
      itemNo: '',
      itemName: '',
      refNo: '',
      remarks: '',
      currCd: '',
      currRate: '',
      currAmt: '',
      localAmt: ''
    },
    total:[null,null,null,null,'Total','currAmt','localAmt'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    pageLength: 10,
    widths: [210,160,'auto',80,100,120,120],
    keys: ['itemName', 'refNo', 'remarks', 'currCd', 'currRate', 'currAmt', 'localAmt'],
    uneditable: [false,false,false,true,true,false,true],
    paginateFlag:true,
    infoFlag:true,
    opts:[{
      selector: 'currCd',
      vals: [],
      prev: []
    }]
  }
  constructor(private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.passData.nData.tranId = this.arDetails.tranId;
    this.passData.nData.billId = 3;
    this.passData.nData.currCd = this.arDetails.currCd;
    this.passData.nData.currRate = this.arDetails.currRate;
    if(this.arDetails.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true, true, true, true, true, true,true ];
      this.passData.addFlag = false;
      this.passData.deleteFlag =  false;
      this.passData.checkFlag = false;
    }
    //this.getCurrency();
    this.retrieveOthers();
  }

  retrieveOthers(){
    this.passData.tableData = [];
    this.accountingService.getAcitArTransDtl(this.arDetails.tranId, 3).subscribe( //Bill id = 3 for others
      (data: any)=>{
        if(data.transDtlList.length !== 0){
          /*for(var i of data.transDtlList){
            i.currCd = i.currCd+'T'+i.currRate;
            this.passData.tableData.push(i);
          }*/
          this.passData.tableData = data.transDtlList;
          this.table.refreshTable();
        }
      },
      (error: any)=>{

      }
    );
  }

  getCurrency(){
    this.ms.getMtnCurrency('','Y').subscribe(
       (data: any)=>{
         for(var i of data.currency){
           this.passData.opts[0].vals.push(i.currencyCd+'T'+i.currencyRt);
           this.passData.opts[0].prev.push(i.currencyCd);
         }
       }
    );
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  onClickCancel(){
    this.cancel.clickCancel();
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.savedData = [];
    this.deletedData = [];
    this.totalLocalAmt = 0;
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(!this.passData.tableData[i].deleted){
        this.totalLocalAmt += this.passData.tableData[i].localAmt;
      }
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          /*this.savedData[this.savedData.length-1].tranId = this.record.tranId;
          this.savedData[this.savedData.length-1].billId = 1; //1 for Inward Policy balances Transaction Type*/
          this.savedData[this.savedData.length-1].currCd = this.savedData[this.savedData.length-1].currCd.split('T')[0];
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         /*this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
         this.deletedData[this.deletedData.length-1].billId = 1; //1 for Inward Policy balances Transaction Type*/
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    let params: any = {
      tranId: this.arDetails.tranId,
      billId: 3, //3 for others
      billType: 8, //8 for others
      totalLocalAmt: this.totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveTransDtl: this.savedData,
      delTransDtl: this.deletedData
    }
    console.log(params);
    this.accountingService.saveAcitArTransDtl(params).subscribe(
      (data:any)=>{
        console.log(data);
        if(data.returnCode === -1){
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveOthers();
        }else if(data.returnCode === 0 && data.custReturnCode !== 2){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else if(data.returnCode === 0 && data.custReturnCode === 2){
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'Total amount for Other Payments must not exceed the AR Amount.';
          this.successDiag.open();
        }
      }
    );

  }

  onTableDataChange(data){
    if(data.key === 'currAmt' || data.key === 'currRate'){
      for(var i = 0; i < data.length; i++){
        data[i].localAmt = data[i].currAmt * data[i].currRate;
      }
    }else if(data.key === 'currCd'){
      for(var i = 0; i < data.length; i++){
        data[i].currRate = data[i].currCd.split('T')[1];
        data[i].localAmt = data[i].currAmt * data[i].currRate;
      }
    }
    this.passData.tableData = data;
  }

  onRowClick(data){
    if(data !== null){
      data.updateDate = this.ns.toDateTimeString(data.updateDate);
      data.createDate = this.ns.toDateTimeString(data.createDate);
      this.emitCreateUpdate.emit(data);
    }else{
      this.emitCreateUpdate.emit(null);
    }
  }
}

