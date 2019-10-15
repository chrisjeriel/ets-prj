import { Directive, Input, Output, EventEmitter, HostListener, HostBinding, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import {NgbModal,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Directive({
  selector: '[appCheckForm]'
})
export class CheckFormDirective{
  @Input('appCheckForm') form: FormGroup;
  @Input('data') data: String ;
  pastData:any = '';
  @Output() output:EventEmitter<any> = new EventEmitter<any>();
  tagName:String = '';


  constructor(private modalService:NgbModal, private el: ElementRef, private renderer:Renderer2) {
    this.tagName = this.el.nativeElement.tagName
    this.renderer.addClass(this.el.nativeElement,'text-uppercase');
  }

  @HostListener("focus", ["$event.target"]) onFocus(target) {
  	this.pastData = target.value.toString();
  }

  @HostListener("blur", ["$event"]) onBlur(event) {
  	if(this.form.dirty){
  		let subject:Subject<Boolean> = new Subject<Boolean>();
        let modal:NgbModalRef = this.modalService.open(ConfirmLeaveComponent,{
            centered: true, 
            backdrop: 'static', 
            windowClass : 'modal-size'
        });
        modal.componentInstance.subject = subject;

        subject.subscribe(a=>{
        	if(a){
        		this.output.emit(event); 		
        	}else{
        		event.target.value = this.pastData;
        	}
        });
    }else if(event.target.value.toString().toUpperCase() != this.pastData.toUpperCase()){
    	this.output.emit(event); 
    }
  }

   @HostListener("click", ["$event"]) onClick(event) {
     if(this.tagName == 'DIV' && this.form.dirty){
       let subject:Subject<Boolean> = new Subject<Boolean>();
        let modal:NgbModalRef = this.modalService.open(ConfirmLeaveComponent,{
            centered: true, 
            backdrop: 'static', 
            windowClass : 'modal-size'
        });
        modal.componentInstance.subject = subject;

        subject.subscribe(a=>{
          if(a){
            this.output.emit(event);     
          }
        });
     }else{
       this.output.emit(event);
     }
   }
}
