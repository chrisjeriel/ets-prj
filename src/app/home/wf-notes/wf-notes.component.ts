import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkFlowManagerService, NotesService } from '@app/_services';
import { finalize } from 'rxjs/operators';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { WfNotesFormComponent } from '@app/home/wf-notes/wf-notes-form/wf-notes-form.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';


interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
];

@Component({
  selector: 'app-wf-notes',
  templateUrl: './wf-notes.component.html',
  styleUrls: ['./wf-notes.component.css']
})
export class WfNotesComponent implements OnInit {

  @ViewChild(WfNotesFormComponent)  wfNotes : WfNotesFormComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmsaveDiag: ConfirmSaveComponent;

  countries = COUNTRIES;
  currentUser : string;
  selectedNotes: any = null;
  noteBool: boolean = true;
  noteList: any[] = [];
  loadingFlag: boolean;
  noteNull: boolean = false;
  noteInfo: any[] =[];
  updateMode: boolean;
  updateNoteInfoParam = {};
  cancelFlag: boolean;
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  onOkVar: string = "";

  constructor(private workFlowManagerService: WorkFlowManagerService, private ns: NotesService,private modalService: NgbModal) { }

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
       this.workFlowManagerService.retrieveWfmNotes('',this.currentUser,'').pipe(finalize(() => this.setNoteList()))
       .subscribe((data)=>{
           var records = data['noteList'];
               for(let rec of records){
                 if(rec.assignedTo === this.currentUser && rec.status === "A"){
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
       this.workFlowManagerService.retrieveWfmNotes('','',this.currentUser).pipe(finalize(() => this.setNoteList()))
       .subscribe((data)=>{
           var records = data['noteList'];
               for(let rec of records){
                 if(rec.createUser === this.currentUser && rec.status === "A"){
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

  showNoteModal( noteId : string,
    title : string,
    note  : string,
    assignedTo : string, 
    createUser: string,
    createDate : string,
    updateUser : string,
    updateDate : string ,
    viewMode : boolean){

    this.noteInfo = [];

    this.noteInfo.push({
                            noteId : noteId,
                            createDate : createDate,
                          });
    
    this.wfNotes.title = title;
    this.wfNotes.notes = note;
    this.wfNotes.userId = assignedTo;
    this.wfNotes.createdBy = createUser;
    this.wfNotes.updatedBy = updateUser;
    this.wfNotes.dateCreated = this.formatDate(createDate);
    this.wfNotes.lastUpdate = this.formatDate(updateDate);


    if (viewMode){
       this.wfNotes.ViewMode = true;
       this.wfNotes.disablebtnBool = true;
     } else {
       this.wfNotes.ViewMode = false;
       this.wfNotes.disablebtnBool = false;
     }

     $('#noteModal #modalBtn').trigger('click');
  }

  updateNoteModal( noteId : string,
    title : string,
    note : string, 
    assignedTo : string, 
    createUser: string,
    createDate : string,
    updateUser : string,
    updateDate : string ,
    updateMode : boolean){

    this.updateMode = updateMode;
    var status : any ;

    if (updateMode){
      status = 'C';
      $('#confirmModal #modalBtn').trigger('click');
    } else {
      status = 'D';
      $('#confirmModal #modalBtn').trigger('click');
    }
    this.updateNoteInfoParam = {};

    this.updateNoteInfoParam = {
       "assignedTo" : assignedTo,
       "createDate" : this.ns.toDateTimeString(createDate),
       "createUser" : createUser,
       "note"       : note,
       "noteId"     : noteId,
       "status"     : status,
       "title"      : title,
       "updateUser" : JSON.parse(window.localStorage.currentUser).username,
       "updateDate" : this.ns.toDateTimeString(0),
     }
  }

  onClickYes(updateMode){
    this.modalService.dismissAll();
    this.saveNoteParams(this.updateNoteInfoParam);
  }

  onClickNo(){
     this.modalService.dismissAll();
  }

  saveNote(event){        
    this.confirmsaveDiag.saveModal.openNoClose();
  }


  prepareParam(cancelFlag?){
    this.modalService.dismissAll();
      this.cancelFlag = cancelFlag !== undefined;

       var saveNoteInfoParam = {
       "assignedTo" : this.wfNotes.userId,
       "createDate" : this.ns.toDateTimeString(this.noteInfo[0].createDate),
       "createUser" : this.wfNotes.createdBy,
       "note"       : this.wfNotes.notes,
       "noteId"     : this.noteInfo[0].noteId,
       "status"     : "A",
       "title"      : this.wfNotes.title,
       "updateUser" : JSON.parse(window.localStorage.currentUser).username,
       "updateDate" : this.ns.toDateTimeString(0),
       }

       console.log(saveNoteInfoParam);
       this.saveNoteParams(saveNoteInfoParam);

  }

  saveNoteParams(obj){
     this.workFlowManagerService.saveWfmNotes(obj).pipe(finalize(() => this.saveFinalProcess())).
     subscribe(data => {
             console.log(data);

            if(data['returnCode'] === 0) {
                 this.dialogIcon = 'error-message';
                 this.dialogMessage = "Error saving reminder";
                 this.modalService.dismissAll();
                 this.onOkVar = 'openNoteMdl';
                 this.successDiag.open();
            } else if (data['returnCode'] === -1) {  
                 this.dialogIcon = 'success-message';
                 this.dialogMessage = "Successfully Saved";;
                 this.modalService.dismissAll();
                 this.onOkVar = 'closeNoteMdl';
                 this.successDiag.open();     
            }
     })        
    }
  
   saveFinalProcess(){
      if (this.selectedNotes == "atm"){
          this.retrieveNotes('atm');
      } else {
          this.retrieveNotes('mr');
      }
   }


  onOkSuccessDiag(obj){
    if (obj === 'openNoteMdl'){
      this.modalService.dismissAll();
      $('#noteModal #modalBtn').trigger('click');
    }else if(obj === 'closeNoteMdl'){
        this.modalService.dismissAll();
    }
  }


  formatDate(date) {
    var d = new Date(date);
    return  ("00" + (d.getMonth() + 1)).slice(-2) + "/" +("00" + d.getDate()).slice(-2)+ "/" + d.getFullYear()+ " "+("00" + d.getHours()).slice(-2) + ":" +("00" + d.getMinutes()).slice(-2) 
    +":" + ("00" + d.getSeconds()).slice(-2) 
  }

}
