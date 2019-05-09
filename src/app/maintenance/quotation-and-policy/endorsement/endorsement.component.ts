import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-endorsement',
  templateUrl: './endorsement.component.html',
  styleUrls: ['./endorsement.component.css']
})
export class EndorsementComponent implements OnInit {

  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild("endtTable") endtTable: CustEditableNonDatatableComponent;
  @ViewChild("dedTable") dedTable: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;


  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  dialogIcon:string = '';
  dialogMessage: string = '';

  line:any = {
	  lineCd:'',
	  description:'',
  }

  info:any = {
  	createUser : '',
  	createDate : '',
  	updateUser : '',
  	updateDate : '',
  }

  passEndtTable:any={
  	tableData:[],
  	widths:[1,'auto','auto','auto',1,1,'auto'],
  	tHeader:['Endt Code','Endt Name','Description','Wordings','Active','Default','Remarks'],
  	dataTypes:['sequence-3','text','text-editor','text-editor','checkbox','checkbox','text'],
  	keys:['endtCd','endtTitle','description','text','activeTag','defaultTag','remarks'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 10,
  	pageId: 'endt',
  	nData:{
  	  "lineCd": "",
      "lineDesc": "",
      "endtCd": "",
      "endtTitle": "",
      "description": "",
      "text":'',
      "defaultTag": "N",
      "activeTag": "N",
      "endtText01": "",
      "endtText02": null,
      "endtText03": null,
      "endtText04": null,
      "endtText05": null,
      "endtText06": null,
      "endtText07": null,
      "endtText08": null,
      "endtText09": null,
      "endtText10": null,
      "endtText11": null,
      "endtText12": null,
      "endtText13": null,
      "endtText14": null,
      "endtText15": null,
      "endtText16": null,
      "endtText17": null,
      "remarks": null,
      "createUser": this.ns.getCurrentUser(),
      "createDate": 0,
      "updateUser": this.ns.getCurrentUser(),
      "updateDate": 0,
      deductibles: []
  	},
  	disableGeneric : true,
  	disableAdd : true
  }

  passDedTable: any = {
        tableData            : [],
        tHeader              : ['Deductible', 'Title', 'Deductible Type','Deductible Amount','Rate','Minimum Amount','Maximum Amount','Deductible Text','Active','Default','Remarks'],
        dataTypes            : ['text','text','select','currency','percent','currency','currency','text','checkbox','checkbox','text'],
        nData:
        {
          "activeTag": "Y",
          "deductibleCd": "",
          "coverCd": 0,
          "endtCd": "",
          "defaultTag": "N",
          "deductibleTitle": "",
          "deductibleType": "F",
          "typeDesc": "",
          "deductibleRate": '',
          "deductibleAmt": '',
          "lineCd": "",
          "minAmt": '',
          "maxAmt": '',
          "deductibleText": '',
          "remarks": '',
          "createUser": this.ns.getCurrentUser(),
          "createDate": 0,
          "updateUser": "this.ns.getCurrentUser()",
          "updateDate": 0
        }
        ,
        opts: [{
            selector        : 'deductibleType',
            prev            : [],
            vals            : [],
        }],
        paginateFlag        : true,
        infoFlag            : true,
        searchFlag          : true,
        pageLength          : 5,
        addFlag             : true,
        keys                : ['deductibleCd','deductibleTitle','deductibleType','deductibleAmt','deductibleRate','minAmt','maxAmt','deductibleText','activeTag','defaultTag','remarks'],
        uneditable          : [false,false,false,false,false,false,false,false,false,false],
        pageID              : 'mtn-deductibles',
        widths              : [1,'auto','auto','auto','auto','auto','auto','auto','auto','auto'],
        genericBtn: 'Delete',
	  	disableGeneric : true,
	  	disableAdd : true


    };

  cancelFlag:boolean;

  constructor(private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
  	setTimeout(a=>{this.endtTable.refreshTable();this.dedTable.refreshTable();},0);

  	this.ms.getRefCode('MTN_DEDUCTIBLES.DEDUCTIBLE_TYPE')
            .subscribe(data =>{
                this.passDedTable.opts[0].vals = [];
                this.passDedTable.opts[0].prev = [];
                var rec = data['refCodeList'];
                for(let i of rec){
                    this.passDedTable.opts[0].vals.push(i.code);
                    this.passDedTable.opts[0].prev.push(i.description);
                }
    });
  }

  checkCode(ev){
    this.ns.lovLoader(ev, 1);
    this.lineLov.checkCode(this.line.lineCd.toUpperCase(), ev);
  }

  setLine(data){
      this.line.lineCd = data.lineCd;
      this.passEndtTable.nData.lineCd = data.lineCd;
      this.passDedTable.nData.lineCd = data.lineCd;
      this.line.description = data.description;
      this.ns.lovLoader(data.ev, 0);
      this.getMtnEndorsements();
  }

  getMtnEndorsements(){
  	this.endtTable.loadingFlag = true;
  	this.ms.getEndtCode(this.line.lineCd,'').subscribe(a=>{
  		this.passEndtTable.disableAdd = false;
  		this.passEndtTable.disableGeneric = false;
  		this.passEndtTable.tableData = a['endtCode'];
  		this.passEndtTable.tableData.forEach(a=>{{
  			a['text'] = (a.endtText01 === null ? '' :a.endtText01) + 
			                 (a.endtText02 === null ? '' :a.endtText02) + 
			                 (a.endtText03 === null ? '' :a.endtText03) + 
			                 (a.endtText04 === null ? '' :a.endtText04) + 
			                 (a.endtText05 === null ? '' :a.endtText05) + 
			                 (a.endtText06 === null ? '' :a.endtText06) + 
			                 (a.endtText07 === null ? '' :a.endtText07) + 
			                 (a.endtText08 === null ? '' :a.endtText08) + 
			                 (a.endtText09 === null ? '' :a.endtText09) + 
			                 (a.endtText10 === null ? '' :a.endtText10) + 
			                 (a.endtText11 === null ? '' :a.endtText11) + 
			                 (a.endtText12 === null ? '' :a.endtText12) + 
			                 (a.endtText13 === null ? '' :a.endtText13) + 
			                 (a.endtText14 === null ? '' :a.endtText14) + 
			                 (a.endtText15 === null ? '' :a.endtText15) + 
			                 (a.endtText16 === null ? '' :a.endtText16) + 
			                 (a.endtText17 === null ? '' :a.endtText17) ;
			a.deductibles = a.deductibles.filter(b=>b.deductibleCd != null)
			a.uneditable = ['endtCd']
  		}})
  		this.endtTable.refreshTable();
  	})
  }

  deleteEndt(){
  	if(this.endtTable.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'You are not allowed to delete an Endorsement that is already used in quotation processing.';
  		this.successDialog.open();
  	}else{
  		this.endtTable.indvSelect.deleted = true;
  		this.endtTable.selected  = [this.endtTable.indvSelect]
  		this.endtTable.confirmDelete();
  	}
  }

  deleteDed(){
  	if(this.dedTable.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'You are not allowed to delete a Deductible that is already used in quotation processing.';
  		this.successDialog.open();
  	}else{
  		this.dedTable.indvSelect.deleted = true;
  		this.dedTable.selected  = [this.dedTable.indvSelect]
  		this.dedTable.confirmDelete();
  	}
  }

  endtClick(data){
  	if(data != null){
  		this.passDedTable.tableData = data.deductibles;
  		this.passDedTable.disableAdd = false;
  		this.passDedTable.disableGeneric = false;
  		this.passDedTable.nData.endtCd = data.endtCd;
  		this.disableFields();
  		this.info = data;
  	}else{
  		this.passDedTable.disableAdd = true;
  		this.passDedTable.disableGeneric = true;
  		this.passDedTable.tableData = [];
  		this.info = {
		  	createUser : '',
		  	createDate : '',
		  	updateUser : '',
		  	updateDate : '',
		  }
  	}
  	this.dedTable.refreshTable();
  }

  disableFields(){
  	// 'deductibleAmt','deductibleRate','minAmt','maxAmt'
  	this.passDedTable.tableData.forEach(a=>{
  		if(a.deductibleType == 'F'){
  			a.uneditable = ['deductibleRate','minAmt','maxAmt'];	
  			a.uneditable.forEach(b=>{
  				a[b] = '';
  			})
  		}else{
  			a.uneditable = ['deductibleAmt'];
  			a.uneditable.forEach(b=>{
  				a[b] = '';
  			})
  		}
  	})
  }

  endtTextKeys:string[] = ['endtText01','endtText02','endtText03','endtText04','endtText05','endtText06','endtText07','endtText08','endtText09','endtText10','endtText11','endtText12','endtText13','endtText14','endtText15','endtText16','endtText17'];
  save(can?){
  	this.cancelFlag = can !== undefined;
  	let params : any = {
  		saveEndorsement : [],
  		delEndorsement :[],
  		saveDeductibles:[],
  		deleteDeductibles:[]
  	}
  	
  	for(let endt of this.passEndtTable.tableData){
  		if(endt.edited && !endt.deleted){
  			let endtTextSplit = endt.text.match(/(.|[\r\n]){1,2000}/g);
            if(endtTextSplit!== null)
                for (var i = 0; i < endtTextSplit.length; ++i) {
                    endt[this.endtTextKeys[i]] = endtTextSplit[i];
            }
            endt.updateDate = this.ns.toDateTimeString(0);
            endt.createDate = this.ns.toDateTimeString(endt.createDate);
            endt.updateUser = this.ns.getCurrentUser();
            params.saveEndorsement.push(endt);
  		}

  		if(!endt.deleted){
  			let endtTextSplit = endt.text.match(/(.|[\r\n]){1,2000}/g);
            if(endtTextSplit!== null)
                for (var i = 0; i < endtTextSplit.length; ++i) {
                    endt[this.endtTextKeys[i]] = endtTextSplit[i];
            }
            endt.updateDate = this.ns.toDateTimeString(0);
            endt.createDate = this.ns.toDateTimeString(endt.createDate);
            endt.updateUser = this.ns.getCurrentUser();
            params.saveEndorsement.push(endt);
  		}

  		for(let ded of endt.deductibles){
  			if(ded.edited && !ded.deleted){
  				if(ded.deductibleType == 'F' && !(parseFloat(ded.deductibleAmt)>0)){
		  			this.dialogIcon = "error";
            		this.successDialog.open();
            		return;
		  		}else if(ded.deductibleType != 'F' && !(parseFloat(ded.deductibleRate)>0)){
		  			this.dialogIcon = "error";
            		this.successDialog.open();
            		return;
		  		}

  				ded.updateDate = this.ns.toDateTimeString(0);
	            ded.createDate = this.ns.toDateTimeString(ded.createDate);
	            ded.updateUser = this.ns.getCurrentUser();
	            ded.endtCd = endt.endtCd;
	            params.saveDeductibles.push(ded);
  			}else if(ded.deleted){
  				params.deleteDeductibles.push(ded);
  			}
  		}

  	}
  	params.delEndorsement = this.passEndtTable.tableData.filter(a=>a.deleted);


  	this.ms.saveMtnEndt(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            this.getMtnEndorsements();
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	})

  }

  onClickSave(){
  	
  	let endtCds:string[] = this.passEndtTable.tableData.filter(a=>!a.deleted).map(a=>String(a.endtCd).padStart(3,'0'));

  	if(endtCds.some((a,i)=>endtCds.indexOf(a) != i)){
  		this.dialogMessage = 'Unable to save the record. Endt Code must be unique per Line';
  		this.dialogIcon = 'error-message';
  		this.successDialog.open();
  		return;
  	}
  	let dedCds : string[];
  	for(let endt of this.passEndtTable.tableData){
  		dedCds = endt.deductibles.filter(a=>!a.deleted).map(a=>a.deductibleCd);
  		if(dedCds.some((a,i)=>dedCds.indexOf(a) != i)){
  			this.dialogMessage = 'Unable to save the record. Deductible Code must be unique per Endorsement';
	  		this.dialogIcon = 'error-message';
	  		this.successDialog.open();
	  		this.endtTable.markAsPristine();
	  		this.dedTable.markAsPristine();
	  		return;
  		}
  	}
  	this.conSave.confirmModal();
  }

  onClickCancel(){
  	this.cnclBtn.clickCancel();
  }

  showLineLOV(){
    $('#lineLOV #modalBtn').trigger('click');
}

}
