import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, AccountingService } from '@app/_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-close-open-dcb',
  templateUrl: './close-open-dcb.component.html',
  styleUrls: ['./close-open-dcb.component.css']
})
export class CloseOpenDcbComponent implements OnInit {
  
  @ViewChild('dcb') table: CustEditableNonDatatableComponent;
  @ViewChild('collectTbl') collectTbl: CustEditableNonDatatableComponent;
  @ViewChild('bankTbl') bankTbl: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('closeDcb') closeDcb: ModalComponent;
  @ViewChild('reOpenDcb') reOpenDcb: ModalComponent;
  @ViewChild('tempCloseDcb') tempCloseDcb: ModalComponent;
  @ViewChild('viewDcb') viewDcb: ModalComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {
      tableData: [],
      tHeader: ['DCB Date','DCB Year', 'DCB No', 'DCB Status', 'Remarks','Close Date','Auto'],
      dataTypes: ['date','number', 'number', 'text', 'text','date','checkbox'],
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 10,
      pageID: 1,
      checkFlag : true,
      uneditable: [true,true,true,true,false,true,true],
      keys: ['dcbDate', 'dcbYear', 'dcbNo', 'dcbStatDesc', 'remarks','closeDate', 'autoTag'],
  };

  passDataCollection: any = {
      tableData: [],
      tHeader: ['Pay Mode','Original Amount', 'Curr', 'Curr Rate', 'Local Amount'],
      dataTypes: ['text','currency', 'text', 'percent', 'currency'],
      infoFlag: true,
      paginateFlag: true,
      pageLength: 5,
      pageID: 2,
      checkFlag : true,
      uneditable: [true,true,true,true,true],
      keys: ['paytModeDesc', 'orgAmt', 'currCd', 'currRate', 'localAmt'],
  };

  passDataBank: any = {
      tableData: [],
      tHeader: ['Bank','Bank Account No', 'Deposit Type', 'Original Amount', 'Curr', 'Curr Rate', 'Local Amount'],
      dataTypes: ['text', 'text', 'text','currency', 'text', 'percent', 'currency'],
      infoFlag: true,
      paginateFlag: true,
      pageLength: 5,
      pageID: 3,
      checkFlag : true,
      uneditable: [true,true,true,true,true],
      keys: ['bankName', 'acctNo', 'paytModeDesc', 'orgAmt', 'currCd', 'currRate', 'localAmt'],
  };

  params: any = {
  	status: 'O',
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: ''
  };

  saveData:any = {
  	saveDcb: []
  };

  dialogIcon : any;
  dialogMessage : any;
  cancelFlag: boolean = false;
  subscription: Subscription = new Subscription();

