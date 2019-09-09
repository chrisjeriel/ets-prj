import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService} from '@app/_services';
import { Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-change-to-new-ar',
  templateUrl: './change-to-new-ar.component.html',
  styleUrls: ['./change-to-new-ar.component.css']
})
export class ChangeToNewArComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("confirmSave") confirmSave: ConfirmSaveComponent;

  passData: any = {
  	tableData:[],
    tHeader: ['A.R. No.','Payor','AR Date','Payment Type','Status','Particulars','Amount'],
  	dataTypes:['sequence-6','text','date','text','text','text','currency'],
  	uneditable:[true, true, true, true, true, true, true],
    keys: ['arNo', 'payor', 'arDate', 'tranTypeName', 'arStatDesc', 'particulars', 'arAmt'],
  	widths:[1, 1, 1, 1, 1, 1, 1],
    filters:[
      {
          key: 'arNo',
          title:'A.R. No.',
          dataType: 'text'
      },
      {
          key: 'payor',
          title:'Payor',
          dataType: 'text'
      },
      {
          key: 'arDate',
          title:'AR Date',
          dataType: 'datespan'
      },
      {
          key: 'tranTypeName',
          title:'Payment Type',
          dataType: 'text'
      },
      {
          key: 'arStatDesc',
          title:'Status',
          dataType: 'text'
      },
      {
          key: 'particulars',
          title:'Particulars',
          dataType: 'text'
      },
      {
          key: 'arAmt',
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

   arRecord: any = {
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


  constructor(private router: Router,private titleService: Title, private as: AccountingService, private ns: NotesService, public modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Change Transaction Status to New | Acknowledgement Receipt");
  	this.retrieveArList();
  }

  retrieveArList(){
    this.as.getArList(this.searchParams).subscribe(
      (data: any)=>{
        if(data.ar.length !== 0){
          for(var i:number = 1; i<data.ar.length; i++){
              if (data.ar[i].arStatDesc === 'Printed' || data.ar[i].arStatDesc === 'Cancelled' ){
                this.passData.tableData.push(data.ar[i]);
                console.log(data.ar[i]);
              }
          }
          this.table.refreshTable();
        }
      },
      (error)=>{
        this.passData.tableData = [];
        this.table.refreshTable();
      }
    )
  }

   onRowClick(data){
    if(data === null || (data !== null && Object.keys(data).length === 0)){
      this.arRecord.createUser = '';
      this.arRecord.createDate = '';
      this.arRecord.updateUser = '';
      this.arRecord.updateDate = '';
      this.selected = {};
    }else{
      this.selected = data;
      this.arRecord.createUser = this.selected.createUser;
      this.arRecord.createDate = this.ns.toDateTimeString(this.selected.createDate);
      this.arRecord.updateUser = this.selected.updateUser;
      this.arRecord.updateDate = this.ns.toDateTimeString(this.selected.updateDate);
    }
    
  }

  onChange(){
      this.selectedData = [];
      this.selectedAcitData.updateAcitStatusList = [];
      for(var i= 0; i< this.passData.tableData.length; i++){
        if(this.passData.tableData[i].checked){
          this.selectedData.push({ tranId : this.passData.tableData[i].tranId,
                                   arNo   : this.passData.tableData[i].arNo,
                                   status : 'N',
                                   tranClass : 'AR',
                                   updateUser : this.ns.getCurrentUser()
                                 });
        }
      }

      if (this.selectedData.length !== 0) {
         $('#confirmModal > #modalBtn').trigger('click');
      }  else {
          this.dialogMessage="Please choose at least one AR record";
          this.dialogIcon = "error-message";
          this.successDialog.open();
      } 
  }

  onChangeStatus(obj){
     this.selectedAcitData.updateAcitStatusList = obj;
     this.passData.tableData = [];
     this.table.overlayLoader = true;
       this.as.updateAcitStatus(this.selectedAcitData).subscribe((data:any) => {
        if(data['returnCode'] != -1) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            this.successDialog.open();
        }else{
            this.dialogIcon = "success";
            this.successDialog.open();
            this.table.overlayLoader = false;
            this.arRecord = [];
            this.retrieveArList();
        }
     });
   }

}
