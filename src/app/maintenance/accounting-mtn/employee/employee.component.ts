import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnCompanyComponent } from '@app/maintenance/mtn-company/mtn-company.component';
import { MtnEmployeeComponent } from '@app/maintenance/mtn-employee/mtn-employee.component';
import { PrintModalMtnAcctComponent } from '@app/_components/common/print-modal-mtn-acct/print-modal-mtn-acct.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import * as alasql from 'alasql';
import { finalize } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @ViewChild('emp') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(MtnCompanyComponent) companyLov: MtnCompanyComponent;
  @ViewChild(MtnEmployeeComponent) employeeLov: MtnCompanyComponent;
  @ViewChild('myForm') form:any;
  @ViewChild('mdl') modal : ModalComponent;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;
  
  dialogIcon:string = '';
  dialogMessage: string = '';
  info:{
      employeeNo: null,
      lastName : null,
      firstName : null,
      middleName : null,
      printableName : null,
      gender : null,
      birthDate : null,
      hireDate : null,
      terminationDate : null,
      dept : null,
      activeTag : 'Y',
      designation : null,
      supervisor: null,
      supervisorName : null,
      civilStatus : null,
      presentAdd : null,
      permanentAdd : null,
      tin : null,
      sssNo : null,
      philhealthNo : null,
      pagibigNo : null,
      contactNos : null,
      email : null,
      contactPerson : null,
      emergencyNo : null,
    };

  oldRecord : any ={
      tableData:[]
  };
  company:any = {};
  boolPrint: boolean = true;
  boolOtherDetails: boolean = false;
  cancelFlag:boolean;
  inquiryFlag:boolean;
  indexRow:any;

  passTable:any={
  	tableData:[],
  	widths:[1,1,150,150,150,80,1,1,150],
  	tHeader:['Active','Employee No','Last Name','First Name', 'Middle Name', 'Gender', 'Hire Date', 'Termination Date','Department'],
  	dataTypes:['checkbox','text','text','text','text','select','date','date','text'],
  	tooltip:[],
  	uneditable:[false,false,false,false,false,false,false,false,false],
  	keys:['activeTag','employeeNo','lastName','firstName','middleName','gender','hireDate','terminationDate','department'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	nData:{
      employeeId : null,
      employeeNo: null,
      lastName : null,
      firstName : null,
      middleName : null,
      gender : null,
      hireDate : null,
      terminationDate : null,
      dept : null,
      birthDate : '',
      civilStatus : null,
      activeTag : 'Y',
      presentAdd : null,
      permanentAdd : null,
      tin : null,
      sssNo : null,
      philhealthNo : null,
      pagibigNo : null,
      contactNos : null,
      email : null,
      contactPerson : null,
      emergencyNo : null,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true,
    disableAdd:true,
     opts: [{
	            selector: 'gender',
	            prev: ['Male','Female'],
	            vals: ['M','F'],
        	}],
  } 




  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService,private modalService: NgbModal) { }

  ngOnInit() {
  	 this.form.control.markAsPristine();
  	 this.titleService.setTitle('Mtn | Employee');
  }

  checkCode(ev){
    $('.ng-dirty').removeClass('ng-dirty');
    this.passTable.tableData = [];
    this.boolPrint = false;
    this.table.refreshTable();
    this.ns.lovLoader(ev, 1);
    this.table.overlayLoader = true;
    this.boolPrint = true;
    this.boolOtherDetails = true;
    this.companyLov.checkCode(this.company.companyId,ev);
  }

  setSelectedCompany(data){
  	if (data === null){
  		this.company.companyId = null;
      this.company.companyName = null;
  		this.boolPrint = true;
      this.boolOtherDetails = true;
  	}else {
	  	this.company = data;
	    this.ns.lovLoader(data.ev, 0);
      this.table.overlayLoader = true;
	    this.getEmployee();
	    this.table.overlayLoader = false;
  	}
  	
  }
 
   getEmployee(){
    this.passTable.disableGeneric = true;
    if(this.company.companyId==''){
    	this.passTable.distableGeneric = true;
    	this.passTable.disableAdd = true;
    }else{
	  	this.ms.getMtnEmployee(this.company.companyId).subscribe(a=>{
	  		this.passTable.tableData = a['employeeList'];
	  		this.passTable.tableData.forEach(a=>{
          a.birthDate = this.ns.toDateTimeString(a.birthDate);
	  			a.hireDate = this.ns.toDateTimeString(a.hireDate);
	  			a.terminationDate = this.ns.toDateTimeString(a.terminationDate);
	  			a.createDate = this.ns.toDateTimeString(a.createDate);
	  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
	  		})
	  		this.table.refreshTable();
        this.table.overlayLoader = false;
	      this.passTable.distableGeneric = false;
        this.passTable.disableAdd = false;
        this.boolPrint = false;
	  	})
	  }
  }

  delete(){
  	if(this.table.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'Deleting this record is not allowed. This was already used in some accounting records.';
  		this.successDialog.open();
  	}else{
      this.boolOtherDetails = true;
  		this.table.selected  = [this.table.indvSelect]
  		this.table.confirmDelete();
      $('#cust-table-container').addClass('ng-dirty');
  	}
  }

  onTableClick(data){
    console.log(data);
    for (var i = this.passTable.tableData.length - 1; i >= 0; i--) {
            if(data == this.passTable.tableData[i]){
                this.indexRow = i;
                break;
            }
    }

    if (data === null){
       this.boolOtherDetails = true;
       this.passTable.disableGeneric = true;
       this.info = null;
    }else {
       this.boolOtherDetails = false;
       this.info = data;
       this.passTable.disableGeneric = data == null;
    }
  }

  onClickCancel(){
    this.cnclBtn.clickCancel();
  }

  onClickSave(cancelFlag?){
     if (this.checkValidation()){
        this.conSave.confirmModal();
     }else {
         this.successDialog.open();
         this.tblHighlightReq('#mtn-employee',this.passTable.dataTypes,[1,2,3,4,5,8]);
     }
  }

  checkFields(){
      for(let check of this.passTable.tableData){
         if( 
             check.employeeNo === null || check.employeeNo === '' ||
             check.lastName === null || check.lastName === '' ||
             check.firstName === null || check.firstName === '' ||
             check.middleName === null || check.middleName === '' ||
             check.gender === null || check.gender === '' ||
             check.department === null || check.department === '' ||
             check.civilStatus === null || check.civilStatus === '' 
          ) {   
            return false;
          }   
      }
       return true;
   }

   checkValidation(){
      if(this.checkFields()){
        return true;
     }else{
          this.dialogMessage="Please check field values.";
          this.dialogIcon = "error";
          return false;
       }
  }

   tblHighlightReq(el, dataTypes, reqInd) {
    setTimeout(() => {
      $(el).find('tbody').children().each(function() {
        $(this).children().each(function(i) {
          if(reqInd.includes(i)) {
            var val;
            if(dataTypes[i] == 'text' || dataTypes[i] == 'date' || dataTypes[i] == 'time') {
              val = $(this).find('input').val();
              highlight($(this), val);
            } else if(dataTypes[i] == 'select') {
              val = $(this).find('select').val();    
              highlight($(this), val);
            }else if(dataTypes[i] == 'number' || dataTypes[i] == 'currency') {
              val = isNaN(Number($(this).find('input').val())) ? null : $(this).find('input').val();
            }
          }
        });
      });

      function highlight(td, val) {
        td.css('background', typeof val == 'undefined' ? 'transparent' : val == '' || val == null ? '#fffacd85' : 'transparent');
      }
      }, 0);

   }

   onClickOtherDetails(){
     this.modal.openNoClose();
     this.oldRecord = JSON.parse(JSON.stringify(this.table.indvSelect));
   }

   setSelectedEmployee(data){
     if(data === null){
       this.info.supervisor = null;
       this.info.supervisorName = null;
     } else {
       this.info.supervisor = data.employeeId;
       this.info.supervisorName = data.printableName;
     }
   }

   saveOtherDetails(){
     this.passTable.tableData[this.indexRow].edited = true;
     $('#cust-table-container').addClass('ng-dirty');
     this.modalService.dismissAll();
   }

  onClickSaveCancel(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    if(this.cancelFlag){
       if (this.checkValidation()){
           this.save();
       }else {
           this.successDialog.open();
           this.tblHighlightReq('#mtn-employee',this.passTable.dataTypes,[1,2,3,4,5,8]);
       }
    }else {
      this.save();
    }
  }

   save(){
    this.boolOtherDetails = true;
    let params: any = {
      saveList:[],
      delList:[]
    }
    params.saveList = this.passTable.tableData.filter(a=>a.edited && !a.deleted);
    params.saveList.forEach(a=>{
      a.companyId = this.company.companyId;
      a.updateUser = this.ns.getCurrentUser();
      a.updateDate = this.ns.toDateTimeString(0);
      a.printableName = a.firstName + ' ' + a.lastName;
    });
    params.delList = this.passTable.tableData.filter(a=>a.deleted);
   
    if(params.saveList.length === 0 && params.delList.length === 0 ){    
          this.conSave.showBool = false;
          this.dialogIcon = "success";
          this.successDialog.open();
          $('.ng-dirty').removeClass('ng-dirty');
    }else {
      console.log(params);
      this.ms.saveMtnEmployee(params).subscribe(a=>{
        if(a['returnCode'] == -1){
          this.form.control.markAsPristine();
              this.dialogIcon = "success";
              this.successDialog.open();
              this.table.overlayLoader = true;
              this.getEmployee();
              $('.ng-dirty').removeClass('ng-dirty');
          }else{
              this.dialogIcon = "error";
              this.successDialog.open();
          }
      });
    }
    
  }

  cancelOtherDetails(){
    console.log(this.oldRecord);
     this.passTable.tableData[this.indexRow].designation = this.oldRecord.designation;
     this.passTable.tableData[this.indexRow].birthDate = this.oldRecord.birthDate;
     this.passTable.tableData[this.indexRow].supervisor = this.oldRecord.supervisor;
     this.passTable.tableData[this.indexRow].supervisorName = this.oldRecord.supervisorName;
     this.passTable.tableData[this.indexRow].civilStatus = this.oldRecord.civilStatus;
     this.passTable.tableData[this.indexRow].presentAdd = this.oldRecord.presentAdd;
     this.passTable.tableData[this.indexRow].permanentAdd = this.oldRecord.permanentAdd;
     this.passTable.tableData[this.indexRow].tin = this.oldRecord.tin;
     this.passTable.tableData[this.indexRow].sssNo = this.oldRecord.sssNo;
     this.passTable.tableData[this.indexRow].philhealthNo = this.oldRecord.philhealthNo;
     this.passTable.tableData[this.indexRow].pagibigNo = this.oldRecord.pagibigNo;
     this.passTable.tableData[this.indexRow].contactNos = this.oldRecord.contactNos;
     this.passTable.tableData[this.indexRow].email = this.oldRecord.email;
     this.passTable.tableData[this.indexRow].contactPerson = this.oldRecord.contactPerson;
     this.passTable.tableData[this.indexRow].emergencyNo = this.oldRecord.emergencyNo;
  }

   printPreview(data){

   }

  

}
