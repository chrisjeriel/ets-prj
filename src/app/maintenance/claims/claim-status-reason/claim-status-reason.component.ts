import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnClaimStatusLovComponent } from '@app/maintenance/mtn-claim-status-lov/mtn-claim-status-lov.component';
import { MaintenanceService, NotesService } from '@app/_services';

@Component({
  selector: 'app-claim-status-reason',
  templateUrl: './claim-status-reason.component.html',
  styleUrls: ['./claim-status-reason.component.css']
})
export class ClaimStatusReasonComponent implements OnInit {

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild('statusMdl') statusLOV : MtnClaimStatusLovComponent;

  private currentUser: string = JSON.parse(window.localStorage.currentUser).username;

  dialogIcon: string = "";
  dialogMessage: string = "";

  counter: number = 1;
  clmStatCdIndex: number = 0;

  selectedRow: any;
  indvSelect: any;

  cancelFlag: boolean = false;

  savedData: any = [];
  deletedData: any = [];

  claimStatReasonData: any = {
  	tableData: [],
  	tHeader: ['Reason Code', 'Description', 'Active', 'Claim Status', 'Remarks'],
  	dataTypes: ['text', 'text', 'checkbox', 'lovInput', 'text'],
  	keys: ['reasonCd', 'description', 'activeTag', 'clmStatCd','remarks'],
  	widths: [1,'auto',1,'auto', 'auto'],
  	uneditable: [false,false,false,false, false],
  	nData: {
  		reasonCd: '',
        addCounter: '1',
  		description: '',
  		activeTag: 'Y',
  		clmStatCd: '',
  		renarks: '',
  		createUser: this.currentUser,
  		createDate: this.ns.toDateTimeString(0),
  		updateUser: this.currentUser,
  		updateDate: this.ns.toDateTimeString(0),
  		showMG: 1
  	},
  	paginateFlag: true,
  	magnifyingGlass: ['clmStatCd'],
  	infoFlag: true,
  	addFlag: true,
  	searchFlag: true,
    genericBtn: 'Delete'
  }

  constructor(private route: ActivatedRoute,private router: Router, private ms: MaintenanceService, private ns: NotesService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.retrieveMtnClaimReason();
  }

