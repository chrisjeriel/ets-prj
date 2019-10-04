import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgForm } from '@angular/forms';
import { NotesService } from '@app/_services/notes.service';


@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('edtrMdl') edtrMdl: ModalComponent;
  @ViewChild('edtrMdlForm') edtrMdlForm:  NgForm;
  @ViewChild('edtrPrevForm') edtrPrevForm:  NgForm;

  @Input() editorContent: any = '';
  @Input() editorPlaceholder: any = null;
  @Input() edtrOpnrPos: number = 1;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() table: boolean = false;
  @Input() editablePrev: boolean = true;
  @Input() formName: string = 'te' + (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
 
  @Output() fetchContent: EventEmitter<any> = new EventEmitter<any>();

  style: any = {
    height: '100%',
    width: '100%',
    font: '11px arial',
    padding: '5px 10px',
    color: 'black'
  };

  oldValue: any = '';
  modalRef: NgbModalRef;

  constructor(private modalService: NgbModal, private ns: NotesService) { }

  ngOnInit() {
    if(this.table){
      this.style['border'] = '0';
    }

    if(this.readonly && !this.required && !this.table) {
      this.style['background'] = '#f5f5f5';
    } else if(this.required && !this.readonly && !this.table) {
      this.style['background'] = '#fffacd85';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.readonly && changes.required) {
      if(this.readonly && !this.required) {
        this.style['background'] = '#f5f5f5';
      } else if(this.required && !this.readonly) {
        this.style['background'] = '#fffacd85';
      }
    }
  }

  ngAfterViewInit() {
    if(!this.table) {
      this.ns.formGroup.addControl(this.formName, this.edtrPrevForm.form);
    }
  }

  showTextEditorModal(content) {
    this.oldValue = this.editorContent;
    this.edtrMdl.openNoClose();
  }

  closeTextEditorModal(event) {
  	this.emitValue();
  	this.modalService.dismissAll();
    this.edtrMdlForm.form.markAsPristine();

    if(this.oldValue !== this.editorContent) {
      this.ns.formGroup.get(this.formName).markAsDirty();
    }
  }

  checkStyle() {
    if(this.required && this.editorContent.trim() === ''){
      this.style['boxShadow'] = '0 0 5px #ff3333';  
    } else {
      this.style['boxShadow'] = null;
    }

    return this.style;
  }

  onClickCancel(confirm) {
    setTimeout(() => {
      if(this.edtrMdlForm.dirty) {  
        this.modalRef = this.modalService.open(confirm, { centered: true, backdrop: 'static', windowClass: "modal-size" });
      } else {
        this.modalService.dismissAll();
      }
    }, 0);
  }

  onClickYes() {
    this.editorContent = this.oldValue;
    this.closeTextEditorModal(1);
  }

  onClickNo() {
    this.modalRef.close();
  }

  emitValue(blurEv?) {
    this.fetchContent.next(blurEv === undefined ? this.editorContent : blurEv.range == null && this.editorContent != null ? this.editorContent.trim() : this.editorContent);
  }
}
