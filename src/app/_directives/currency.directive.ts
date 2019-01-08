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

}