  retrieveMtnClaimReason(){
  	this.claimStatReasonData.tableData = [];
  	this.ms.getMtnClaimReason().subscribe((data: any)=>{
  		console.log(data);
  		for(let i of data.clmReasonList){
  			i.uneditable = 'reasonCd';
  			i.clmStatCd = i.clmStatCd + ' - ' + i.clmStatDesc;
  			this.claimStatReasonData.tableData.push(i);
  		}
  		//this.claimStatReasonData.tableData = data.nonRenewalReasonList;
  		this.table.refreshTable();
  		this.table.onRowClick(null, this.claimStatReasonData.tableData[0]);
  	});
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('');
      }
    }

  onRowClick(data){
    if(data !== null){
      this.claimStatReasonData.disableGeneric = false;
      this.selectedRow = data;
    }else{
      this.claimStatReasonData.disableGeneric = true;
    }
  	
  }

  onClickAdd(event){
    this.counter += 1;
    this.claimStatReasonData.nData.addCounter = this.counter.toString();
  }

  onClickSave(){
  	if(this.checkFields() && this.checkForDuplicates()){
  		$('#confirm-save #modalBtn2').trigger('click');
  	}else if(!this.checkFields()){
  		this.dialogIcon = 'error';
  		this.successDiag.open();
  	}else if(!this.checkForDuplicates()){
  		this.dialogIcon = 'info';
  		this.dialogMessage = 'Unable to save the record. Reason code must be unique.';
  		this.successDiag.open();
  	}

  }

  onClickDelete(data){
    this.table.selected = [this.table.indvSelect];
    if(this.table.selected[0].okDelete > 0){
    	this.dialogIcon = 'info';
    	this.dialogMessage = 'You are not allowed to delete a Reason Code that is already used in Change Claim Status Screen.';
    	this.successDiag.open();
    }else{
    	this.table.confirmDelete();
    }
  }

  delete(){
    this.table.markAsDirty();
    this.deletedData.push(this.indvSelect);
    this.claimStatReasonData.tableData = this.claimStatReasonData.tableData.filter(a =>{
                                            if(this.indvSelect.addCounter === undefined){
                                              return a.adviceWordId !== this.indvSelect.adviceWordId;
                                            }else{
                                              return a.addCounter !== this.indvSelect.addCounter;
                                            }
                                        });
    this.table.refreshTable();
  }

  onClickCancel(){
  	this.cancelBtn.clickCancel();
  }

  save(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	this.savedData = [];
  	this.deletedData = [];

  	for (var i = 0 ; this.claimStatReasonData.tableData.length > i; i++) {
  	  if(this.claimStatReasonData.tableData[i].edited && !this.claimStatReasonData.tableData[i].deleted){
  	      this.savedData.push(this.claimStatReasonData.tableData[i]);
  	      //this.savedData[this.savedData.length-1].adviceWordId = '0';
  	      this.savedData[this.savedData.length-1].clmStatCd = String(this.savedData[this.savedData.length-1].clmStatCd).split('-')[0].trim();
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
  	  }
  	  else if(this.claimStatReasonData.tableData[i].edited && this.claimStatReasonData.tableData[i].deleted){
  	     this.deletedData.push(this.claimStatReasonData.tableData[i]);
  	     this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
  	     this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	  }

  	}

  	if(this.savedData.length === 0 && this.deletedData.length === 0){
        setTimeout(()=>{
          this.dialogIcon = '';
          this.successDiag.open();
          this.deletedData = [];
          this.savedData = [];
          this.table.markAsPristine();
          this.retrieveMtnClaimReason();
        },0);
    }else{
    	let params: any = {
    		saveClmReason: this.savedData,
    		delClmReason: this.deletedData
    	}
      this.ms.saveMtnClaimReason(JSON.stringify(params)).subscribe((data:any)=>{
        if(data.returnCode === 0){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          this.dialogIcon = '';
          this.successDiag.open();
          this.deletedData = [];
          this.savedData = [];
          this.table.markAsPristine();
          this.retrieveMtnClaimReason();
        }
      });
    }
  }

  checkFields(){
  	//check if required values are filled
  	for(var i of this.claimStatReasonData.tableData){
  		if(i.reasonCd.length === 0 || i.reasonCd === undefined || i.reasonCd === null ||
  		   i.description.length === 0 || i.description === undefined || i.description === null){
  			return false;
  		}
  	}
  	return true;
  }

  checkForDuplicates(){
  	//check if there are similar reasonCd
  	for(var j = 0; j < this.claimStatReasonData.tableData.length; j++){
  		for(var k = j; k < this.claimStatReasonData.tableData.length; k++){
  			if(j !== k && this.claimStatReasonData.tableData[j].reasonCd === this.claimStatReasonData.tableData[k].reasonCd){
  				return false;
  			}
  		}
  	}
  	return true;
  }

  update(data){
  	this.claimStatReasonData.tableData = data;
  	if(data.hasOwnProperty('lovInput') && data.key === 'clmStatCd'){
  		this.clmStatCdIndex = data.index;
  		console.log(data.ev.target.value);
  		this.statusLOV.checkCode(String(data.ev.target.value).toUpperCase(), data.ev);
  	}
  }

  setStatus(data){
  	console.log(data);
  	if(data.statusCode.length !== 0){
  		this.claimStatReasonData.tableData[this.clmStatCdIndex].clmStatCd = data.statusCode + ' - ' + data.description;
  	}else{
  		this.claimStatReasonData.tableData[this.clmStatCdIndex].clmStatCd = '';
  	}
  	this.ns.lovLoader(data.ev, 0);
  	this.table.refreshTable();
  }

  claimStatusLOV(data){
  	if(data.key === 'clmStatCd'){
  		this.clmStatCdIndex = data.index;
  		this.statusLOV.modal.openNoClose();
  	}
  }

}
