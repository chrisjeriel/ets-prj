import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkFlowManagerService,NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';


@Component({
  selector: 'app-wf-notes-form',
  templateUrl: './wf-notes-form.component.html',
  styleUrls: ['./wf-notes-form.component.css']
})
export class WfNotesFormComponent implements OnInit {
  @Output() onYes: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  note: any = {
    "noteId"       : null,
    "title"        : null,
    "note"         : null,
    "impTag"       : null,
    "urgTag"       : null,
    "module"       : null,
    "referenceId"  : null,
    "details"      : null,
    "assignedTo"   : null,
    "status"       : null,
    "createUser"   : null,
    "createDate"   : null,
    "updateUser"   : null,
    "updateDate"   : null,
  };
  isReadOnly: boolean = true;	
  dialogIcon:string  = "";
  dialogMessage:string  = "";

  constructor(config: NgbModalConfig,
     public modalService: NgbModal,private workFlowManagerService: WorkFlowManagerService, public ns: NotesService) { }

  ngOnInit() {
  }

  openErrorDiag(){
    this.dialogIcon = "error-message";
    this.dialogMessage = "Please fill required fields";
    this.successDiag.open();
  }

  onOkSuccessDiag(){
    this.modalService.dismissAll();
    $('#noteModal #modalBtn').trigger('click');
  }

  onClickSave(){
    if (this.isEmptyObject(this.note.note)){
      this.openErrorDiag();
    } else {
       this.onYes.emit(this.note);
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

  formatDate(date) {
    var d = new Date(date);
    return  ("00" + (d.getMonth() + 1)).slice(-2) + "/" +("00" + d.getDate()).slice(-2)+ "/" + d.getFullYear()+ " "+("00" + d.getHours()).slice(-2) + ":" +("00" + d.getMinutes()).slice(-2) 
    +":" + ("00" + d.getSeconds()).slice(-2) 
  }

}
