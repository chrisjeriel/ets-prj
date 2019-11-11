import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkFlowManagerService, NotesService, UnderwritingService, QuotationService } from '@app/_services';
import { finalize } from 'rxjs/operators';
import { WfReminderFormComponent } from '@app/home/wf-reminders/wf-reminder-form/wf-reminder-form.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wf-reminders',
  templateUrl: './wf-reminders.component.html',
  styleUrls: ['./wf-reminders.component.css']
})
export class WfRemindersComponent implements OnInit {
  @ViewChild(WfReminderFormComponent) wfReminder : WfReminderFormComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmsaveDiag: ConfirmSaveComponent;
  @ViewChild("confirmModal") confirmModal : ModalComponent;


  currentUser : string;
  alarmTime: string;
  reminder: string;
  reminderDate: string;
  title: string;
  reminderList: any[] = [];
  reminderBool: boolean = true;
  selectedReminder: any = null;
  reminderNull: boolean = false;
  loadingFlag: boolean;
  content: any;
  reminderInfo: any[] =[];
  cancelFlag: boolean;
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  onOkVar: string = "";
  updateMode: string;
  updateReminderInfoParam = {};
  paramStatus: string = "A";
  reminderParams: any;

  constructor(private workFlowManagerService: WorkFlowManagerService, 
              private ns: NotesService,
              private modalService: NgbModal, 
              private uwService: UnderwritingService,
              private router: Router,
              private quotationService: QuotationService) { }
    
  ngOnInit() {
     this.selectedReminder = 'atm';
     this.retrieveReminders('atm');
  }

  retrieveReminders(obj){
       this.currentUser = JSON.parse(window.localStorage.currentUser).username;
       
    if (obj === 'atm'){
       this.reminderBool = true;
       this.reminderList = [];
       this.loadingFlag = true;
       this.reminderNull = false;
       $("#reminderDiv").css({"height": "auto"});
       this.workFlowManagerService.retrieveWfmReminders('',this.currentUser,'','','', this.paramStatus).pipe(finalize(() => this.setReminderList()))
       .subscribe((data)=>{
           var records = data['reminderList'];
               for(let rec of records){
                 rec.createDate = this.ns.toDateTimeString(rec.createDate);
                 rec.updateDate = this.ns.toDateTimeString(rec.updateDate);
                 if(rec.assignedTo === this.currentUser){
                   this.reminderList.push(rec);
                 }
               }
        },
            error => {
              console.log("ERROR:::" + JSON.stringify(error));
       });

    } else if(obj === 'mr') {
      this.reminderBool = false;
      this.reminderList = [];
      this.loadingFlag = true;
      this.reminderNull = false;
      $("#reminderDiv").css({"height": "auto"});
       this.workFlowManagerService.retrieveWfmReminders('','',this.currentUser,'','', this.paramStatus).pipe(finalize(() => this.setReminderList()))
       .subscribe((data)=>{
           var records = data['reminderList'];
               for(let rec of records){
                 if(rec.createUser === this.currentUser){
                   this.reminderList.push(rec);
                 }
               }
        },
            error => {
              console.log("ERROR:::" + JSON.stringify(error));
       });
    }
  }

  setReminderList(){
    this.loadingFlag = false;
    if(this.isEmptyObject(this.reminderList)){
      $("#reminderDiv").css({"height": "auto"});
      this.reminderNull = true;
    } else if (this.reminderList.length <= 3) {
      $("#reminderDiv").css({"height": "auto"});
      this.reminderNull = false;
    } else {
      $("#reminderDiv").css({"height": "400px"});
      this.reminderNull = false;
    }

  }

  tabSelectedRemindersController(event){
     if (this.selectedReminder == "atm"){
          this.retrieveReminders('atm');
     } else {
          this.retrieveReminders('mr');
     }
  }

   isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

  showReminderModal(reminder,isReadOnly){
    this.wfReminder.reminder = reminder;
    this.wfReminder.isReadOnly = isReadOnly;
    $('#reminderModal #modalBtn').trigger('click');
    console.log('jejejejejejejeje');
  }

  updateReminderModal(reminder, status){
    reminder.status = status;
    this.updateMode = status;
    this.reminderParams = reminder;
    this.confirmModal.openNoClose();
  }

  onClickYes(updateMode){
    this.saveReminderParams(this.updateReminderInfoParam);
  }

  onClickNo(){
     this.modalService.dismissAll();
  }

  onClickSave() {
    var saveReminderParams = {
      reminderList : [],
      delReminderList : []
    };

    saveReminderParams.reminderList.push(this.reminderParams);

    this.workFlowManagerService.saveWfmReminders(saveReminderParams).subscribe((data: any)=>{
        if (data.errorList.length > 0) {
          this.dialogIcon = "error";
          this.successDiag.open();
        } else {
          this.dialogIcon = "success";
          this.successDiag.open();
          this.reloadReminders();
        }
    });
  }

  formatDate(date) {
    var d = new Date(date);
    return  ("00" + (d.getMonth() + 1)).slice(-2) + "/" +("00" + d.getDate()).slice(-2)+ "/" + d.getFullYear()+ " "+("00" + d.getHours()).slice(-2) + ":" +("00" + d.getMinutes()).slice(-2) 
    +":" + ("00" + d.getSeconds()).slice(-2) 
  }

