import { Directive, ElementRef, HostListener, HostBinding, OnInit } from '@angular/core';
import { unHighlight, highlight, hideTooltip, showTooltip} from './highlight';
import { NgModel } from '@angular/forms';


@Directive({
  selector: '[appCurrency]'
})
export class CurrencyDirective implements OnInit{
  constructor(private el: ElementRef, private model: NgModel) {

  }

  ngOnInit(){
      this.el.nativeElement.style.textAlign = "right";
      this.model.valueChanges.subscribe(a=>{
        if(this.model.control.untouched){
          this.onBlur(this.el.nativeElement);
        }
      })
  }

  @HostListener("blur", ["$event.target"]) onBlur(target) {
    if(this.model.control.untouched){
      this.model.control.markAsPristine();
    }

  	if(target.value !='' && target.value != undefined){
	  	let sNum = target.value.split(/[.]/g);
	  	sNum[0] = sNum[0].replace(new RegExp(",", "g"),'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    if(!/^(?:[- (])?\d{1,3}(,\d{3})*(\.\d+)?(?:[)])?$/.test(sNum.join('.'))){
	    	highlight(this.el);
	    }else{
	    	unHighlight(this.el);
	    	sNum[1] = sNum[1] !== undefined ? sNum[1] : '00';
        sNum[1] = (sNum[1] + "00").substring(0,2);
	  		target.value = sNum.join('.');
	    }
      if(target.value == 'NaN'){
        target.value = '';
      }
   }else {
	    unHighlight(this.el);
    }

  }

  @HostListener("mouseenter") mouseEnter(){
  	showTooltip(this.el,"Invalid format.");
  }

  @HostListener("mouseleave") mouseLeave(){	
  	hideTooltip();
  }

  @HostListener("keydown", ["$event"]) onChange(event) {
  	let allowed:string[] = ['-','.',',','Tab','Backspace','ArrowDown','ArrowUp','ArrowLeft','ArrowRight'];
  	if(/\D/.test(event.key) && allowed.indexOf(event.key) == -1 && !event.ctrlKey){
  		// event.target.value = event.target.value.substring(0,event.target.value.length-1);
  		event.preventDefault();
  	}
  }
}
