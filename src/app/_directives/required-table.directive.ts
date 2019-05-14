import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { unHighlight, highlight, hideTooltip, showTooltip} from './highlight';

@Directive({
  selector: '[appRequiredTable]'
})
export class RequiredTableDirective {

  constructor(private er: ElementRef) {}


    @HostListener('blur', ['$event.target.value']) onBlur(value){
        if(value === null || typeof value === 'undefined' || value == ''){
            this.highlight(this.er);
        }else{
            unHighlight(this.er);
        }
    }
    

    @HostListener('ngModelChange', ['$event']) onNgModelChange(value){
        if(value === null || typeof value === 'undefined' || value == ''){
            this.highlight(this.er);
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

    highlight(el: any){
	 	el.nativeElement.style.boxShadow = '0px 2px 2px #ff3333';
	}
}
