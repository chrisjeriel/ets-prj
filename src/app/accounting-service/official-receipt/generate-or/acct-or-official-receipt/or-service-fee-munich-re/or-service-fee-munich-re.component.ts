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

@ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  @ViewChild(QuarterEndingLovComponent) lovMdl: QuarterEndingLovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
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
		dataTypes: ['text','text','percent','currency','currency'],
		addFlag:true,
		deleteFlag: true,
		checkFlag: true,
		infoFlag:true,
		paginateFlag: true,
		magnifyingGlass:['quarterEnding'],
		keys: ['quarterEnding', 'curr', 'currRate', 'servFeeAmt', 'localAmt']
	}

	quarterEndingIndex: number = 0;

  constructor(private as: AccountingService, private ns: NotesService, private ms: MaintenanceService, private dp: DatePipe ) { }

  @Input() paymentType;

  ngOnInit() {
	
  }

  openLOV(event){
  	console.log(event.index);
    this.quarterEndingIndex = event.index;
    this.lovMdl.modal.openNoClose();
  }

  setSelectedData(data){
  	console.log(this.dp.transform(this.ns.toDateTimeString(data).split('T')[0], 'MM/dd/yyyy'));
    this.passData.tableData[this.quarterEndingIndex].quarterEnding = this.dp.transform(this.ns.toDateTimeString(data).split('T')[0], 'MM/dd/yyyy');
    this.passData.tableData[this.quarterEndingIndex].showMG = 0;
    //this.passData.tableData[this.quarterEndingIndex].uneditable = ['quarterEnding'];
  }

}
