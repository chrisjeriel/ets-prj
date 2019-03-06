import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {

  @Input() editorContent: any = '';
  @Input() editorPlaceholder: any = null;
  @Input() edtrOpnrPos: number = 1;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
 
  @Output() fetchContent: EventEmitter<any> = new EventEmitter<any>();

  style: any = {
    height: '100%',
    width: '100%',
    font: '11px arial',
    padding: '5px 10px'
  };

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    if(this.readonly && !this.required) {
      this.style['background'] = '#f5f5f5';
    } else if(this.required && !this.readonly) {
      this.style['background'] = '#ffff4370';
    }

  }

  showTextEditorModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  closeTextEditorModal(event) {
  	this.fetchContent.next(this.editorContent);
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
}
