import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-claim-status',
  templateUrl: './claim-status.component.html',
  styleUrls: ['./claim-status.component.css']
})
export class ClaimStatusComponent implements OnInit {
  
  @ViewChild('claimStatus') table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  passData: any = {
    tHeader: [ "Status Code","Description","Active","Remarks"],
    tableData:[],
    dataTypes: ['text','text','checkbox','text'],
    nData: {
      statusCode: null,
      description: null,
      remarks: null,
      activeTag: 'Y',
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'claimStatus',
    disableGeneric : true,
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,false,false,false],
    widths:['auto','auto','auto','auto'],
    keys:['statusCode','description','activeTag','remarks']
  };

  cancelFlag:boolean;
  edited: any = [];
  deleted: any = [];
  dialogMessage : string = '';
  dialogIcon: any;
  errorFlag:boolean = false;

  claimStat : any = {
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
  	this.getClaimStat();
  }

  getClaimStat(){
  	this.maintenanceService.getClaimStatus(null).subscribe((data: any) => {
  		console.log(data)
  		if(data.claimStatus !== null){
  			var datas = data.claimStatus;

  			for(var i = 0; i < datas.length; i++){
  				this.passData.tableData.push(datas[i]);
  			}
  		}

  		this.table.refreshTable();
  	});
  }

  onRowClick(data){
  	console.log(data)
  	if(data !== null){
   	   this.claimStat = data;
   	   this.claimStat.createDate = this.ns.toDateTimeString(data.createDate);
   	   this.claimStat.updateDate = this.ns.toDateTimeString(data.updateDate);
   	 }
  }

}