  saveReminder(data) {
    this.reminderParams = data;
    this.updateMode = 'U';
    this.confirmModal.openNoClose();
  }

/*  saveReminder(event){        
    this.prepareParamReminder();
  }*/

/*  prepareParamReminder(cancelFlag?){
     
    this.cancelFlag = cancelFlag !== undefined;

     var saveReminderInfoParam = {
     "alarmTime"  : this.wfReminder.alarmDate,
     "assignedTo" : this.wfReminder.userId,
     "createDate" : this.ns.toDateTimeString(this.reminderInfo[0].createDate),
     "createUser" : this.wfReminder.createdBy,
     "remiderDate": this.wfReminder.reminderDate,
     "reminder"   : this.wfReminder.reminder,
     "reminderId" : this.reminderInfo[0].reminderId,
     "status"     : "A",
     "title"      : this.wfReminder.title,
     "updateUser" : JSON.parse(window.localStorage.currentUser).username,
     "updateDate" : this.ns.toDateTimeString(0),
     }

     console.log(saveReminderInfoParam);
     this.saveReminderParams(saveReminderInfoParam);
  }*/

    saveReminderParams(obj){
     this.workFlowManagerService.saveWfmReminders(obj).pipe(finalize(() => this.saveFinalProcess())).
     subscribe(data => {
             console.log(data);
            if(data['returnCode'] === 0) {
                 this.dialogIcon = 'error-message';
                 this.dialogMessage = "Error saving reminder";
                 this.onOkVar = 'openReminderMdl';
                 this.successDiag.open();
            } else if (data['returnCode'] === -1) {  
                 this.dialogIcon = 'success-message';
                 this.dialogMessage = "Successfully Saved";;
                 this.onOkVar = 'closeReminderMdl';
                 this.successDiag.open();     
            }
     })        
    }
  
   saveFinalProcess(){
      if (this.selectedReminder == "atm"){
          this.retrieveReminders('atm');
      } else {
          this.retrieveReminders('mr');
      }
   }

   reloadReminders(){
      if (this.selectedReminder == "atm"){
          this.retrieveReminders('atm');
      } else {
          this.retrieveReminders('mr');
      }
   }

   dpDownStatus(event) {
     this.reloadReminders();
   }


  onOkSuccessDiagReminder(obj){
    this.wfReminder.disablebtnBool = false;
    if (obj === 'openReminderMdl'){
      this.modalService.dismissAll();
      $('#reminderModal #modalBtn').trigger('click');
    }else if(obj === 'closeReminderMdl'){
        this.modalService.dismissAll();
    }
  }

  redirectToQuoteGenInfo(origin, data) {
    if (origin == 'detail') {
      var temp = data;
      data = {};
      data.referenceNo = temp.details;
      data.referenceId = temp.referenceId;
    }

    var line = data.referenceNo.split("-")[0];

    this.quotationService.toGenInfo = [];
    this.quotationService.toGenInfo.push("edit", line);
    this.quotationService.savingType = 'normal';

    setTimeout(() => {
        this.router.navigate(['/quotation', { line: line,  quotationNo : data.referenceNo, quoteId: data.referenceId, from: 'quo-processing'}], { skipLocationChange: true });
    },100);
  }

  redirectToclaimGenInfo(origin, data) {
    if (origin == 'detail') {
      var temp = data;
      data = {};
      data.referenceNo = temp.details;
      data.referenceId = temp.referenceId;
    }

    let line = data.referenceNo.split('-')[0];
    setTimeout(() => {
      this.router.navigate(
                    ['/claims-claim', {
                        from: 'edit',
                        readonly: true,
                        claimId: data.referenceId,
                        claimNo: data.referenceNo,
                        line: line,
                        exitLink: '/'
                    }],
                    { skipLocationChange: true }
      );    
    },100);
  }


  redirectToPolGenInfo(origin, relData) {
    if (origin == 'detail') {
      var temp = relData;
      relData = {};
      relData.referenceNo = temp;
    }

    var fetchedData = null;
    var searchParams = [];

    searchParams.push({ key: "policyNo",
                       search: relData.referenceNo
                     });
    this.uwService.getParListing(searchParams).subscribe(data => {
          var records = data['policyList'];

          for (var i = 0; i < records.length; i++) {
            if (relData.referenceNo == records[i].policyNo) {
              fetchedData = records[i];
            }
          }

          if (fetchedData != null) {
            var polLine = fetchedData.policyNo.split("-")[0];
            var policyId = fetchedData.policyId;
            var statusDesc = fetchedData.statusDesc;
            var riskName = fetchedData.project.riskName;
            var insuredDesc = fetchedData.insuredDesc;
            var quoteId = fetchedData.quoteId; 
            var quotationNo = fetchedData.quotationNo; 


            this.uwService.getPolAlop(fetchedData.policyId, fetchedData.policyNo).subscribe((data: any) => {
                this.uwService.fromCreateAlt = false;
                if (statusDesc === 'In Progress' || statusDesc === 'Approved'){
                    this.uwService.toPolInfo = [];
                    this.uwService.toPolInfo.push("edit", polLine);
                    this.router.navigate(['/policy-issuance', {exitLink:'/policy-listing', line: polLine, policyNo: fetchedData.policyNo, policyId: fetchedData.policyId, editPol: true, statusDesc: statusDesc ,riskName: riskName, insured: insuredDesc, quoteId: quoteId, quotationNo: quotationNo }], { skipLocationChange: true });
                } else if (statusDesc === 'In Force' || statusDesc === 'Pending Approval' || statusDesc === 'Rejected') {
                    this.router.navigate(['/policy-issuance', {exitLink:'/policy-listing', line: polLine, policyNo: fetchedData.policyNo, policyId: fetchedData.policyId, editPol: false, statusDesc: statusDesc, riskName: riskName, insured: insuredDesc, quoteId: quoteId, quotationNo: quotationNo }], { skipLocationChange: true }); 
                }
            });
          }
    });

  }

}