  constructor(private ns: NotesService, private maintenanceService: MaintenanceService, 
  			      private titleService: Title, private accountingService: AccountingService, 
              private router: Router) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Close/Open DCB");
  	this.retrieveDCB();
  }

  retrieveDCB(){
  	setTimeout(() => {this.table.loadingFlag = true}); 
  	this.maintenanceService.getMtnAcitDCBNo(null,null,null,this.params.status).subscribe((data:any) => {
  		console.log(data)
  		this.passData.tableData = [];
  		if(data.dcbNoList !== null){
  			for (var i = 0; i < data.dcbNoList.length; ++i) {
  				this.passData.tableData.push(data.dcbNoList[i]);
  			}
  		}
  		this.table.refreshTable();
  		this.table.loadingFlag = false;
  	});
  }

  onRowClick(data){
  	console.log(data)
  	if(data!== null){
  		this.params.dcbYear = data.dcbYear;
  		this.params.dcbNo = data.dcbNo;
      this.params.createUser = data.createUser;
      this.params.createDate = this.ns.toDateTimeString(data.createDate);
      this.params.updateUser = data.updateUser;
      this.params.updateDate = this.ns.toDateTimeString(data.updateDate);
  	}else{
  		this.params.dcbYear = '';
  		this.params.dcbNo = '';
      this.params.createUser = '';
      this.params.createDate = '';
      this.params.upateUser = '';
      this.params.updateDate = '';
  	}
  }

  onChange(data){
    console.log(data)
  }

  onClickSave(){
  	this.confirm.confirmModal();
  }

  saveDcb(cancel?){
    this.cancelFlag = cancel !== undefined;
  	this.saveData.saveDcb = []
  	for (var i = 0; i < this.passData.tableData.length; ++i) {
      console.log(this.passData.tableData[i].edited);
  		if(this.passData.tableData[i].edited){
  			this.saveData.saveDcb.push(this.passData.tableData[i]);
  			this.saveData.saveDcb[this.saveData.saveDcb.length - 1].updateUser = this.ns.getCurrentUser();
  		}
  	}

  	this.accountingService.saveDCBNo(this.saveData).subscribe((data:any) => {
  		if(data['returnCode'] != -1) {
  		  this.dialogMessage = data['errorList'][0].errorMessage;
  		  this.dialogIcon = "error";
  		  this.successDiag.open();
  		}else{
  		  this.dialogMessage = "";
  		  this.dialogIcon = "success";
  		  this.successDiag.open();
  		  this.retrieveDCB();
  		}
  	});
  }

  onClickClose(){
  	this.closeDcb.openNoClose();
  }

  closeDcbCollection(){
  	this.params.updateDcb = []; 
  	for (var i = 0; i < this.passData.tableData.length; ++i) {
  		if(this.passData.tableData[i].checked){
  			this.params.updateDcb.push(this.passData.tableData[i]);
  			this.params.updateDcb[this.params.updateDcb.length - 1].dcbStat = 'C';
  			this.params.updateDcb[this.params.updateDcb.length - 1].updateUser = this.ns.getCurrentUser();
  		}
  	}
	  this.updateDcb();
  }

  onClickReOpen(){
  	this.reOpenDcb.openNoClose();
  }

  reOpenDcbCollection(){
  	this.params.updateDcb = []; 
  	for (var i = 0; i < this.passData.tableData.length; ++i) {
  		if(this.passData.tableData[i].checked){
  			this.params.updateDcb.push(this.passData.tableData[i]);
  			this.params.updateDcb[this.params.updateDcb.length - 1].dcbStat = 'O';
  			this.params.updateDcb[this.params.updateDcb.length - 1].updateUser = this.ns.getCurrentUser();
  		}
  	}
  	this.updateDcb();
  }

  onClickTempClose(){
  	this.tempCloseDcb.openNoClose();
  }

  temporaryClose(){
  	this.params.updateDcb = []; 
  	for (var i = 0; i < this.passData.tableData.length; ++i) {
  		if(this.passData.tableData[i].checked){
  			this.params.updateDcb.push(this.passData.tableData[i]);
  			this.params.updateDcb[this.params.updateDcb.length - 1].dcbStat = 'TC';
  			this.params.updateDcb[this.params.updateDcb.length - 1].updateUser = this.ns.getCurrentUser();
  		}
  	}
  	
  	this.updateDcb();
  }

  updateDcb(){
  	this.accountingService.updateDCBNo(this.params).subscribe((data:any) => {
  		if(data['returnCode'] != -1) {
  		  this.dialogMessage = data['errorList'][0].errorMessage;
  		  this.dialogIcon = "error";
  		  this.successDiag.open();
  		}else{
  		  this.dialogMessage = "";
  		  this.dialogIcon = "success";
  		  this.successDiag.open();
  		  this.retrieveDCB();
  		}
  	});
  }

  onClickView(){
    this.viewDcb.openNoClose();
    this.bankTbl.loadingFlag = true;
    this.collectTbl.loadingFlag = true;
    var sub$ = forkJoin(this.accountingService.getDcbCollection(this.params.dcbYear,this.params.dcbNo),
                        this.accountingService.getBankDetails(this.params.dcbYear,this.params.dcbNo)
                        ).pipe(map(([collection, bankDtl]) => { return { collection, bankDtl}}));

    this.subscription.add(sub$.subscribe((data:any) => {
      console.log(data)
      
      this.passDataCollection.tableData = data.collection.dcbCollection;
      this.passDataBank.tableData = data.bankDtl.bankDetails;

      this.bankTbl.refreshTable();
      this.collectTbl.refreshTable();
      this.bankTbl.loadingFlag = false;
      this.collectTbl.loadingFlag = false;
    }));
  }

  getRecords(){
    this.maintenanceService.getMtnAcitDCBNo(null,null,null,this.params.status).pipe(finalize(() => this.finalGetRecords())).subscribe((data:any)=>{
      this.passData.tableData = data.dcbNoList;
    });
  }

  finalGetRecords(selection?){
    this.export(this.passData.tableData);
  };

  export(record?){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'AcitChartAcct'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.nvl = function(text) {
        if (text === null){
          return '';
        } else {
          return text;
        }
      };

      alasql.fn.datetime = function(dateStr) {
        if(dateStr === null){
          return '';
        }else{
          var date = new Date(dateStr);
          return date.toLocaleString();
        }
      };
    alasql('SELECT dcbDate AS [DCB Date], dcbYear AS [DCB Year], dcbNo AS [DCB No], dcbStatDesc AS [DCB Status], nvl(remarks) AS [Remarks], datetime(closeDate) AS [Close Date], autoTag AS [Auto] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);    
  }

  onTabChange($event: NgbTabChangeEvent) {
    console.log($event)
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('');
    }
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

}
