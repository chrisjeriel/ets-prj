import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Title } from '@angular/platform-browser';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MtnTreatyComponent } from '@app/maintenance/mtn-treaty/mtn-treaty.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-claim-cash-call',
  templateUrl: './claim-cash-call.component.html',
  styleUrls: ['./claim-cash-call.component.css']
})
export class ClaimCashCallComponent implements OnInit {

  	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild("confirmSave") confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  	@ViewChild(MtnTreatyComponent) treatyLOV: MtnTreatyComponent;
    @ViewChild("treatyCopyLOV") treatyCopyLOV: MtnTreatyComponent;
  	@ViewChild('treatyShare') cedingCoLOV: CedingCompanyComponent;
    @ViewChild("treatyCopyShare") cedingCopyCoLOV: CedingCompanyComponent;
    @ViewChild("treatyTable") treatyTable: CustEditableNonDatatableComponent;


  	passData: any = {
	  	tableData: [],
	  	tHeader: ['Clm Cash Call ID', 'Clm Cash Call Amt', 'Effective From', 'Active', 'Remarks'],
	  	dataTypes: ['sequence-6','currency','date','checkbox', 'text'],
	  	keys: ['histNo', 'amount', 'effDateFrom', 'activeTag', 'remarks'],
	  	widths: [1,'200','140',1,'auto'],
	  	uneditable: [true,false,false,false,false],
	  	uneditableKeys: ['amount','effDateFrom'],
	  	nData: {
        newRec: 1,
	  		histNo: '',
	  		amount: '',
	  		effDateFrom: '',
	  		activeTag: 'Y',
	  		remarks: '',
	  		createUser: this.ns.getCurrentUser(),
	  		createDate: this.ns.toDateTimeString(0),
	  		updateUser: this.ns.getCurrentUser(),
	  		updateDate: this.ns.toDateTimeString(0),
        treatyId: null,
        treatyCedId: null,
        currCd: null,
  		},
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: true
  	}

  	treatyCd: any = '';
  	treaty: any = '';
  	treatyCompCd: any = '';
  	treatyComp: any = '';
  	currencyCd: any = '';
  	currencyList: any[] = [];
  	hiddenTreaty: any[] = [];
  	hiddenCedingCo: any[] = [];
  	selected: any = null;
  	dialogIcon:string = '';
 	  dialogMessage: string = '';
 	  disableCopySetup: boolean = true;

    oldRecord    : any = {
      treatyCd        : null,
      treatyCompCd    : null
    }

    clmCashCallRecord : any = {
      createUser    : null,
      createDate    : null,
      updateUser    : null,
      updateDate    : null,
    }

   selectedData : any;
   deleteBool : boolean;
	 subscription: Subscription = new Subscription();

   mtnClmCashCallReq  : any = { 
                "delCashCall": [],
                "saveCashCall"  : []}
   cancelFlag: boolean;
   copytreatyCd: any = '';
   copytreaty: any = '';
   copytreatyCompCd: any = '';
   copytreatyComp: any = '';
   errorMsg: number = 0;

  constructor(	private ns: NotesService, 
  				private ms: MaintenanceService, 
  				private modalService: NgbModal, 
  				private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Mtn | Claim Cash Call");
    this.getMtnCurrencyList();
  }

  ngOnDestroy() {
		this.subscription.unsubscribe();
  }

  getMtnCurrencyList(){
  	this.ms.getMtnCurrencyList('').subscribe(data => {
      this.currencyList = data['currency'];
  	});
  }

  onRowClick(data) {
    if(data !== null){
      this.selectedData = data;
      this.clmCashCallRecord.createUser  = data.createUser;
      this.clmCashCallRecord.createDate  = data.createDate;
      this.clmCashCallRecord.updateUser  = data.updateUser;
      this.clmCashCallRecord.updateDate  = data.updateDate;

       if(this.selectedData.okDelete == 'N'){
           this.passData.disableGeneric    = true;     
           this.disableCopySetup = false;    
       }else{
           this.passData.disableGeneric = false;
           this.disableCopySetup = true;   
       }
    } else {
      this.passData.disableGeneric    = true;
      this.disableCopySetup = true;
      this.clmCashCallRecord.createUser  = null;
      this.clmCashCallRecord.createDate  = null;
      this.clmCashCallRecord.updateUser  = null;
      this.clmCashCallRecord.updateDate  = null;
    }
  }

  showTreatyLOV(ev) {
		this.treatyLOV.modal.openNoClose();
  }

  setSelectedTreaty(data){
  	this.treatyCd = data.treatyId;
  	this.treaty = data.treatyName;
    this.ns.lovLoader(data.ev, 0);
  }

  showTreatyCompLOV(ev){
  	this.cedingCoLOV.modal.openNoClose();
  }

  setSelectedCedCoTreatyShare(data){
  	this.treatyCompCd = data.cedingId;
  	this.treatyComp = data.cedingName;
    this.ns.lovLoader(data.ev, 0);
  }

