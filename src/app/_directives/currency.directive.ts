import { Directive, ElementRef, HostListener } from '@angular/core';
import { unHighlight, highlight} from './highlight';


@Directive({
  selector: '[appCurrency]'
})
export class CurrencyDirective {

  constructor(private el: ElementRef) {

  }

  @HostListener("blur", ["$event.target"]) onBlur(target) {
  	if(target.value !=''){
	  	let sNum = target.value.split('.');
	  	sNum[0] = sNum[0].replace(new RegExp(",", "g"),'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	  	sNum[1] = sNum[1] !== undefined ? sNum[1] : '00';
	  	target.value = sNum.join('.');
	    if(!/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(target.value)){
	    	highlight(this.el);
	    }else{
	    	unHighlight(this.el);
	    }
   }else{
	    	unHighlight(this.el);
    }
  }

  @HostListener("mouseenter", ["$event.target"]) onFocus(target,message) {
  	let x = parseInt(this.el.nativeElement.getBoundingClientRect()['x']);
  	let y = parseInt(this.el.nativeElement.getBoundingClientRect()['y']);
  	let width = parseInt(this.el.nativeElement.getBoundingClientRect()['width']);
  	let height = parseInt(this.el.nativeElement.getBoundingClientRect()['height']);
  	$('#cust-tooltip').css({left: x+(width/3)+'px', top: y-height-1+'px'});
  	$('#cust-tooltip').css({display:'block'});
  }

  @HostListener("mouseleave", ["$event.target"]) onLeave(target,message) {
  	let x = parseInt(this.el.nativeElement.getBoundingClientRect()['x']);
  	let y = parseInt(this.el.nativeElement.getBoundingClientRect()['y']);
  	let width = parseInt(this.el.nativeElement.getBoundingClientRect()['width']);
  	let height = parseInt(this.el.nativeElement.getBoundingClientRect()['height']);
  	$('#cust-tooltip').css({display:'none'});
  }

}
