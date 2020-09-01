import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService} from '@app/_services';
import { Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-to-new-cv',
  templateUrl: './change-to-new-cv.component.html',
  styleUrls: ['./change-to-new-cv.component.css']
})
export class ChangeToNewCvComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("confirmSave") confirmSave: ConfirmSaveComponent;

  passData: any = {
  	tableData:[],
  	tHeader: ["CV No", "Payee", "CV Date", "Status","Particulars","Amount"],
    dataTypes: ['text','text','date','text','text','currency',],
  	uneditable:[true, true, true, true, true, true],
  	widths:[1,'auto',1,1,'auto',105],
   filters: [
        {
          key: 'cvNo',
          title: 'C.V. No.',
          dataType: 'text'
        },
        {
          key: 'payee',
          title: 'Payee',
          dataType: 'text'
        },
        {
          key: 'cvDate',
          title: 'CV Date',
          dataType: 'date'
        },
        {
          key: 'status',
          title: 'Status',
          dataType: 'text'
        },
        {
          key: 'particulars',
          title: 'Particulars',
          dataType: 'text'
        },
        {
          key: 'amount',
          title: 'Amount',
          dataType: 'text'
        }
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
  cvRecord: any = {
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
  	this.titleService.setTitle("Acct-IT | Change Transaction Status to New | Check Voucher");
    this.retrieveCVlist();
  }

  retrieveCVlist(){
    /*this.as.getCVListing().subscribe((data:any) => {
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
    });*/
  }


}