   checkCode(ev, field){
        $('#treatyCode').removeClass('ng-dirty');
        $('#treatyCompCode').removeClass('ng-dirty');
        ev.preventDefault();
          if($('.ng-dirty').length != 0 ){
          const subject = new Subject<boolean>();
          const modal = this.modalService.open(ConfirmLeaveComponent,{
              centered: true, 
              backdrop: 'static', 
              windowClass : 'modal-size'
          });
              modal.componentInstance.subject = subject;

              subject.subscribe(a=>{
                 if(a){
                  this.showList(ev,field);
                 } 
                 else {
                  this.treatyCd = this.oldRecord.treatyCd; 
                  this.treatyCompCd = this.oldRecord.treatyCompCd; 
                  this.currencyCd = this.oldRecord.currencyCd; 
                 }
              })
          } else {
               this.showList(ev,field);
          }
  }

   showList(ev,obj){
      if(obj === 'treaty'){
            this.oldRecord.treatyCd = this.treatyCd;
            if (this.treatyCd == null || this.treatyCd == '') {
                this.treatyCd= '';
                this.treaty= '';
                this.currencyCd = '';
                this.clear();
            } else {
                this.treaty= '';
                this.currencyCd = '';
                this.clear();
                this.ns.lovLoader(ev, 1);
                this.treatyLOV.checkCode(this.treatyCd,ev);
            }
        } else if(obj === 'treatyComp'){
            this.oldRecord.treatyCompCd = this.treatyCompCd;
            if (this.treatyCompCd == null || this.treatyCompCd == '') {
                this.treatyCompCd = '';
                this.treatyComp = '';
                this.currencyCd = '';
                this.clear();
            } else {
                this.treatyComp = '';
                this.currencyCd = '';
                this.clear();
                this.ns.lovLoader(ev, 1);
                this.cedingCoLOV.checkCode(this.treatyCompCd,ev);
            }
        } else if(obj == 'currency'){

           if(this.treatyCd != '' && this.treatyCompCd != '' && this.currencyCd != '') {
              this.getMtnClmCashCall();
           } 
           
           setTimeout(() => {
              this.table.markAsPristine();
          }, 0);
        }
    } 

    clear(){
        $('.ng-dirty').removeClass('ng-dirty');
        this.passData.tableData = [];
        this.passData.disableAdd = true;
        this.passData.disableGeneric = true;
        this.disableCopySetup = true;
        this.table.refreshTable();
    }

  getMtnClmCashCall() {
    this.table.overlayLoader = true;
    this.oldRecord.treatyCd = this.treatyCd;
    this.oldRecord.treatyCompCd = this.treatyCompCd;
    this.oldRecord.currencyCd = this.currencyCd;
    this.ms.getMtnClmCashCall(this.treatyCd, this.treatyCompCd, this.currencyCd).subscribe(data => {
       console.log(data);
      this.passData.tableData = data['cashCallList'].sort((a, b) => b.effDateFrom - a.effDateFrom)
                                 .map(i => {
                                    i.effDateFrom = this.ns.toDateTimeString(i.effDateFrom).split('T')[0];
                                    i.createDate = this.ns.toDateTimeString(i.createDate);
                                    i.updateDate = this.ns.toDateTimeString(i.updateDate);
                                    return i;
                                  });
      this.disableCopySetup = true;                           
      this.passData.disableAdd = false;
      this.table.refreshTable();
    });
  }

 onClickDelete($event){
    if (this.selectedData.add){
          this.deleteBool = false;
          this.treatyTable.indvSelect.deleted = true;
          this.treatyTable.selected  = [this.treatyTable.indvSelect];
          this.treatyTable.confirmDelete();
       }
 }

 checkFields(){
      for(let check of this.passData.tableData){
        if(check.amount === '' || Number.isNaN(check.amount) || check.effDateFrom === ''){   
          return false;
        } 
      }
      return true;
 }

 checkEffFields(){
    var max = this.treatyTable.passData.tableData.filter(c => c.activeTag == 'Y' && c.histNo != '' && c.add != true)
                  .sort((a, b) => Number(new Date(b.effDateFrom)) - Number(new Date(a.effDateFrom)))[0];
    for(let check of this.passData.tableData){
        if(check.add){
              if (max === undefined){
                return true;
              } else {
                  if(new Date(check.effDateFrom) <= new Date(max.effDateFrom)){0
                    return false;
                  }
              }
        }
    }
   return true;
}

 onClickSave(){
     if(this.checkFields()){
         if(this.checkEffFields()){
           this.confirmSave.confirmModal();
         } else {
           this.modalService.dismissAll();
           this.errorMsg = 1;
           $('#mtnClmCashCallWarningModal > #modalBtn').trigger('click');
         }
         
     } else {
        this.dialogMessage="Please check field values.";
        this.dialogIcon = "error";
        this.successDialog.open();
     }
 }

 cbFunc2(cb){
    return cb === true?'Y':'N';
 }

