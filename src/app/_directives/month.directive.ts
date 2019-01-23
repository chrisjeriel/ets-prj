import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { unHighlight, highlight} from './highlight';


@Directive({
  selector: '[appMonth]'
})
export class MonthDirective {

  constructor(private el: ElementRef) { }

  	@HostListener("blur", ["$event.target"]) onBlur(target) {
  	 	 if ( target.value == ' ' || target.value == 0 || target.value < 0 ) {
  	 	 	highlight(this.el);
  	 	 } else {
  	 	 	if (target.value.indexOf(".") != -1) {
  	 	 			highlight(this.el);
  	 	 	} else {
  	 	 		unHighlight(this.el);
  	 	 	}
  	 	 	
  	 	 }
  	}

  	@HostListener("keypress", ["$event.target"]) onkeypress(target) {
  		var input = target.value;
  	 	 if ( input.search(/^0/) != -1 || input.indexOf(".") != -1 ) {
  	 	 	  return false;
  	 	 }
  	}

}
