import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MaintenanceService, NotesService } from '@app/_services';

@Component({
  selector: 'app-mtn-non-renewal-reason',
  templateUrl: './mtn-non-renewal-reason.component.html',
  styleUrls: ['./mtn-non-renewal-reason.component.css']
})
export class MtnNonRenewalReasonComponent implements OnInit {

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  private currentUser: string = JSON.parse(window.localStorage.currentUser).username;

  dialogIcon: string = "";
  dialogMessage: string = "";

  counter: number = 1;

  selectedRow: any;
  indvSelect: any;

  cancelFlag: boolean = false;

  savedData: any = [];
  deletedData: any = [];

  nonRenewalReasonData: any = {
  	tableData: [],
  	tHeader: ['Reason Code', 'Description', 'Active', 'Remarks'],
  	dataTypes: ['text', 'text', 'checkbox', 'text'],
  	keys: ['reasonCd', 'description', 'activeTag', 'remarks'],
  	widths: [1,'auto',1,'auto'],
  	uneditable: [false,false,false,false],
  	nData: {
  		reasonCd: '',
        addCounter: '1',
  		description: '',
  		activeTag: 'Y',
  		renarks: '',
  		createUser: this.currentUser,
  		createDate: this.ns.toDateTimeString(0),
  		updateUser: this.currentUser,
  		updateDate: this.ns.toDateTimeString(0)
  	},
  	paginateFlag: true,
  	infoFlag: true,
  	addFlag: true,
  	searchFlag: true,
    genericBtn: 'Delete'
  }

  constructor(private route: ActivatedRoute,private router: Router, private ms: MaintenanceService, private ns: NotesService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.retrieveMtnNonRenewalReason();
  }

  retrieveMtnNonRenewalReason(){
  	this.nonRenewalReasonData.tableData = [];
  	this.ms.getMtnNonRenewalReason('','').subscribe((data: any)=>{
  		console.log(data);
  		for(let i of data.nonRenewalReasonList){
  			i.uneditable = 'reasonCd';
  			this.nonRenewalReasonData.tableData.push(i);
  		}
  		//this.nonRenewalReasonData.tableData = data.nonRenewalReasonList;
  		this.table.refreshTable();
  		this.table.onRowClick(null, this.nonRenewalReasonData.tableData[0]);
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
      this.nonRenewalReasonData.disableGeneric = false;
      this.selectedRow = data;
    }else{
      this.nonRenewalReasonData.disableGeneric = true;
    }
  	
  }

  onClickAdd(event){
    this.counter += 1;
    this.nonRenewalReasonData.nData.addCounter = this.counter.toString();
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
    if(this.table.selected[0].okDelete === 'N'){
    	this.dialogIcon = 'info';
    	this.dialogMessage = 'You are not allowed to delete a Reason Code that is already used in renewal processing.';
    	this.successDiag.open();
    }else{
    	this.table.confirmDelete();
    }
  }

  delete(){
    this.table.markAsDirty();
    this.deletedData.push(this.indvSelect);
    this.nonRenewalReasonData.tableData = this.nonRenewalReasonData.tableData.filter(a =>{
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

  	for (var i = 0 ; this.nonRenewalReasonData.tableData.length > i; i++) {
  	  if(this.nonRenewalReasonData.tableData[i].edited && !this.nonRenewalReasonData.tableData[i].deleted){
  	      this.savedData.push(this.nonRenewalReasonData.tableData[i]);
  	      //this.savedData[this.savedData.length-1].adviceWordId = '0';
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
  	  }
  	  else if(this.nonRenewalReasonData.tableData[i].edited && this.nonRenewalReasonData.tableData[i].deleted){
  	     this.deletedData.push(this.nonRenewalReasonData.tableData[i]);
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
          this.retrieveMtnNonRenewalReason();
        },0);
    }else{
      this.ms.saveMtnNonRenewalReason(this.savedData, this.deletedData).subscribe((data:any)=>{
        if(data.returnCode === 0){
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          this.dialogIcon = '';
          this.successDiag.open();
          this.deletedData = [];
          this.savedData = [];
          this.table.markAsPristine();
          this.retrieveMtnNonRenewalReason();
        }
      });
    }
  }

  checkFields(){
  	//check if required values are filled
  	for(var i of this.nonRenewalReasonData.tableData){
  		if((i.reasonCd.length === 0 || i.reasonCd === undefined || i.reasonCd === null ||
  		   i.description.length === 0 || i.description === undefined || i.description === null ) && (i.deleted !== undefined && !i.deleted)){
  			return false;
  		}
  	}
  	return true;
  }

  checkForDuplicates(){
  	//check if there are similar reasonCd
  	for(var j = 0; j < this.nonRenewalReasonData.tableData.length; j++){
  		for(var k = j; k < this.nonRenewalReasonData.tableData.length; k++){
  			if(j !== k && this.nonRenewalReasonData.tableData[j].reasonCd === this.nonRenewalReasonData.tableData[k].reasonCd){
  				return false;
  			}
  		}
  	}
  	return true;
  }

}
