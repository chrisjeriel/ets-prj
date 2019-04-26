import { Directive, ElementRef, HostListener, HostBinding, OnInit, Input } from '@angular/core';
import { unHighlight, highlight, hideTooltip, showTooltip} from './highlight';


@Directive({
  selector: '[appSequence]'
})
export class SequenceDirective {
  @Input('appSequence') params: string;
  constructor(private el: ElementRef) { 
  }


  @HostListener("blur", ["$event.target"]) onBlur(target) {
  	if(target.value !=''){
	  	target.value = this.pad(target.value,this.params);
    }

  }

  pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }




}
