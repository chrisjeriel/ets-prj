import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-jv-change-tran-stat',
  templateUrl: './jv-change-tran-stat.component.html',
  styleUrls: ['./jv-change-tran-stat.component.css']
})
export class JvChangeTranStatComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild('orModal') orModal: ModalComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  passData: any = {
     tableData:[],
     tHeader:['JV No.','JV Date', 'Particulars', 'JV Type','JV Ref. No', 'Prepared By','JV Status', 'Amount'],
     dataTypes:['text','date','text','text','text','text','text','currency'],
     keys: ['jvNo', 'jvDate', 'particulars','tranTypeDesc','refNo','preparedBy','status','amount'],
       uneditable:[true,true,true,true,true,true,true,true],
       pageLength:10,
       genericBtn: 'Change Status to New',
       disableGeneric: false,
       paginateFlag:true,
       infoFlag:true,
       checkFlag: true
   };


   params : any = {
      createUser : '',
      createDate : '',
      updateUser : '',
      updateDate : '',
       changeStat:[]
    };

    dialogIcon : any;
    dialogMessage : any;
    cancelFlag: boolean = false;

  constructor(private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.retrieveJV();
  }

  retrieveJV(){
    setTimeout(() => {this.table.loadingFlag = true});
    this.accountingService.getJvCancelled(null).subscribe((data:any) => {
      console.log(data);
      this.passData.tableData = [];
      for (var i = 0; i < data.cancelledJV.length; i++) {
        this.passData.tableData.push(data.cancelledJV[i]);
      }
      this.table.refreshTable();
      this.table.loadingFlag = false;
    });
  }

  onRowClick(data){
    if(data !== null){
      this.params.createUser = data.createUser;
      this.params.createDate = this.ns.toDateTimeString(data.createDate);
      this.params.updateUser = data.updateUser;
      this.params.updateDate = this.ns.toDateTimeString(data.updateDate);
    }else {
      this.params.createUser = '';
      this.params.createDate = '';
      this.params.updateUser = '';
      this.params.updateDate = '';
    }
  }
  
  onClickUpdate(data){
    this.orModal.openNoClose();
  }

  prepareData(){
    this.params.changeStat = [];

    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].checked){
        this.params.changeStat.push(this.passData.tableData[i]);
        this.params.changeStat[this.params.changeStat.length - 1].updateDate = this.ns.toDateTimeString(0);
      }
    }
  }

  saveData(){
    this.prepareData();
    console.log(this.params)
    this.accountingService.updateAcseChangeStat(this.params).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveJV();
      }
    });
  }
}
