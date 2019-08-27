import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService} from '@app/_services';
import { Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-to-new-jv',
  templateUrl: './change-to-new-jv.component.html',
  styleUrls: ['./change-to-new-jv.component.css']
})
export class ChangeToNewJvComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("confirmSave") confirmSave: ConfirmSaveComponent;


	passData: any = {
		tableData:[],
		tHeader:['JV No.','JV Date', 'Particulars', 'JV Type','JV Ref. No', 'Prepared By','JV Status', 'Amount'],
		dataTypes:['text','date','text','text','text','text','text','currency'],
		uneditable:[true, true, true, true, true, true, true, true],
		keys:['jvNo','jvDate','particulars','tranTypeName','refNo','preparedName','jvStatusName','jvAmt'],
		widths:[1, 1, 1, 1, 1, 1, 1, 1],
	    filters:[
	      {
	          key: 'jvNo',
	          title:'JV No.',
	          dataType: 'text'
	      },
	      {
	          key: 'jvDate',
	          title:'JV Date',
	          dataType: 'datespan'
	      },
	      {
	          key: 'particulars',
	          title:'Particulars',
	          dataType: 'text'
	      },
	      {
	          key: 'jvType',
	          title:'JV Type',
	          dataType: 'text'
	      },
	      {
	          key: 'jvRefNo',
	          title:'JV Ref. No',
	          dataType: 'text'
	      },
	      {
	          key: 'preparedBy',
	          title:'Prepared By',
	          dataType: 'text'
	      },
	      {
	          key: 'jvStatus',
	          title:'JV Status',
	          dataType: 'text'
	      },
	      {
	          key: 'amount',
	          title:'Amount',
	          dataType: 'text'
	      },
    	],
    	checkFlag : true,
    	pageLength: 10,
	    pageStatus: true,
	    pagination: true,
	    pageID: 1,
	    searchFlag: true,
	    infoFlag: true,
	    paginateFlag: true,
	    genericBtn:'Change Status to New'
	}
	jvRecord: any = {
	    createUser: '',
	    createDate: '',
	    updateUser: '',
	    updateDate: ''
	  }
  	searchParams: any[] = [];
  	selected: any;
  	selectedData: any[] = [];
  	selectedAcitData  : any = { 
                "updateAcitStatusList": []};
  	dialogIcon: string = '';
  	dialogMessage: string = '';

	constructor(private router: Router,private titleService: Title, private as: AccountingService, private ns: NotesService, private modalService: NgbModal) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-IT | Change Transaction Status to New | Journal Voucher");
		this.retrieveJVlist();
	}

 retrieveJVlist(){
    this.as.getJVListing(null).subscribe((data:any) => {
      console.log(data);
      for(var i=0; i< data.transactions.length;i++){
      	if (data.transactions[i].jvListings.jvStatusName === 'For Approval' || data.transactions[i].jvListings.jvStatusName === 'Approved'
      	   || data.transactions[i].jvListings.jvStatusName === 'Printed' || data.transactions[i].jvListings.jvStatusName === 'Cancelled'){
            this.passData.tableData.push(data.transactions[i].jvListings);
	        this.passData.tableData[this.passData.tableData.length - 1].jvNo = String(data.transactions[i].jvListings.jvYear) + '-' +  String(data.transactions[i].jvListings.jvNo).padStart(8,'0');
	        this.passData.tableData[this.passData.tableData.length - 1].transactions = data.transactions[i];
         }
      }
      this.table.refreshTable();
    });
  }

   onRowClick(data){
    if(data === null || (data !== null && Object.keys(data).length === 0)){
      this.jvRecord.createUser = '';
      this.jvRecord.createDate = '';
      this.jvRecord.updateUser = '';
      this.jvRecord.updateDate = '';
      this.selected = {};
    }else{
      this.selected = data;
      this.jvRecord.createUser = this.selected.createUser;
      this.jvRecord.createDate = this.ns.toDateTimeString(this.selected.createDate);
      this.jvRecord.updateUser = this.selected.updateUser;
      this.jvRecord.updateDate = this.ns.toDateTimeString(this.selected.updateDate);
    }
  }

  onChange(){
      this.selectedData = [];
      this.selectedAcitData.updateAcitStatusList = [];
      for(var i= 0; i< this.passData.tableData.length; i++){
        if(this.passData.tableData[i].checked){
          this.selectedData.push({ tranId : this.passData.tableData[i].tranId,
                                   status : 'N',
                                   tranClass : 'JV',
                                   updateUser : this.ns.getCurrentUser()
                                 });
        }
      }

      if (this.selectedData.length !== 0) {
         $('#confirmModal > #modalBtn').trigger('click');
      }  else {
          this.dialogMessage="Please choose at least one JV record";
          this.dialogIcon = "error-message";
          this.successDialog.open();
      } 
  }

   onChangeStatus(obj){
     this.selectedAcitData.updateAcitStatusList = obj;
     this.passData.tableData = [];
     this.table.overlayLoader = true;
     console.log(JSON.stringify(this.selectedAcitData));
       this.as.updateAcitStatus(this.selectedAcitData).subscribe((data:any) => {
        if(data['returnCode'] != -1) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            this.successDialog.open();
        }else{
            this.dialogIcon = "success";
            this.successDialog.open();
            this.table.overlayLoader = false;
            this.jvRecord = [];
            this.retrieveJVlist();
        }
     });
   }




}
