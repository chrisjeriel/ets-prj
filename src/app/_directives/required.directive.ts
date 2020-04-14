import { Directive, ElementRef, HostListener, OnInit, Input, Renderer2 } from '@angular/core';
import { unHighlight, highlight, hideTooltip, showTooltip} from './highlight';

@Directive({
    selector: '[appRequired]'
})
export class RequiredDirective implements OnInit{

    // @Input() appRequired: boolean = true;

    @Input()
      set appRequired(value: boolean) {
          this.appReq = value;
          this.ngOnInit();
      }

    appReq : Boolean = true;


    constructor(private er: ElementRef, private renderer: Renderer2) { 

    }
    
    ngOnInit(){
      if(this.appReq || this.appReq == undefined || this.appReq.toString().length == 0){
        this.renderer.addClass(this.er.nativeElement, 'required-directive');
      }else{
        this.renderer.removeClass(this.er.nativeElement, 'required-directive');
        unHighlight(this.er);
      }
    }

    @HostListener('blur', ['$event.target']) onBlur(value){
      if(this.appReq){
        if(value.value === null || typeof value.value === 'undefined' || value.value == ''){
          if(!value.disabled && !value.readOnly) {
            highlight(this.er);
          }
        }else{
            unHighlight(this.er);
        }
      }else{
        unHighlight(this.er);
      }

    }
    

    @HostListener('ngModelChange', ['$event']) onNgModelChange(value){
      if(this.appReq){
        if(value === null || typeof value === 'undefined' || value == ''){
            highlight(this.er);
        }else{
            unHighlight(this.er);
        }
      }else{
        unHighlight(this.er);
      }
    }

    @HostListener("mouseenter") mouseEnter(){
      showTooltip(this.er,'required');
  }

  @HostListener("mouseleave") mouseLeave(){
      hideTooltip();
  }

}
