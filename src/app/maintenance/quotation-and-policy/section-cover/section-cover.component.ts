import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import * as deepEqual from "deep-equal";
import { FormControl } from '@angular/forms';
import { SystemComponent } from '@app/maintenance/system/system.component';

@Component({
  selector: 'app-section-cover',
  templateUrl: './section-cover.component.html',
  styleUrls: ['./section-cover.component.css']
})
export class SectionCoverComponent implements OnInit {

  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild("secTable") secTable: CustEditableNonDatatableComponent;
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

  passSecTable:any={
  	tableData:[],
  	widths:[1,1,1,1,'auto',1,1,1,1,'auto'],
  	tHeader:['Section','Bullet No','Cover Code','Abbreviation','Description','Add SI','Active','Default','Sort Seq','Remarks'],
  	dataTypes:['text','number','sequence-3','text','text','checkbox','checkbox','checkbox','number','text'],
  	keys:['section','bulletNo','coverCd','coverCdAbbr','coverName','addSi','activeTag','defaultTag','sortSeq','remarks'],
  	uneditable:[false,false,true,false,false,false,false,false,false,false],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 10,
  	pageId: 'endt',
  	nData:{
  	  lineCd:'',
  	  coverCd:'',
  	  coverCdAbbr:'',
  	  coverName:'',
  	  section:'',
  	  sortSeq:'',
  	  bulletNo:'',
  	  addSi:'N',
      defaultTag: "N",
      activeTag: "Y",
      remarks: null,
      createUser: this.ns.getCurrentUser(),
      createDate: 0,
      updateUser: this.ns.getCurrentUser(),
      updateDate: 0,
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
          "coverCd": "",
          "endtCd": "0",
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
          "updateUser": this.ns.getCurrentUser(),
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
  	setTimeout(a=>{this.secTable.refreshTable();this.dedTable.refreshTable();},0);
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
	if(this.dedTable.form.dirty || this.secTable.form.dirty){
		this.onClickSave();
		this.secTable.markAsPristine();
		this.dedTable.markAsPristine();
		return;
	}
	this.ns.lovLoader(ev, 1);
	this.lineLov.checkCode(this.line.lineCd.toUpperCase(), ev);
  }

  setLine(data){
      this.line.lineCd = data.lineCd;
      this.passSecTable.nData.lineCd = data.lineCd;
      this.passDedTable.nData.lineCd = data.lineCd;
      this.line.description = data.description;
      this.ns.lovLoader(data.ev, 0);
      this.getMtnSectionCovers();
  }

  getMtnSectionCovers(){
	this.secTable.loadingFlag = true;
  	this.ms.getMtnSectionCovers(this.line.lineCd,'').subscribe(a=>{
		//deza was here 7/5/2019 #8221 MTN112
		if(this.line.lineCd != ''){
			this.passSecTable.disableAdd = false;
			//also changed disableGeneric
		  	this.passSecTable.disableGeneric = true;
		 	this.passSecTable.tableData = a['sectionCovers'];
			this.passSecTable.tableData.forEach(a=>{{
				a.deductibles = a.deductibles.filter(b=>b.deductibleCd != null)
			}})
		}else{
			this.passSecTable.disableAdd = true;
			this.passSecTable.disableGeneric = true;
			this.passSecTable.tableData = [];
		}
		//deza 7/5/2019 4:25 PM
  		this.secClick(null);
		this.secTable.refreshTable();
  	})
  }

  onCancelSave(){
	  if(this.line.lineCd != this.passSecTable.nData.lineCd){
		  this.getMtnSectionCovers();
	  }
  }

  deleteSec(){
  	if(this.secTable.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'You are not allowed to delete a Section Cover that is already used in quotation processing.';
  		this.successDialog.open();
  	}else{
  		this.secTable.selected  = [this.secTable.indvSelect]
  		this.secTable.confirmDelete();
  	}
  }

  deleteDed(){
  	if(this.dedTable.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'You are not allowed to delete a Deductible that is already used in quotation processing.';
  		this.successDialog.open();
  	}else{
  		this.dedTable.selected  = [this.dedTable.indvSelect]
  		this.dedTable.confirmDelete();
  	}
  }

  secClick(data){
  	if(data != null){
		//deza was here 7/5/2019 #8221 MTN112
		this.passSecTable.disableGeneric = false;
		//deza
  		this.passDedTable.tableData = data.deductibles;
  		this.passDedTable.disableAdd = false;
  		this.passDedTable.disableGeneric = true;
  		this.passDedTable.nData.coverCd = data.coverCd;
  		this.disableFields();
  		this.info = data;
  	}else{
		//deza was here 7/5/2019 #8221 MTN112
		this.passSecTable.disableGeneric = true;
		//deza
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

  //deza was here 7/5/2019 #8221 MTN112
  dedClick(data){
	if(data != null){
  		this.passDedTable.disableGeneric = false;
  	}else{
  		this.passDedTable.disableGeneric = true;
  	}
  	this.dedTable.refreshTable();
  }
  //deza

  disableFields(){
  	// 'deductibleAmt','deductibleRate','minAmt','maxAmt'
  	this.passDedTable.tableData.forEach(a=>{
  		if(a.deductibleType == 'F'){
  			a.uneditable = ['deductibleRate','minAmt','maxAmt','deductibleCd'];
  			a.uneditable.forEach((b,i)=>{
  				if(i != a.uneditable.length-1)
  					a[b] = '';
  			})
  		}else{
  			a.uneditable = ['deductibleAmt','deductibleCd'];
	  		a.uneditable.forEach((b,i)=>{
	  			if(i != a.uneditable.length-1)
	  				a[b] = '';
	  		})
  		}

  		if(a.add){
  			a.uneditable.pop();
  		}
  	})
  }

  
  save(can?){
	//deza was here 7/12/2019 **START**
  	if(this.passSecTable.tableData.some((a,i)=> this.passSecTable.tableData.filter(b=> a.bulletNo==b.bulletNo && a.section==b.section && a.deleted==undefined && b.deleted==undefined ).length > 1)){
		this.dialogMessage = 'Unable to save the record. Bullet No must be unique per Section';
  		this.dialogIcon = 'error-message';
  		this.successDialog.open();
  		return;
	}
  	if(this.passSecTable.tableData.some((a,i)=> this.passSecTable.tableData.filter(b=>a.sortSeq == b.sortSeq && a.section==b.section && a.deleted==undefined && b.deleted==undefined && a.sortSeq==""  && b.sortSeq=="").length > 1)){
		this.dialogMessage = 'Unable to save the record. Sort Sequence must be unique per Section';
		this.dialogIcon = 'error-message';
		this.successDialog.open();
		return;
	}
	if(this.passSecTable.tableData.some((a,i)=> a.sortSeq % 1 != 0 || a.sortSeq > 999  && a.deleted==undefined)){
		this.dialogIcon = 'error';
		this.successDialog.open();
		return;
	}
  	let dedCds : string[];
  	for(let sec of this.passSecTable.tableData){
  		dedCds = sec.deductibles.filter(a=>!a.deleted).map(a=>a.deductibleCd);
		if(sec.deductibles.some(ded=>(ded.deductibleType == 'F' && !(parseFloat(ded.deductibleAmt)>0))|| ded.deductibleType != 'F' && !(parseFloat(ded.deductibleRate)>0))){
  			this.dialogIcon = "error";
    		this.successDialog.open();
    		return;
		}

  		if(dedCds.some((a,i)=>dedCds.indexOf(a) != i)){
  			this.dialogMessage = 'Unable to save the record. Deductible Code must be unique per Section Cover';
	  		this.dialogIcon = 'error-message';
	  		this.successDialog.open();
	  		return;
  		}
	}
	//deza for validation of fields **END**

	this.cancelFlag = can !== undefined;
	
  	let params : any = {
  		saveDeductibles : [],
  		deleteDeductibles :[],
  		saveSectionCover:[],
  		delSectionCover:[],
  		addSectionCover:[]
  	}
  	
  	for(let sec of this.passSecTable.tableData){
  		if(sec.edited && !sec.deleted && !sec.add){
            sec.updateDate = this.ns.toDateTimeString(0);
            sec.createDate = this.ns.toDateTimeString(sec.createDate);
            sec.updateUser = this.ns.getCurrentUser();
            params.saveSectionCover.push(sec);
  		}else if(sec.edited && sec.add && !sec.deleted){
  			sec.updateDate = this.ns.toDateTimeString(0);
            sec.createDate = this.ns.toDateTimeString(sec.createDate);
            sec.deductibles.forEach(ded=>{
            	ded.updateDate = this.ns.toDateTimeString(0);
	            ded.createDate = this.ns.toDateTimeString(ded.createDate);
            })
            params.addSectionCover.push(sec);
  		}
  		if(!sec.add){
	  		for(let ded of sec.deductibles){
	  			if(ded.edited && !ded.deleted){
	  				ded.updateDate = this.ns.toDateTimeString(0);
		            ded.createDate = this.ns.toDateTimeString(ded.createDate);
		            ded.updateUser = this.ns.getCurrentUser();
		            ded.coverCd = sec.coverCd;
		            params.saveDeductibles.push(ded);
	  			}else if(ded.deleted){
	  				params.deleteDeductibles.push(ded);
	  			}
	  		}
	  	}

  	}
  	params.delSectionCover = this.passSecTable.tableData.filter(a=>a.deleted);


  	this.ms.saveMtnSectionCovers(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            //this.getMtnSectionCovers(); //deza was here removed for #8221 MTN112 
        }else{
			this.cancelFlag = false;//deza was here 7/8/2019 #8221 MTN112
			this.dialogIcon = "error";
            this.successDialog.open(); 
		}
	  })

	  
	if(this.line.lineCd != this.passSecTable.nData.lineCd){
		this.getMtnSectionCovers();
	}
  }

  onClickSave(){
  	if(this.passSecTable.tableData.some((a,i)=> this.passSecTable.tableData.filter(b=> a.bulletNo==b.bulletNo && a.section==b.section && a.deleted==undefined && b.deleted==undefined ).length > 1)){
		this.dialogMessage = 'Unable to save the record. Bullet No must be unique per Section';
  		this.dialogIcon = 'error-message';
  		this.successDialog.open();
  		return;
	}
	//deza was here
  	if(this.passSecTable.tableData.some((a,i)=> this.passSecTable.tableData.filter(b=>a.sortSeq == b.sortSeq && a.section==b.section && a.deleted==undefined && b.deleted==undefined && a.sortSeq=="" && b.sortSeq=="" ).length > 1)){
		this.dialogMessage = 'Unable to save the record. Sort Sequence must be unique per Section';
		this.dialogIcon = 'error-message';
		this.successDialog.open();
		return;
	}
	if(this.passSecTable.tableData.some((a,i)=> a.sortSeq % 1 != 0 || a.sortSeq > 999 && a.deleted==undefined)){
		this.dialogIcon = 'error';
		this.successDialog.open();
		return;
	}
	//deza 7/5/2019 3:35PM
  	let dedCds : string[];
  	for(let sec of this.passSecTable.tableData){
  		dedCds = sec.deductibles.filter(a=>!a.deleted).map(a=>a.deductibleCd);
		if(sec.deductibles.some(ded=>(ded.deductibleType == 'F' && !(parseFloat(ded.deductibleAmt)>0))|| ded.deductibleType != 'F' && !(parseFloat(ded.deductibleRate)>0))){
  			this.dialogIcon = "error";
    		this.successDialog.open();
    		return;
		}

  		if(dedCds.some((a,i)=>dedCds.indexOf(a) != i)){
  			this.dialogMessage = 'Unable to save the record. Deductible Code must be unique per Section Cover';
	  		this.dialogIcon = 'error-message';
	  		this.successDialog.open();
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
