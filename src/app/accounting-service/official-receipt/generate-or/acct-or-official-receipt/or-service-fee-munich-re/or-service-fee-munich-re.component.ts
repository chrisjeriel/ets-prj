import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common'
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-or-service-fee-munich-re',
  templateUrl: './or-service-fee-munich-re.component.html',
  styleUrls: ['./or-service-fee-munich-re.component.css'],
  providers: [DatePipe]
})
export class OrServiceFeeMunichReComponent implements OnInit {
  @Input() record: any;

  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  @ViewChild(QuarterEndingLovComponent) lovMdl: QuarterEndingLovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  @Output() emitCreateUpdate: any = new EventEmitter<any>();

  passData: any = {
		tableData:[],
		tHeader: ['Quarter Ending','Curr','Curr Rate','Amount','Amount(PHP)'],
		widths:[1,1,100,100,100],
		nData: {
			tranId: '',
			billId: '',
			itemNo: '',
			quarterEnding: '',
			currCd: '',
			currRate: '',
			servFeeAmt: '',
			localAmt: '',
			createUser: '',
			createDate: '',
			updateUser: '',
			updateDate: '',
			showMG: 1
		},
		total:[null,null,'Total','servFeeAmt','localAmt'],
		dataTypes: ['date','text','percent','currency','currency'],
		addFlag:true,
		deleteFlag: true,
		checkFlag: true,
		infoFlag:true,
		paginateFlag: true,
		magnifyingGlass:['quarterEnding'],
		keys: ['quarterEnding', 'currCd', 'currRate', 'servFeeAmt', 'localAmt'],
		uneditable: [true,true,true,false,true]
	}

	quarterEndingIndex: number = 0;
	cancelFlag: boolean = false;
	dialogMessage: string = '';
	dialogIcon: string = '';
	savedData: any = [];
	deletedData: any = [];

  constructor(private as: AccountingService, private ns: NotesService, private ms: MaintenanceService, private dp: DatePipe ) { }

  @Input() paymentType;

  ngOnInit() {
  	this.passData.nData.currCd = this.record.currCd;
  	this.passData.nData.currRate = this.record.currRate;
  	if(this.record.orStatDesc.toUpperCase() != 'NEW'){
  		this.passData.addFlag = false;
  		this.passData.deleteFlag = false;
  		this.passData.checkFlag = false;
  		this.passData.uneditable = [true,true,true,true,true,true];
  	}
	this.retrieveOrServFee();
  }

  retrieveOrServFee(){
  	this.as.getAcseOrServFee(this.record.tranId, 1).subscribe(
  		(data:any)=>{
  			if(data.servFeeList.length !== 0){
  				this.passData.tableData = data.servFeeList;
  				this.table.refreshTable();
  			}
  		}
  	)
  }

  onRowClick(data){
  	console.log(data);
  	if(data === null){
  		this.emitCreateUpdate.emit(null);
  	}else{
  		data.updateDate = this.ns.toDateTimeString(data.updateDate);
  		data.createDate = this.ns.toDateTimeString(data.createDate);
  		this.emitCreateUpdate.emit(data);
  	}
  }

  openLOV(event){
  	console.log(event.index);
    this.quarterEndingIndex = event.index;
    this.lovMdl.modal.openNoClose();
  }

  setSelectedData(data){
  	console.log(this.dp.transform(this.ns.toDateTimeString(data).split('T')[0], 'MM/dd/yyyy'));
    this.passData.tableData[this.quarterEndingIndex].quarterEnding = data;//this.dp.transform(this.ns.toDateTimeString(data).split('T')[0], 'MM/dd/yyyy');
    this.passData.tableData[this.quarterEndingIndex].showMG = 0;
    //this.passData.tableData[this.quarterEndingIndex].uneditable = ['quarterEnding'];
  }

  onTableDataChange(data){
    if(data.key == 'servFeeAmt'){
      for(var i of this.passData.tableData){
        i.localAmt = i.servFeeAmt * i.currRate;
      }
    }
  }

  onClickSave(){
  	this.confirm.confirmModal();
  }

  onClickCancel(){
  	this.cancelBtn.clickCancel();
  }

  save(cancelFlag?){
  	var totalLocalAmt: number = 0;
  	this.cancelFlag = cancelFlag !== undefined;
  	this.savedData = [];
  	this.deletedData = [];
  	for (var i = 0 ; this.passData.tableData.length > i; i++) {
  	  if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  	      this.savedData.push(this.passData.tableData[i]);
  	      this.savedData[this.savedData.length-1].tranId = this.record.tranId;
  	      this.savedData[this.savedData.length-1].billId = 1; //1 for Official Receipt Transaction Type
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
  	  }
  	  else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
  	     this.deletedData.push(this.passData.tableData[i]);
  	     this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
  	     this.deletedData[this.deletedData.length-1].billId = 1; //1 for Official Receipt Transaction Type
  	     this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
  	     this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	  }
  	}
  	this.passData.tableData.filter(a=>{return !a.deleted}).forEach(b=>{
  		totalLocalAmt += b.localAmt;
  	});
  	let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Official Receipt Transaction Type
      billType: this.record.tranTypeCd,
      totalLocalAmt: totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveServFee: this.savedData,
      delServFee: this.deletedData
    }

    this.as.saveAcseOrServFee(params).subscribe(
      (data:any)=>{
        if(data.returnCode === 0){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveOrServFee();
          this.table.refreshTable();
          this.table.markAsPristine();
        }
      },
      (error: any)=>{

      }
    );
  }


}
