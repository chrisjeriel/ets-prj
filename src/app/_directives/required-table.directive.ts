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
      this.showTooltip(this.er,'required');
    }
 
    @HostListener("mouseleave") mouseLeave(){
      hideTooltip();
    }

    highlight(el: any){
	 	el.nativeElement.style.boxShadow = 'inset 0 0 0 1px #ff3333';
	}

	showTooltip(target:any,message:string) {
	  	if(target.nativeElement.style.boxShadow == "rgb(255, 51, 51) 0px 0px 0px 1px inset"){
		  	let x = parseInt(target.nativeElement.getBoundingClientRect()['right']);
		  	let y = parseInt(target.nativeElement.getBoundingClientRect()['y']);
		  	let theight = $('#cust-tooltip').outerHeight();
		  	let twidth = $('#cust-tooltip').outerWidth()/4;
		  	message = target.nativeElement.value == '' ? "Required field." : message;
		  	$('#cust-tooltip').html(message);

		  	$('#cust-tooltip').css({left: x-twidth+'px', top:y-theight+'px'});
		  	$('#cust-tooltip').css({display:'block'});
	  	}
  }
}
