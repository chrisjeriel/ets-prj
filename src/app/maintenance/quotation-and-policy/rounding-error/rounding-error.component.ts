import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services'
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnCedingCompanyMemberComponent } from '@app/maintenance/mtn-ceding-company-member/mtn-ceding-company-member.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-rounding-error',
  templateUrl: './rounding-error.component.html',
  styleUrls: ['./rounding-error.component.css']
})
export class RoundingErrorComponent implements OnInit {
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild('roundingerror') table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(MtnCedingCompanyMemberComponent) mtnCedingLov: MtnCedingCompanyMemberComponent;
  passData: any = {
    tHeader: [ "Company No","Company Name","Abbreviation","Effective From","Active","Remarks"],
    tableData:[],
    dataTypes: ['lovInput','text','text','date','checkbox', "text"],
    nData: {
      showMG: 1,
      companyId: null,
      companyName: null,
      abbreviation: null,
      effDateFrom: null,
      activeTag: 'Y',
      remarks: null,
      uneditable: [],
      okDelete: 'Y',
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      description: null,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'roundingerror',
    //checkFlag: true,
    disableGeneric : true,
    magnifyingGlass: ['companyId'],
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,true,true,false,false,false],
    widths:[250,'auto','auto','auto','auto','auto'],
    keys:['companyId','companyName','abbreviation','effDateFrom','activeTag','remarks']
  };

  cancelFlag:boolean;
  edited: any = [];
  deleted: any = [];
  dialogMessage : string = '';
  dialogIcon: any;
  errorFlag:boolean = false;
  hide:string[] = [];
  roundingLOVRow: any;

  roundingError : any = {
  	createUser: null,
  	createDate: '',
  	updateUser: null,
  	updateDate: ''
  }

  saveData:any ={
    delRoundingError :[],
    saveRoundingError: []
  }

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService,private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Mtn | Rounding Error Company");
  	this.getRoundingError();
  }

  getRoundingError(){
  	this.passData.tableData = [];
  	this.maintenanceService.getMtnRoundingError(null).subscribe((data:any) => {
  		for(var i = 0 ; i < data.roundingError.length; i++){
  			this.passData.tableData.push(data.roundingError[i]);
        this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['effDateFrom']
  		}
  		this.table.refreshTable();
  	});
  }

   clickRow(data){
   	  if(data !== null){
   	  	this.roundingError = data;
   	  	this.roundingError.createDate = this.ns.toDateTimeString(data.createDate);
   	  	this.roundingError.updateDate = this.ns.toDateTimeString(data.updateDate);
   	  }else{
        this.passData.disableGeneric = true
      }

   	 if(data.okDelete == 'Y'){
   	   this.passData.disableGeneric = false
   	 }else{
   	   this.passData.disableGeneric = true
   	 }
   }

   deleteCurr(){
		this.table.indvSelect.deleted = true;
		this.table.selected  = [this.table.indvSelect]
		this.table.confirmDelete();
   }

   update(data){
    if(data.hasOwnProperty('lovInput')) {
      //this.hide = this.passData.tableData.map(a=> a.lineCd);
      data.ev['index'] = data.index;
      this.mtnCedingLov.checkCode(data.ev.target.value, data.ev);
    }

    for (var i = 0; i < this.passData.tableData.length; i++) {
      for (var j = 0; j < this.passData.tableData.length; j++) {
        if(i!==j){
          if(this.passData.tableData[i].effDateFrom > this.passData.tableData[j].effDateFrom){

          }
        }
      }
    }
   }

   setRoundingError(data){
    if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
      this.roundingLOVRow = data.ev.index;
      this.ns.lovLoader(data.ev, 0);
    }
    this.passData.tableData[this.roundingLOVRow].companyId = data.cedingId;
    this.passData.tableData[this.roundingLOVRow].companyName = data.cedingName;
    this.passData.tableData[this.roundingLOVRow].abbreviation = data.cedingAbbr;
    if(data.cedingId != ''){
      this.passData.tableData[this.roundingLOVRow].showMG = 0;
    }
    this.table.refreshTable();
  }

  showRoundingLOV(data){
      $('#roundingModal #modalBtn').trigger('click');
      //this.hide = this.passData.tableData.map(a=> a.lineCd);
      this.roundingLOVRow = data.index;
  }

  prepareData(){
  	this.edited = [];
  	this.deleted = [];
  	  for(var i = 0 ; i < this.passData.tableData.length; i++){
  	  	if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  	  		this.edited.push(this.passData.tableData[i]);
  	  		this.edited[this.edited.length - 1].effDateFrom = this.ns.toDateTimeString(this.passData.tableData[i].effDateFrom);
  	  		this.edited[this.edited.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
  	  		this.edited[this.edited.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
  	  	}

  	  	if(this.passData.tableData[i].deleted){
  	  		this.deleted.push(this.passData.tableData[i]);
  	  		this.deleted[this.deleted.length - 1].effDateFrom = this.ns.toDateTimeString(this.passData.tableData[i].effDateFrom);
  	  	}
  	  }
  	  
  	  this.saveData.saveRoundingError = this.edited;
   	  this.saveData.delRoundingError  = this.deleted;
   	  if(this.edited.length == 0 && this.deleted.length == 0){
   	  	this.errorFlag = true;
   	  }
  }

  saveRoundingError(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	this.prepareData();
  	if(this.errorFlag){
  		setTimeout(()=> {
  			this.dialogMessage = "Nothing to Save.";
  			this.dialogIcon = "info";
  			this.successDiag.open();
  		},0);
  	}else{
      console.log(this.saveData)
  		this.maintenanceService.saveMtnRoundingError(this.saveData).subscribe((data:any) => {
	  		if(data['returnCode'] == 0) {
	          this.dialogMessage = data['errorList'][0].errorMessage;
	          this.dialogIcon = "error";
	          this.successDiag.open();
	        } else{
	          this.dialogIcon = "success";
	          this.successDiag.open();
	          this.getRoundingError();
	          this.passData.disableGeneric = true
        }
  		});
  	}
  }

  onClickSave(){
  		$('#confirm-save #modalBtn2').trigger('click');
  }

  cancel(){
   	this.cancelBtn.clickCancel();
   }

}
