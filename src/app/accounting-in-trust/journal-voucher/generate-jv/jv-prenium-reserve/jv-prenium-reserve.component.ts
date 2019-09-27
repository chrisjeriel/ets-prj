import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { QSOABalances } from '@app/_models/';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services'
import { Title } from '@angular/platform-browser';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnCedingCompanyTreatyComponent } from '@app/maintenance/mtn-ceding-company-treaty/mtn-ceding-company-treaty.component';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';

@Component({
  selector: 'app-jv-prenium-reserve',
  templateUrl: './jv-prenium-reserve.component.html',
  styleUrls: ['./jv-prenium-reserve.component.css']
})
export class JvPreniumReserveComponent implements OnInit {
	@Input() jvDetail:any;
	@Input() cedingParams:any;
	@Output() emitData = new EventEmitter<any>();
	@ViewChild('modal') modal: ModalComponent; 
	@ViewChild(MtnCedingCompanyTreatyComponent) cedingCoLov: MtnCedingCompanyTreatyComponent;
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
	@ViewChild(MtnCurrencyComponent) currLov: MtnCurrencyComponent;

	passData: any = {
		tableData:[],
		tHeader:['Quarter Ending','Currency','Currency Rate','Funds Held Released','Interest Rate','Interest on Premium','Withholding Tax Rate','Withholding Tax'],
		dataTypes:['date','text','percent','currency','percent','currency','percent','currency'],
		total:[null,null,'Total','releaseAmt',null,'interestAmt',null,'whtaxAmt'],
		addFlag:true,
		magnifyingGlass: ['quarterEnding','currCd'],
		deleteFlag:true,
		infoFlag:true,
		paginateFlag:true,	
		disableAdd: true,
		btnDisabled: false,
		pageID:1,
		nData: {
			showMG:1,
			colMG:[],			
			itemNo: null,
			quarterEnding : '',
			currCd : '',
			currRate : '',
			interestRate: '',
			interestAmt : '',
			whtaxAmtRate: '',
			whtaxAmt : '',
			releaseAmt : '',
			localAmt : '',
			premResQuota : '',
			premRes1surplus : '',
			premRes2surplus : '',
			createUser : this.ns.getCurrentUser(),
			createDate : this.ns.toDateTimeString(0),
			updateUser : this.ns.getCurrentUser(),
			updateDate : this.ns.toDateTimeString(0)
		},
		checkFlag: true,
		uneditable: [true,false,false,false,false,false,false,false],
		keys:['quarterEnding', 'currCd', 'currRate', 'releaseAmt', 'interestRate' ,'interestAmt','whtaxRate', 'whtaxAmt'],
		widths:[150,80,95,210,105,125,105,125]
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
	totalInterestAmt: number = 0;
	totalWhtaxAmt: number = 0;
	readOnly: boolean = false;
	currencies: any = [];
	dataIndex: any = null;
	intRate: number;
	whtaxRate: number;

	constructor(private accService: AccountingService, private titleService: Title, private ns: NotesService, private maintenanceService: MaintenanceService) { }

	ngOnInit() {
		this.getIntRate();
		this.getWhtxRate();
		this.titleService.setTitle("Acct-IT | JV QSOA");
		this.passData.nData.currCd = this.jvDetail.currCd;
		this.passData.nData.currRate = this.jvDetail.currRate;
		if(this.jvDetail.statusType !== 'N'){
		  	this.readOnly = true;	
		  	this.passData.uneditable = [true,true,true,true,true,true];
		  	this.passData.checkFlag =  false;
		  	this.passData.addFlag = false;
       		this.passData.deleteFlag = false;
		}
		this.retrievePremRes();
	}

	retrievePremRes(){
		this.accService.getAcitJVPremRes(this.jvDetail.tranId).subscribe((data:any) => {
			this.passData.tableData = [];
			this.totalInterestAmt = 0;
			this.totalWhtaxAmt = 0;
			if(data.premResRel.length!= 0){
				if(this.jvDetail.statusType == 'N'){
					this.passData.disableAdd = false;
				}
				this.premResData.cedingName = data.premResRel[0].cedingName;
				this.premResData.cedingId = data.premResRel[0].cedingId;
				this.check(this.premResData);
				for( var i = 0 ; i < data.premResRel.length;i++){
					this.passData.tableData.push(data.premResRel[i]);
					this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = this.ns.toDateTimeString(data.premResRel[i].quarterEnding);
					this.totalInterestAmt += this.passData.tableData[this.passData.tableData.length - 1].interestAmt;
					this.totalWhtaxAmt 	  += this.passData.tableData[this.passData.tableData.length - 1].whtaxAmt;
				}
			}
			
			this.table.refreshTable();
		});
	}

	onClickSave(){
		$('#confirm-save #modalBtn2').trigger('click');
	}

	prepareData(){
		var edited = [];
		var deleted = [];
		for(var i = 0 ;i < this.passData.tableData.length; i++){
			if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
				edited.push(this.passData.tableData[i]);
				edited[edited.length - 1].quarterEnding 	 = this.ns.toDateTimeString(edited[edited.length - 1].quarterEnding);
				edited[edited.length - 1].tranId	 		 = this.jvDetail.tranId;
				edited[edited.length - 1].cedingId   		 = this.premResData.cedingId;
				edited[edited.length - 1].totalInterestAmt   = this.totalInterestAmt;
				edited[edited.length - 1].totalWhtaxAmt      = this.totalWhtaxAmt;
				edited[edited.length - 1].createDate 		 = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
				edited[edited.length - 1].updateDate 		 = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
			}

			if(this.passData.tableData[i].deleted){
				deleted.push(this.passData.tableData[i]);
			}
		}
		this.premResData.tranType = this.jvDetail.tranType;
		this.premResData.tranId = this.jvDetail.tranId;
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

	quarterEndModal(data){
		console.log(data)
		if(data.key === 'quarterEnding'){
			$('#quarterEnd #modalBtn').trigger('click');
			this.dataIndex = data.index;
		}else if(data.key == 'currCd'){
			this.currLov.modal.openNoClose();
			this.dataIndex = data.index;
		}
		
	}

	cancel(){
		this.cancelBtn.clickCancel();
	}

	showCedingCompanyLOV() {
    	$('#cedingCompany #modalBtn').trigger('click');
  	}

  	setCedingcompany(data){
  		console.log(data)
  		this.premResData.cedingName = data.payeeName;
  		this.premResData.cedingId	= data.payeeCd;
  		this.passData.disableAdd = false;
  		this.ns.lovLoader(data.ev, 0);
  		this.retrievePremRes();
  		this.check(this.premResData);
  	}

  	check(data){
    this.emitData.emit({ cedingId: data.cedingId,
                         cedingName: data.cedingName
                       });
  	}

  	checkCode(ev){
     this.ns.lovLoader(ev, 1);
     this.cedingCoLov.checkCode(this.premResData.ceding, ev);
    }

    update(data){
    	this.totalWhtaxAmt = 0;
    	this.totalInterestAmt = 0;
    	for(var i = 0 ; i < this.passData.tableData.length; i++){
    		if(!this.passData.tableData[i].deleted){
    			this.totalInterestAmt += isNaN(this.passData.tableData[i].interestAmt) ? 0 : parseInt(this.passData.tableData[i].interestAmt);
				this.totalWhtaxAmt 	  += isNaN(this.passData.tableData[i].whtaxAmt) ? 0 : parseInt(this.passData.tableData[i].whtaxAmt);
    		}
    	}
    }

    setQuarter(data){
    	console.log(data)
    	this.passData.tableData[this.dataIndex].colMG.push('quarterEnding');
    	this.passData.tableData[this.dataIndex].edited = true;
    	this.passData.tableData[this.dataIndex].quarterEnding = this.ns.toDateTimeString(data.premRes.quarterEnding);
    	this.passData.tableData[this.dataIndex].releaseAmt = data.premRes.fundsHeld;
    	this.passData.tableData[this.dataIndex].localAmt = data.premRes.fundsHeld * this.jvDetail.currRate;
    	this.passData.tableData[this.dataIndex].interestRate = this.intRate;
    	this.passData.tableData[this.dataIndex].interestAmt = data.premRes.fundsHeld * this.intRate;
    	this.passData.tableData[this.dataIndex].whtaxRate = this.whtaxRate;
    	this.passData.tableData[this.dataIndex].whtaxAmt = this.passData.tableData[this.dataIndex].interestAmt * this.whtaxRate;
		this.passData.tableData[this.dataIndex].premResQuota = data.premRes.premResQuota;
		this.passData.tableData[this.dataIndex].premRes1surplus = data.premRes.premRes1surplus;
		this.passData.tableData[this.dataIndex].premRes2surplus = data.premRes.premRes2surplus;
		this.totalInterestAmt = this.passData.tableData[this.dataIndex].interestAmt;
		this.totalWhtaxAmt 	  = this.passData.tableData[this.dataIndex].whtaxAmt;
    	this.table.refreshTable();
    }

    setCurrency(data){
    	this.passData.tableData[this.dataIndex].colMG.push('currCd');
    	this.passData.tableData[this.dataIndex].edited = true;
    	this.passData.tableData[this.dataIndex].currCd = data.currencyCd;
    	this.passData.tableData[this.dataIndex].currRt = data.currencyRt;
    	this.table.refreshTable();
    }

    getIntRate(){
    	this.maintenanceService.getMtnParameters('N','UPR_INT_RT_ON_PREM').subscribe((data:any) =>{
    	  this.intRate = parseInt(data.parameters[0].paramValueN);
    	});
    }

    getWhtxRate(){
    	this.maintenanceService.getMtnParameters('N','UPR_WHTAX_RT_ON_INT').subscribe((data:any) =>{
    	  this.whtaxRate = parseInt(data.parameters[0].paramValueN);
    	});
    }
}
