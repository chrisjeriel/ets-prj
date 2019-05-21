import { Component, OnInit, ViewChild } from '@angular/core';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService } from '@app/_services';

@Component({
  selector: 'app-mtn-approval-function',
  templateUrl: './mtn-approval-function.component.html',
  styleUrls: ['./mtn-approval-function.component.css']
})
export class MtnApprovalFunctionComponent implements OnInit {

  @ViewChild('approval') table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {
    tHeader: [ "Approval Fn Code","Description","Remarks"],
    tableData:[],
    dataTypes: ['text','text','text'],
    nData: {
      approvalFn:null,
   	  description: null,
      remarks: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'approval',
    //checkFlag: true,
    disableGeneric : true,
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,false,false],
    widths:[100,'auto','auto'],
    keys:['approvalCd','description','remarks']
  };

  passDataUser: any = {
    tHeader: [ "User ID","User Name"],
    tableData:[],
    dataTypes: ['text','text'],
    nData: {
      userId: null,
      userName: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'users',
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,false],
    widths:[100,'auto'],
    keys:['userId','userName']
  };

  approverCd: null;

  constructor( private modalService: NgbModal, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
  	this.getApprovalFunction()
  }

  getApprovalFunction(){
  	this.maintenanceService.getMtnApproval().subscribe((data:any) => {
  		console.log(data)
  		var datas = data.approvalFunction;

  		for (var i = 0; i < datas.length;i++ ){
  			this.passData.tableData.push(datas[i]);
  		}

  		this.table.refreshTable();
  	})
  }

  onRowClick(data){
  	console.log(data)
  	if(data == null){
  		this.approverCd = null
  	}else{

  	}
  }

  users(){
  	$('#usersModal #modalBtn').trigger('click');
  }
}
