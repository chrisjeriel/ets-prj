import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkFlowManagerService, NotesService, QuotationService, UnderwritingService } from '@app/_services';
import { finalize } from 'rxjs/operators';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { WfNotesFormComponent } from '@app/home/wf-notes/wf-notes-form/wf-notes-form.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-wf-notes',
  templateUrl: './wf-notes.component.html',
  styleUrls: ['./wf-notes.component.css']
})
export class WfNotesComponent implements OnInit {

  @ViewChild(WfNotesFormComponent)  wfNotes : WfNotesFormComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmsaveDiag: ConfirmSaveComponent;
  @ViewChild("confirmModal") confirmModal : ModalComponent;

  currentUser : string;
  selectedNotes: any = null;
  noteBool: boolean = true;
  noteList: any[] = [];
  loadingFlag: boolean;
  noteNull: boolean = false;
  noteInfo: any[] =[];
  updateMode: string;
  updateNoteInfoParam = {};
  cancelFlag: boolean;
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  onOkVar: string = "";
  paramStatus: string = "A";
  noteParams: any;

  constructor(private workFlowManagerService: WorkFlowManagerService, 
              private ns: NotesService,
              private modalService: NgbModal,
              private quotationService: QuotationService,
              private router: Router,
              private uwService: UnderwritingService) { }

  ngOnInit() {
    this.selectedNotes = 'atm';
    this.retrieveNotes('atm');
  }

  retrieveNotes(obj){
       this.currentUser = JSON.parse(window.localStorage.currentUser).username;
       console.log(obj);
       
    if (obj === 'atm'){
       this.noteBool = true;
       this.noteList = [];
       this.loadingFlag = true;
       this.noteNull = false;
       $("#noteDiv").css({"height": "auto"});
       this.workFlowManagerService.retrieveWfmNotes('',this.currentUser,'','','',this.paramStatus).pipe(finalize(() => this.setNoteList()))
       .subscribe((data)=>{
           var records = data['noteList'];
               for(let rec of records){
                 if(rec.assignedTo === this.currentUser){
                   this.noteList.push(rec);
                 }
               }
        },
            error => {
              console.log("ERROR:::" + JSON.stringify(error));
       });

    } else if(obj === 'mr') {
      this.noteBool = false;
      this.noteList = [];
      this.loadingFlag = true;
      this.noteNull = false;
      $("#noteDiv").css({"height": "auto"});
       this.workFlowManagerService.retrieveWfmNotes('','',this.currentUser,'','',this.paramStatus).pipe(finalize(() => this.setNoteList()))
       .subscribe((data)=>{
           var records = data['noteList'];
               for(let rec of records){
                 if(rec.createUser === this.currentUser){
                   this.noteList.push(rec);
                 }
               }
        },
            error => {
              console.log("ERROR:::" + JSON.stringify(error));
       });
    }
  }

  setNoteList(){
    console.log(this.noteList);
    this.loadingFlag = false;
    if(this.isEmptyObject(this.noteList)){
      $("#noteDiv").css({"height": "auto"});
      this.noteNull = true;
    } else if (this.noteList.length <= 3) {
      $("#noteDiv").css({"height": "auto"});
      this.noteNull = false;
    } else {
      $("#noteDiv").css({"height": "400px"});
      this.noteNull = false;
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


  tabSelectedNotesController(event){
    if (this.selectedNotes == "atm"){
          this.retrieveNotes('atm');
     } else {
          this.retrieveNotes('mr');
     }
  }

  dpDownStatus(event){
    this.reloadNotes();
  }

  

  showNoteModal(note, viewMode: boolean){
    this.wfNotes.note = note;
    this.wfNotes.isReadOnly = viewMode;
    $('#noteModal #modalBtn').trigger('click');
  }

  updateNoteModal(note, status){
    note.status = status;
    this.updateMode = status;
    this.noteParams = note;
    this.confirmModal.openNoClose();
  }

  onClickSave() {
    var saveNotesParams = {
      noteList : [],
      delNoteList : []
    };

    saveNotesParams.noteList.push(this.noteParams);

    this.workFlowManagerService.saveWfmNotes(saveNotesParams).subscribe((data: any)=>{
        if (data.errorList.length > 0) {
          this.dialogIcon = "error";
          this.successDiag.open();
        } else {
          this.dialogIcon = "success";
          this.successDiag.open();
          this.reloadNotes();
        }
    });
  }

  saveNote(data) {
    this.noteParams = data;
    this.updateMode = 'U';
    this.confirmModal.openNoClose();
  }

  onClickNo(){
     this.modalService.dismissAll();
  }


  reloadNotes(){
      if (this.selectedNotes == "atm"){
          this.retrieveNotes('atm');
      } else {
          this.retrieveNotes('mr');
      }
  }


  formatDate(date) {
    var d = new Date(date);
    return  ("00" + (d.getMonth() + 1)).slice(-2) + "/" +("00" + d.getDate()).slice(-2)+ "/" + d.getFullYear()+ " "+("00" + d.getHours()).slice(-2) + ":" +("00" + d.getMinutes()).slice(-2) 
    +":" + ("00" + d.getSeconds()).slice(-2) 
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
