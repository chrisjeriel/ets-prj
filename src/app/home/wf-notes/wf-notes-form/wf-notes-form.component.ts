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

  title: string = "";
  notes: string = "";
  userId: string = "";
  createdBy: string = "";
  dateCreated: string = "";
  updatedBy: string = "";
  lastUpdate: string = "";
  ViewMode: boolean = true;	
  disablebtnBool: boolean = true;
  noteInfo: any[] =[];
  dialogIcon:string  = "";
  dialogMessage:string  = "";

  constructor(config: NgbModalConfig,
     public modalService: NgbModal,private workFlowManagerService: WorkFlowManagerService, private ns: NotesService) { }

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
    if (this.isEmptyObject(this.notes)){
        this.openErrorDiag()
      } else {
         this.onYes.emit();
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



}
