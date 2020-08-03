import { Component, OnInit, ViewChild } from '@angular/core';
import { CustEditableNonDatatableComponent, SucessDialogComponent, ConfirmSaveComponent, CancelButtonComponent, ModalComponent} from '@app/_components/common';
import { MaintenanceService, NotesService } from '@app/_services'; 
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';

@Component({
  selector: 'app-prem-plan',
  templateUrl: './prem-plan.component.html',
  styleUrls: ['./prem-plan.component.css']
})
export class PremPlanComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild('copyModal') copyModal : ModalComponent;

	passData: any = {
	  	tableData: [],
	  	tHeader: ['Month','Premium Amount', 'Remarks'],
	  	dataTypes: ['text', 'currency', 'text'],
	  	keys: ['planMm', 'premPlan',  'remarks'],
	  	widths: [150,150,'auto'],
	  	// widths: ['auto','auto','auto','auto','auto',1,'auto'],
	  	uneditable: [true,false,false],
	  	nData: {
			},
		genericBtn: 'Copy Setup',
		disableGeneric: false,
		pageLength : 12
		};

	searchParams:any = {
		lineCd: '',
		lineDesc: '',
		currencyCd: '',
		planYear: '',
	};

	copyParams:any = {
		fromCurrencyCd: '' ,
		fromLineCd: '' ,
		fromPlanYear: '' ,
		toCurrencyCd: '' ,
		toLineCd: '' ,
		toLineDesc: '',
		toPlanYear: '' ,
		user: this.ns.getCurrentUser()
	}


  constructor(private ns: NotesService, private ms: MaintenanceService) { }
  currencyList:any = [];
  selected:any;

  cancel: boolean;

  dialogIcon:any = '';
  dialogMessage:any = '';
  fromCopy:any = false;

  ngOnInit() {
  	this.ms.getMtnCurrencyList(null).subscribe(a=>{
  		this.currencyList = a['currency'].filter(b=>b.activeTag=='Y');
  	})
  }

  showCopyMdl(){

  }

  search(){
  	this.table.overlayLoader = true;
  	this.selected = null;
  	this.ms.getMtnPremPlan(this.searchParams).subscribe(a=>{
  		this.passData.tableData = a['list'];
  		this.passData.tableData.forEach(a=>{
  			a.createDate = this.ns.toDateTimeString(a.createDate);
  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
  		})
  		this.table.refreshTable();
  		this.copyParams.fromCurrencyCd = this.searchParams.currencyCd;
  		this.copyParams.fromLineCd = this.searchParams.lineCd;
  		this.copyParams.fromPlanYear = this.searchParams.planYear;

  		this.copyParams.toCurrencyCd = this.searchParams.currencyCd;
  		this.copyParams.toLineCd = this.searchParams.lineCd;
  		this.copyParams.toLineDesc = this.searchParams.lineDesc;
  		this.copyParams.toPlanYear = new Date().getFullYear()+1;

  	})
  }

  checkCode(ev, fromCopy?){
  	this.fromCopy = fromCopy != undefined && fromCopy;
    this.ns.lovLoader(ev, 1);
    if(fromCopy){
    	this.lineLov.checkCode(this.copyParams.toLineCd.toUpperCase(), ev);
    }else{
    	this.lineLov.checkCode(this.searchParams.lineCd.toUpperCase(), ev);
    }
  }

  setLine(data){
  	if(this.fromCopy){
  		this.copyParams.toLineCd = data.lineCd;
  		this.copyParams.toLineDesc = data.description;
  	}else{  		
  		this.searchParams.lineCd = data.lineCd;
  		this.searchParams.lineDesc = data.description;
  	}
    this.ns.lovLoader(data.ev, 0);
  }

  showLineLOV(fromCopy?){
  	this.fromCopy = fromCopy != undefined && fromCopy;
  	this.lineLov.modal.openNoClose();
  }

  onRowClick(data){
  	this.selected = data;
  }

  

  onClickSave() {
   	if(!this.cancel) {
  		this.confirmSave.confirmModal();
  	} else {
  		this.save(false);
  	}
  }

  save(cancel?) {
  	this.cancel = cancel !== undefined;

  	if(this.cancel && cancel) {
  		this.onClickSave();
  		return;
  	}


  	let params:any = {};
  	params.saveList = JSON.parse(JSON.stringify(this.passData.tableData.filter(a=>a.edited)));
  	params.saveList.forEach((a)=>{
  		a.updateUser = this.ns.getCurrentUser();
  	})


  	this.ms.saveMtnPremPlan(params).subscribe(data => {
  		if(data['returnCode'] == -1) {
  			this.dialogIcon = "success";
  			this.successDialog.open();
  			this.search();
  			this.table.markAsPristine();
  		} else {
  			this.dialogIcon = "error";
  			this.successDialog.open();
  		}
  	});
  }


  copy(){
  	this.ms.copyMtnPremPlan(this.copyParams).subscribe(data=>{
  		if(data['returnCode'] == -1) {
  			this.dialogIcon = "success";
  			this.successDialog.open();
  			this.searchParams.currencyCd = this.copyParams.toCurrencyCd;
  			this.searchParams.lineCd = this.copyParams.toLineCd;
  			this.searchParams.lineDesc = this.copyParams.toLineDesc;
  			this.searchParams.planYear = this.copyParams.toPlanYear;
  			this.search();
  			this.copyModal.closeModal()
  		} else if(data['returnCode']==20000){
  			this.dialogIcon = "error-message";
  			for(let msg of data['errorList']){
  			  this.dialogMessage = msg.errorMessage;
  			}
  			this.successDialog.open();

  		}else {
  			this.dialogIcon = "error";
  			this.successDialog.open();
  		}
  	})
  }

}
