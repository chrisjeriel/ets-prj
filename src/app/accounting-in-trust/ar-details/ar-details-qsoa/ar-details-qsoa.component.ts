import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccARInvestments } from '@app/_models';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-ar-details-qsoa',
  templateUrl: './ar-details-qsoa.component.html',
  styleUrls: ['./ar-details-qsoa.component.css']
})
export class ArDetailsQsoaComponent implements OnInit {

  @Input() record: any = {};

  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  @ViewChild(QuarterEndingLovComponent) lovMdl: QuarterEndingLovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  
  passData: any = {
    tableData:[],
    tHeader:['Quarter Ending','Currency','Currency Rate','Amount', 'Amount (PHP)'],
    dataTypes:['date','select','percent','currency','currency'],
    total:[null,null,'Total','balPaytAmt','localAmt'],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true,
    magnifyingGlass: ['quarterEnding'],
    nData: {
      tranId: '',
      billId: 1,
      itemNo: '',
      quarterEnding: '',
      currCd: '',
      currRate: '',
      balPaytAmt: '',
      localAmt: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
      showMG: 1
    },
    keys: ['quarterEnding', 'currCd', 'currRate', 'balPaytAmt', 'localAmt'],
    checkFlag: true,
    pageID: 'negtrty',
    widths:[150, 100, 150, 'auto', 'auto'],
    opts: [
      {
        selector: 'currCd',
        vals: [],
        prev: []
      }
    ]
  }

  cancelFlag: boolean;
  totalLocalAmt: number = 0;
  dialogIcon: string = '';
  dialogMessage: string = '';

  savedData: any[] = [];
  deletedData: any[] = [];

  currencyArray: any[] = [];

  constructor(private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.passData.nData.tranId = this.record.tranId;
    this.getMtnCurrency();
    this.retrieveNegTrtyBal();
  }

  retrieveNegTrtyBal(){
    this.passData.tableData = [];

    this.accountingService.getAcitArNegTrtyBal(this.record.tranId, 1).subscribe(  //Bill Id is always 1 for Negative Treaty balance
      (data: any)=>{
        for(var i of data.negTrtyBalList){
          i.showMG = 0;
          this.passData.tableData.push(i);
        }
        //this.passData.tableData = data.negTrtyBalList;
        this.table.refreshTable();
      }
    );
  }

  setSelectedData(data){
    console.log(data);
  }

  onClickSave(){
    if(!this.checkIfNegativeTotal()){
      this.dialogIcon = 'info';
      this.dialogMessage = 'Total Amount must be negative.';
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    //prepare params from table
    this.savedData = [];
    this.deletedData = [];
    this.totalLocalAmt = 0;
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(!this.passData.tableData[i].deleted){
        this.totalLocalAmt += this.passData.tableData[i].localAmt;
      }
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].tranId = this.record.tranId;
          this.savedData[this.savedData.length-1].billId = 1; //1 for for Negative Treaty Balance
          this.savedData[this.savedData.length-1].quarterEnding = this.ns.toDateTimeString(this.savedData[this.savedData.length-1].quarterEnding);
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
         this.deletedData[this.deletedData.length-1].billId = 1; //1 for Negative Treaty Balance
         this.deletedData[this.deletedData.length-1].quarterEnding = this.ns.toDateTimeString(this.deletedData[this.deletedData.length-1].quarterEnding);
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Negative Treaty Balance
      billType: this.record.tranTypeCd,
      totalLocalAmt: this.totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveNegTrtyBal: this.savedData,
      delNegTrtyBal: this.deletedData
    }
    console.log(params);

    this.accountingService.saveAcitArNegTrtyBal(params).subscribe(
      (data:any)=>{
       if(data.returnCode === -1){
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveNegTrtyBal();
        }else if(data.returnCode === 0 && data.custReturnCode !== 2){
          this.dialogIcon = 'error';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }else if(data.returnCode === 0 && data.custReturnCode === 2){
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'Total Maturity Value of the Investment Pull-outs must not exceed the AR Amount.';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }
      },
      (error: any)=>{

      }
    );
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onRowClick(data){
    console.log(data);
  }

  onTableDataChange(data){
    if(data.key === 'currCd'){
      for(var i = 0; i < this.passData.tableData.length; i++){
        for(var j = 0; j < this.currencyArray.length; j++){
          if(data[i].currCd == this.currencyArray[j].currCd){
            data[i].currRate = this.currencyArray[j].currRate;
            break;
          }
        }
      }
    }

    if(data.key === 'balPaytAmt' || data.key === 'currCd' || data.key === 'currRate'){
      for(var i = 0; i < this.passData.tableData.length; i++){
        data[i].localAmt = data[i].balPaytAmt * data[i].currRate;
      }
    }else if(data.key === 'quarterEnding'){
      //validation about non duplicate quarter ending here
    }
  }

  //All maintenance retrievals here
  getMtnCurrency(){
    this.currencyArray = [];
    this.ms.getMtnCurrency('','Y').subscribe(
      (data: any)=>{
        for(var i of data.currency){
          this.passData.opts[0].vals.push(i.currencyCd);
          this.passData.opts[0].prev.push(i.currencyCd);
          this.currencyArray.push({currCd: i.currencyCd, currRate: i.currencyRt});
        }
      }
    );
  }

  //ALL VALIDATIONS HERE

  checkIfNegativeTotal(): boolean{
    var amt:number = 0;
    var localAmt:number = 0;
    for(var i of this.passData.tableData){
      amt += i.balPaytAmt;
      localAmt += i.localAmt;
    }
    if(amt < 0 && localAmt < 0){
      return true;
    }else{
      return false;
    }
  }

}