 onClickSaveCashCall(cancelFlag?){ 
     this.cancelFlag = cancelFlag !== undefined;   

     if(this.cancelFlag){
        if(this.checkFields()){
          if(this.checkEffFields()){
            this.saveDataClmCashCall();
          } else {
            this.modalService.dismissAll();
            this.errorMsg = 1;
            $('#mtnClmCashCallWarningModal > #modalBtn').trigger('click');
          }
        }else{
          this.dialogMessage="Please fill up required fields.";
          this.dialogIcon = "error";
          this.successDialog.open();
        }
     } else {
       this.saveDataClmCashCall();
     }

 }

 saveDataClmCashCall(){
     this.mtnClmCashCallReq.saveCashCall = [];
     this.mtnClmCashCallReq.delCashCall = [];
     this.mtnClmCashCallReq.saveCashCall = this.passData.tableData.filter(a=>a.edited && !a.deleted);
     this.mtnClmCashCallReq.saveCashCall.forEach(a=>a.treatyId = this.treatyCd);
     this.mtnClmCashCallReq.saveCashCall.forEach(a=>a.treatyCedId = this.treatyCompCd);
     this.mtnClmCashCallReq.saveCashCall.forEach(a=>a.currCd = this.currencyCd);
     this.mtnClmCashCallReq.saveCashCall.forEach(a=>a.updateUser = this.ns.getCurrentUser());
      
      if(this.mtnClmCashCallReq.saveCashCall.length === 0 && this.mtnClmCashCallReq.delCashCall.length === 0  ){     
              this.confirmSave.showBool = false;
              this.dialogIcon = "success";
              this.successDialog.open();
            } else {
              this.confirmSave.showBool = true;
              this.passData.disableGeneric = true;
              this.saveCashCall(this.mtnClmCashCallReq);     
      }  
 }

 saveCashCall(obj){
    console.log(JSON.stringify(obj));
    this.ms.saveMtnClmCashCall(JSON.stringify(obj))
                .subscribe(data => {
                  console.log(data);
              if(data['returnCode'] == -1){
                  this.dialogIcon = "success";
                  this.successDialog.open();
                  this.getMtnClmCashCall();
              }else{
                  this.dialogIcon = "error";
                  this.successDialog.open();
                  this.getMtnClmCashCall();
              }
    });
  }

  onCopySetupClick() {
    $('#mtnClmCashCallCopyModal > #modalBtn').trigger('click');
  }

  showTreatyCopyLOV(){
    this.treatyCopyLOV.modal.openNoClose();
  }

  setSelectedCopyTreaty(data){
    this.copytreatyCd = data.treatyId;
    this.copytreaty = data.treatyName;
    this.ns.lovLoader(data.ev, 0);
  }

  showTreatyCompCopyLOV(){
    this.cedingCopyCoLOV.modal.openNoClose();
  }

  setSelectedCopyCedCoTreatyShare(data){
    this.copytreatyCompCd = data.cedingId;
    this.copytreatyComp = data.cedingName;
    this.ns.lovLoader(data.ev, 0);
  }


  checkCopyCode(ev, field){
     if(field === 'treaty'){
          this.ns.lovLoader(ev, 1);
          this.treatyCopyLOV.checkCode(this.copytreatyCd,ev);
     } else if(field === 'treatyComp'){
          this.ns.lovLoader(ev, 1);
          this.cedingCopyCoLOV.checkCode(this.copytreatyCompCd,ev);        
    } 
  }


  onCopyCancel() {
    this.copytreatyCd = '';
    this.copytreaty = '';
    this.copytreatyCompCd = '';
    this.copytreatyComp = '';
  }

  onClickModalCopy(){

    if(this.treatyCd == '' || this.treatyCompCd == '') {
      this.dialogIcon = "error";
      this.successDialog.open();
      return;
    }

    $('.globalLoading').css('display','block');
    var params = {
       copyFromCurrCd: this.selectedData.currCd,
       copyFromHistNo: this.selectedData.histNo,
       copyFromTreatyCedId: this.selectedData.treatyCedId,
       copyFromTreatyId: this.selectedData.treatyId,
       copyToCurrCd: this.currencyCd,
       copyToTreatyCedId: this.copytreatyCompCd,
       copyToTreatyId: this.copytreatyCd,
       createDate: this.ns.toDateTimeString(0),
       createUser: this.ns.getCurrentUser(),
       updateDate: this.ns.toDateTimeString(0),
       updateUser: this.ns.getCurrentUser()
    }

    console.log(params);
    
    this.ms.copyMtnClmCashCall(JSON.stringify(params)).subscribe(data => {
      $('.globalLoading').css('display','none');
      if(data['returnCode'] == -1) {
        $('#mtnClmCashCallSuccessModal > #modalBtn').trigger('click');
        this.getMtnClmCashCall();
        this.onCopyCancel();
      } else if(data['returnCode'] == 2) {
        this.modalService.dismissAll();
        this.errorMsg = 2;
        this.onCopyCancel();
        $('#mtnClmCashCallWarningModal > #modalBtn').trigger('click');
      }
    });

  }

}

   


