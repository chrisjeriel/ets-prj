import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QSOABalances } from '@app/_models/';
import { AccountingService, NotesService } from '@app/_services'
import { Title } from '@angular/platform-browser';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';


@Component({
  selector: 'app-jv-prenium-reserve',
  templateUrl: './jv-prenium-reserve.component.html',
  styleUrls: ['./jv-prenium-reserve.component.css']
})
export class JvPreniumReserveComponent implements OnInit {
	@Input() tranId:any;
	@ViewChild('modal') modal: ModalComponent; 
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

	passData: any = {
		tableData:[],
		tHeader:['Quarter Ending','Currency','Currency Rate','Interest on Premium','Withholding Tax','Funds Held Released'],
		dataTypes:['date','text','percent','currency','currency','currency'],
		total:[null,null,'Total','interestAmt','whtaxAmt','releaseAmt'],
		addFlag:true,
		magnifyingGlass: ['quarterEnding'],
		deleteFlag:true,
		infoFlag:true,
		paginateFlag:true,	
		pageID:1,
		nData: {
			showMG:1,
			quarterEnding : '',
			currCd : '',
			currRate : '',
			interestAmt : '',
			whtaxAmt : '',
			releaseAmt : '',
			createUser : '',
			createDate : '',
			updateUser : '',
			updateDate : ''
		},
		checkFlag: true,
		keys:['quarterEnding', 'currCd', 'currRate', 'interestAmt', 'whtaxAmt', 'releaseAmt'],
		widths:[150,195,195,195,195,195]
	}

	cancelFlag : boolean = false;
	dialogIcon : any;
	dialogMessage : any;

	constructor(private accService: AccountingService, private titleService: Title, private ns: NotesService) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-IT | JV QSOA");
		this.retrievePremRes();
	}

	retrievePremRes(){
		this.accService.getAcitJVPremRes(this.tranId).subscribe((data:any) => {
			for( var i = 0 ; i < data.premResRel.length;i++){
				this.passData.tableData.push(data.premResRel[i]);
				//this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = this.ns.toDateTimeString(data.premResRel[i].quarterEnding);
			}
			this.table.refreshTable();
		});
	}

	onClickSave(){	
		$('#confirm-save #modalBtn2').trigger('click');
	}

	prepareData(){
		var edited = [];
		for(var i = 0 ;i < this.passData.tableData,length; i++){
			if(this.passData.tableData[i].edited){
				edited.push(this.passData.tableData[i]);
			}
		}
	}

	savePremResRel(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.prepareData();

	}

	quarterEndModal(){
		$('#quarterEnd #modalBtn').trigger('click');
	}

	cancel(){
		this.cancelBtn.clickCancel();
	}
}
