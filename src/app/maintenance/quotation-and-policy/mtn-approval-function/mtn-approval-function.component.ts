import { Component, OnInit, ViewChild } from '@angular/core';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

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
    keys:['approvalFn','description','remarks']
  };

  constructor() { }

  ngOnInit() {
  }

}
