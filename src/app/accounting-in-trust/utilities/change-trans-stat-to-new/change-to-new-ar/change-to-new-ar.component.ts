import { Component, OnInit, ViewChild, Input,Output ,EventEmitter} from '@angular/core';
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
  @ViewChild('ARTable') ARTable: CustEditableNonDatatableComponent;
  @ViewChild('JVTable') JVTable: CustEditableNonDatatableComponent;
  @ViewChild('CVTable') CVTable: CustEditableNonDatatableComponent;

  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("confirmSave") confirmSave: ConfirmSaveComponent;
  @Input() tranFlag : any;


  passDataAR: any = {
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

  passDataJV: any = {
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
            key: 'tranTypeName',
            title:'JV Type',
            dataType: 'text'
        },
        {
            key: 'refNo',
            title:'JV Ref. No',
            dataType: 'text'
        },
        {
            key: 'preparedName',
            title:'Prepared By',
            dataType: 'text'
        },
        {
            key: 'jvStatusName',
            title:'JV Status',
            dataType: 'text'
        },
        {
            key: 'jvAmt',
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

  passDataCV: any = {
      tableData: [],
      tHeader: ["CV No", "Payee", "CV Date", "Status","Particulars","Amount"],
      dataTypes: ['text','text','date','text','text','currency',],
      uneditable:[true, true, true, true, true, true],
      keys:['cvGenNo','payee','cvDate','cvStatusDesc','particulars','cvAmt'],
      widths:[1, 1, 1, 1, 1, 1],
      filters: [
        {
          key: 'cvGenNo',
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
          key: 'particulars',
          title: 'Particulars',
          dataType: 'text'
        },
        {
          key: 'cvAmt',
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

   record: any = {
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
    if (this.tranFlag === 'AR'){
       this.titleService.setTitle("Acct-IT | Change Transaction Status to New | Acknowledgement Receipt");
       this.retrieveArList();
    } else if (this.tranFlag === 'JV'){
        this.titleService.setTitle("Acct-IT | Change Transaction Status to New | Journal Voucher");
        this.retrieveJVlist();
    } else if (this.tranFlag === 'CV'){
        this.titleService.setTitle("Acct-IT | Change Transaction Status to New | Check Voucher");
        this.retrieveCVlist();
    }
   
  }

  retrieveArList(){
    this.as.getArList(this.searchParams).subscribe(
      (data: any)=>{
        if(data.ar.length !== 0){
          for(var i:number = 1; i<data.ar.length; i++){
              if (data.ar[i].arStatDesc === 'Printed' || data.ar[i].arStatDesc === 'Cancelled' ){
                this.passDataAR.tableData.push(data.ar[i]);
              }
          }
          this.ARTable.refreshTable();
        }
      },
      (error)=>{
        this.passDataAR.tableData = [];
        this.ARTable.refreshTable();
      }
    )
  }

  retrieveJVlist(){
    this.as.getJVListing(this.searchParams).subscribe((data:any) => {
      for(var i=0; i< data.transactions.length;i++){
        if (data.transactions[i].jvListings.jvStatusName === 'For Approval' || data.transactions[i].jvListings.jvStatusName === 'Approved'
           || data.transactions[i].jvListings.jvStatusName === 'Printed' || data.transactions[i].jvListings.jvStatusName === 'Cancelled'){
            this.passDataJV.tableData.push(data.transactions[i].jvListings);
          this.passDataJV.tableData[this.passDataJV.tableData.length - 1].jvNo = String(data.transactions[i].jvListings.jvYear) + '-' +  String(data.transactions[i].jvListings.jvNo).padStart(8,'0');
          this.passDataJV.tableData[this.passDataJV.tableData.length - 1].transactions = data.transactions[i];
         }
      }
      this.JVTable.refreshTable();
    });
  }


  retrieveCVlist(){
 
    this.as.getAcitCvList(this.searchParams).subscribe(data => {

      var rec = data['acitCvList'].map(i => { 
        i.createDate     = this.ns.toDateTimeString(i.createDate); 
        i.updateDate     = this.ns.toDateTimeString(i.updateDate);
        i.checkDate      = this.ns.toDateTimeString(i.checkDate);
        i.preparedDate   = this.ns.toDateTimeString(i.preparedDate);
        i.certifiedDate  = this.ns.toDateTimeString(i.certifiedDate);

        if(i.mainTranStat != 'O') {
          i.cvStatus = i.mainTranStat;
          i.cvStatusDesc = i.mainTranStatDesc;
        }

        return i; 
      });

      this.passDataCV.tableData = rec.filter(a => String(a.cvStatus).toUpperCase() === 'F' ||
                                                  String(a.cvStatus).toUpperCase() === 'P' ||
                                                  String(a.cvStatus).toUpperCase() === 'A' ||
                                                  String(a.cvStatusDesc).toUpperCase() === 'X' 
                                            );
      this.CVTable.refreshTable();
    });
  }

   onRowClick(data){
    if(data === null || (data !== null && Object.keys(data).length === 0)){
      this.record.createUser = '';
      this.record.createDate = '';
      this.record.updateUser = '';
      this.record.updateDate = '';
      this.selected = {};
    }else{
      this.selected = data;
      this.record.createUser = this.selected.createUser;
      this.record.createDate = this.ns.toDateTimeString(this.selected.createDate);
      this.record.updateUser = this.selected.updateUser;
      this.record.updateDate = this.ns.toDateTimeString(this.selected.updateDate);
    }
    
  }

  onChange(obj){
      this.selectedData = [];
      this.selectedAcitData.updateAcitStatusList = [];

      if(obj === 'AR'){
        for(var i= 0; i< this.passDataAR.tableData.length; i++){
            if(this.passDataAR.tableData[i].checked){
              this.selectedData.push({ tranId : this.passDataAR.tableData[i].tranId,
                                       arNo   : this.passDataAR.tableData[i].arNo,
                                       status : 'N',
                                       tranClass : 'AR',
                                       updateUser : this.ns.getCurrentUser()
                                     });
            }
        }
      } else if (obj === 'JV'){
        for(var i= 0; i< this.passDataJV.tableData.length; i++){
            if(this.passDataJV.tableData[i].checked){
              this.selectedData.push({ tranId : this.passDataJV.tableData[i].tranId,
                                       arNo   : this.passDataJV.tableData[i].arNo,
                                       status : 'N',
                                       tranClass : 'JV',
                                       updateUser : this.ns.getCurrentUser()
                                     });
            }
        }
      } else if (obj === 'CV'){
        for(var i= 0; i< this.passDataCV.tableData.length; i++){
            if(this.passDataCV.tableData[i].checked){
              this.selectedData.push({ tranId : this.passDataCV.tableData[i].tranId,
                                       arNo   : this.passDataCV.tableData[i].arNo,
                                       status : 'N',
                                       tranClass : 'CV',
                                       updateUser : this.ns.getCurrentUser()
                                     });
            }
        }
      }
      

      if (this.selectedData.length !== 0) {
         $('#confirmModal > #modalBtn').trigger('click');
      }  else {
          if (obj === 'AR'){
            this.dialogMessage="Please choose at least one AR record";
          } else if (obj === 'JV'){
            this.dialogMessage="Please choose at least one JV record";
          } else if (obj === 'CV'){
            this.dialogMessage="Please choose at least one CV record";
          }
          this.dialogIcon = "error-message";
          this.successDialog.open();
      } 
  }

  onChangeStatus(obj,tranClass){
     this.selectedAcitData.updateAcitStatusList = obj;
     console.log(this.selectedAcitData);

      if (tranClass === 'AR'){
          this.passDataAR.tableData = [];
          this.ARTable.overlayLoader = true;
      } else if (tranClass === 'JV'){
          this.passDataJV.tableData = [];
          this.JVTable.overlayLoader = true;
      } else if (tranClass === 'CV'){
          this.passDataCV.tableData = [];
          this.CVTable.overlayLoader = true;
      }
    
       this.as.updateAcitStatus(this.selectedAcitData).subscribe((data:any) => {
        if(data['returnCode'] != -1) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            this.successDialog.open();
        }else{
            this.dialogIcon = "success";
            this.successDialog.open();
            this.record = [];
            if (tranClass === 'AR'){
              this.ARTable.overlayLoader = false;
              this.retrieveArList();
            } else if (tranClass === 'JV'){
              this.JVTable.overlayLoader = false;
              this.retrieveJVlist();
            } else if (tranClass === 'CV'){
              this.CVTable.overlayLoader = false;
              this.retrieveCVlist();
            }            
        }
     });
   }

}
