import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services'
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnCedingCompanyComponent } from '@app/maintenance/mtn-ceding-company/mtn-ceding-company.component'
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
  @ViewChild(MtnCedingCompanyComponent) mtnCedingLov: MtnCedingCompanyComponent;
  passData: any = {
    tHeader: [ "Company No","Company Name","Abbreviation","Effective From", "Effective To","Active","Remarks"],
    tableData:[],
    dataTypes: ['text','text','text','date','date','checkbox', "text"],
    nData: {
      companyNo: null,
      companyName: null,
      abbreviation: null,
      effDateFrom: null,
      effDateTo: null,
      activeTag: null,
      remarks: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      description: null,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'roundingerror',
    //checkFlag: true,
    disableGeneric : true,
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,false,false,false,false,false,false],
    widths:['auto','auto','auto','auto','auto','auto','auto'],
    keys:['companyId','companyName','abbreviation','effDateFrom','effDateTo','activeTag','remarks']
  };

  cancelFlag:boolean;
  edited: any = [];
  deleted: any = [];
  dialogMessage : string = '';
  dialogIcon: any;
  errorFlag:boolean = false;
  hide:string[] = [];

  roundingError : any = {
  	createUser: null,
  	createDate: '',
  	updateUser: null,
  	updateDate: ''
  }

  saveData:any ={
    delParameters :[],
    saveParameters: []
  }

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  	this.getRoundingError();
  }

  getRoundingError(){
  	this.maintenanceService.getMtnRoundingError(null).subscribe((data:any) => {
  		console.log(data)
  		for(var i = 0 ; i < data.roundingError.length; i++){
  			this.passData.tableData.push(data.roundingError[i]);
  		}
  		this.table.refreshTable();
  	});
  }

   onRowClick(data){
   	console.log(data)
   	  if(data !== null){
   	   this.passData.disableGeneric = false
   	   this.roundingError = data;
   	   this.roundingError.createDate = this.ns.toDateTimeString(data.createDate);
   	   this.roundingError.updateDate = this.ns.toDateTimeString(data.updateDate);
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
      this.hide = this.passData.tableData.map(a=> a.lineCd);
      data.ev['index'] = data.index;
      this.mtnCedingLov.checkCode(data.ev.target.value, data.ev);
    }
  }

}
