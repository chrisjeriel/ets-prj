import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QSOABalances } from '@app/_models/';
import { AccountingService, NotesService } from '@app/_services'
import { Title } from '@angular/platform-browser';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnCedingCompanyTreatyComponent } from '@app/maintenance/mtn-ceding-company-treaty/mtn-ceding-company-treaty.component';

@Component({
  selector: 'app-jv-prenium-reserve',
  templateUrl: './jv-prenium-reserve.component.html',
  styleUrls: ['./jv-prenium-reserve.component.css']
})
export class JvPreniumReserveComponent implements OnInit {
	@Input() tranId:any;
	@Input() jvAmount:number;
	@ViewChild('modal') modal: ModalComponent; 
	@ViewChild(MtnCedingCompanyTreatyComponent) cedingCoLov: MtnCedingCompanyTreatyComponent;
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

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
			showMG:1,			itemNo: null,
			quarterEnding : '',
			currCd : '',
			currRate : '',
			interestAmt : '',
			whtaxAmt : '',
			releaseAmt : '',
			createUser : this.ns.getCurrentUser(),
			createDate : this.ns.toDateTimeString(0),
			updateUser : this.ns.getCurrentUser(),
			updateDate : this.ns.toDateTimeString(0)
		},
		checkFlag: true,
		keys:['quarterEnding', 'currCd', 'currRate', 'interestAmt', 'whtaxAmt', 'releaseAmt'],
		widths:[150,195,195,195,195,195]
	}

	premResData: any  = {
		cedingName: '',
		deletePremResRel : [],
		savePremResRel : []
	}

	cancelFlag : boolean = false;
	dialogIcon : any;
	dialogMessage : any;
	fundsHeld: number = 0;

	constructor(private accService: AccountingService, private titleService: Title, private ns: NotesService) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-IT | JV QSOA");
	}

	retrievePremRes(){
		this.accService.getAcitJVPremRes(this.tranId,this.premResData.cedingId).subscribe((data:any) => {
			this.passData.tableData = [];
			for( var i = 0 ; i < data.premResRel.length;i++){
				this.passData.tableData.push(data.premResRel[i]);
				this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = this.ns.toDateTimeString(data.premResRel[i].quarterEnding);
			}
			this.table.refreshTable();
		});
	}

	onClickSave(){
		this.fundsHeld = 0;
		for(var i = 0; i < this.passData.tableData.length; i++){
			this.fundsHeld += this.passData.tableData[i].releaseAmt;
		}	

		if(this.fundsHeld > this.jvAmount){
			this.dialogMessage = "Total Funds Held Released must not exceed the JV Amount";
			this.dialogIcon = "error-message";
			this.successDiag.open();
		}else{
			$('#confirm-save #modalBtn2').trigger('click');
		}
	}

	prepareData(){
		var edited = [];
		var deleted = [];
		for(var i = 0 ;i < this.passData.tableData.length; i++){
			if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
				edited.push(this.passData.tableData[i]);
				edited[edited.length - 1].quarterEnding = this.ns.toDateTimeString(edited[edited.length - 1].quarterEnding);
				edited[edited.length - 1].tranId	 = this.tranId;
				edited[edited.length - 1].cedingId   = this.premResData.cedingId;
				edited[edited.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
				edited[edited.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
			}

			if(this.passData.tableData[i].deleted){
				deleted.push(this.passData.tableData[i]);
			}
		}
		this.premResData.savePremResRel = edited;
		this.premResData.deletePremResRel = deleted;
	}

	savePremResRel(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.prepareData();
		this.accService.saveAcitJVPremRes(this.premResData).subscribe((data:any) => {
			if(data['returnCode'] != -1) {
			  this.dialogMessage = data['errorList'][0].errorMessage;
			  this.dialogIcon = "error";
			  this.successDiag.open();
			}else{
			  this.dialogMessage = "";
			  this.dialogIcon = "success";
			  this.successDiag.open();
			  this.retrievePremRes();
			}
		});
	}

	quarterEndModal(){
		$('#quarterEnd #modalBtn').trigger('click');
	}

	cancel(){
		this.cancelBtn.clickCancel();
	}

	showCedingCompanyLOV() {
    	$('#cedingCompany #modalBtn').trigger('click');
  	}

  	setCedingcompany(data){
  		console.log(data)
  		this.premResData.cedingName = data.cedingName;
  		this.premResData.cedingId	= data.cedingId;
  		this.ns.lovLoader(data.ev, 0);
  		this.retrievePremRes();
  	}

  	checkCode(ev){
     this.ns.lovLoader(ev, 1);
     this.cedingCoLov.checkCode(this.premResData.ceding, ev);
  }
}
