import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { unHighlight, highlight, hideTooltip, showTooltip} from './highlight';

@Directive({
    selector: '[appRequired]'
})
export class RequiredDirective implements OnInit{

    constructor(private er: ElementRef) { 

    }

    ngOnInit(){
      this.er.nativeElement.style.backgroundColor = "#ffff4370";
    }

    @HostListener('blur', ['$event.target.value']) onBlur(value){
        if(value === null || typeof value === 'undefined' || value == ''){
            highlight(this.er);
        }else{
            unHighlight(this.er);
        }
    }
    
    @HostListener('ngModelChange', ['$event']) onNgModelChange(value){
        if(value === null || typeof value === 'undefined' || value == ''){
            highlight(this.er);
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
