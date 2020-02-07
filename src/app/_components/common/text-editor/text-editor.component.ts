import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgForm } from '@angular/forms';
import { NotesService } from '@app/_services/notes.service';
import { QuillEditorComponent } from 'ngx-quill';
import * as Quill from 'quill';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('edtrMdl') edtrMdl: ModalComponent;
  @ViewChild('edtrMdlForm') edtrMdlForm:  NgForm;
  @ViewChild('edtrPrevForm') edtrPrevForm:  NgForm;
  @ViewChild('frontEditor') frontEditor: QuillEditorComponent;
  @ViewChild('modalEditor') modalEditor: QuillEditorComponent;

  @Input() editorContent: any = '';
  @Input() editorPlaceholder: any = null;
  @Input() edtrOpnrPos: number = 1;
  @Input() readonly:  boolean = false;
  @Input() required: boolean = false;
  @Input() table: boolean = false;
  @Input() editablePrev: boolean = true;
  @Input() formName: string = 'te' + (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
  @Input() format: string = 'text';
 
  @Output() fetchContent: EventEmitter<any> = new EventEmitter<any>();

  style: any = {
    height: '100%',
    width: '100%',
    font: '10px arial',
    padding: '5px 10px',
    color: 'black'
  };

  modalRef: NgbModalRef;

  afterInit: boolean = false;
  editorContentMdl: any = '';

  bold: any = null;
  italic: any = null;

  constructor(private modalService: NgbModal, private ns: NotesService, private renderer: Renderer2) { }

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
    if(changes.readonly && this.renderer != undefined && this.afterInit) {
      this.renderer.setStyle(this.frontEditor.editorElem, 'backgroundColor', changes.readonly.currentValue ? '#f5f5f5' : this.required ? '#fffacd85' : '#ffffff');
    }

    if(changes.editorContent && changes.editorContent.currentValue) {
      this.editorContent = changes.editorContent.currentValue;
    }
  }

  ngAfterViewInit() {
    $('.ql-editor').attr("tabindex","-1");
    if(!this.table) {
      this.ns.formGroup.addControl(this.formName, this.edtrPrevForm.form);
    }
    this.afterInit = true;

    if(this.format == 'html') {
      this.bold = Quill.import('formats/bold');
      this.bold.tagName = 'b';
      Quill.register(this.bold, true);

      this.italic = Quill.import('formats/italic');
      this.italic.tagName = 'i';
      Quill.register(this.italic, true);
    }
    
  }

  showTextEditorModal(content) {
    this.editorContentMdl = this.editorContent;
    this.edtrMdl.openNoClose();
  }

  closeTextEditorModal(event) {
    if(this.editorContent !== this.editorContentMdl && !this.table) {
      this.ns.formGroup.get(this.formName).markAsDirty();
    }

    this.editorContent = this.editorContentMdl;
    this.emitValue();
    this.edtrMdlForm.form.markAsPristine();
    this.modalService.dismissAll();
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
    this.edtrMdlForm.form.markAsPristine();
    this.modalService.dismissAll();
  }

  onClickNo() {
    this.modalRef.close();
  }

  emitValue(blurEv?) {
    // this.editorContent = this.editorContent != null ? this.editorContent.trim() : '';
    this.fetchContent.next(blurEv === undefined ? this.editorContent : blurEv.range == null && this.editorContent != null ? this.editorContent.trim() : this.editorContent);
  }

  /*onBlur(ev) {
    console.log(ev);
    console.log('here <><><><><>');
  }*/
}
