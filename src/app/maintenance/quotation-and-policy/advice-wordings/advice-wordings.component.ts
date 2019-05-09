import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MaintenanceService, NotesService } from '@app/_services';

@Component({
  selector: 'app-advice-wordings',
  templateUrl: './advice-wordings.component.html',
  styleUrls: ['./advice-wordings.component.css']
})
export class AdviceWordingsComponent implements OnInit {

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  private currentUser: string = JSON.parse(window.localStorage.currentUser).username;

  dialogIcon: string = "";
  dialogMessage: string = "";

  selectedRow: any;

  cancelFlag: boolean = false;

  savedData: any = [];
  deletedData: any = [];

  adviceWordingsData: any = {
  	tableData: [],
  	tHeader: ['Adv Word No', 'Description', 'Advice Wordings', 'Active', 'Remarks'],
  	dataTypes: ['sequence-3', 'text', 'text-editor', 'checkbox', 'text'],
  	keys: ['adviceWordId', 'description', 'wordings', 'activeTag', 'remarks'],
  	widths: [1,'auto','auto',1,'auto'],
  	uneditable: [true,false,false,false,false],
  	nData: {
  		adviceWordId: '',
  		description: '',
  		wordings: '',
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
  	deleteFlag: true,
  	searchFlag: true,
  	checkFlag: true,
  }

  constructor(private route: ActivatedRoute,private router: Router, private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  	this.retrieveMtnAdviceWordingsMethod();
  }

  retrieveMtnAdviceWordingsMethod(){
  	this.ms.getAdviceWordings().subscribe((data: any)=>{
  		console.log(data);
  		this.adviceWordingsData.tableData = data.adviceWordings;
  		this.table.refreshTable();
  		this.table.onRowClick(null, this.adviceWordingsData.tableData[0]);
  	});
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('');
      }
    }

  onRowClick(data){
  	this.selectedRow = data;
  }

  onClickSave(){
  	if(this.checkFields()){
  		$('#confirm-save #modalBtn2').trigger('click');
  	}else{
  		this.dialogIcon = 'error';
  		this.successDiag.open();
  	}

  }

  onClickCancel(){
  	this.cancelBtn.clickCancel();
  }

  save(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	this.savedData = [];
  	this.deletedData = [];

  	for (var i = 0 ; this.adviceWordingsData.tableData.length > i; i++) {
  	  if(this.adviceWordingsData.tableData[i].edited && !this.adviceWordingsData.tableData[i].deleted){
  	      this.savedData.push(this.adviceWordingsData.tableData[i]);
  	      //this.savedData[this.savedData.length-1].adviceWordId = '0';
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
  	  }
  	  else if(this.adviceWordingsData.tableData[i].edited && this.adviceWordingsData.tableData[i].deleted){
  	     this.deletedData.push(this.adviceWordingsData.tableData[i]);
  	     this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
  	     this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	  }

  	}

  	this.ms.saveMtnAdviceWordings(this.savedData, this.deletedData).subscribe((data:any)=>{
  		if(data.returnCode === 0){
  			this.dialogIcon = 'error';
  			this.successDiag.open();
  		}else{
  			this.dialogIcon = '';
  			this.successDiag.open();
  			this.retrieveMtnAdviceWordingsMethod();
  		}
  	});
  }

  checkFields(){
  	for(var i of this.adviceWordingsData.tableData){
  		if(i.wordings.length === 0 || i.wordings === undefined || i.wordings === null){
  			return false;
  		}
  	}
  	return true;
  }

}
