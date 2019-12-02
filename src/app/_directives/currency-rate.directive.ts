import { Directive, ElementRef, HostListener, HostBinding, OnInit, AfterViewInit } from '@angular/core';
import { unHighlight, highlight, hideTooltip, showTooltip} from './highlight';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appCurrencyRate]'
})

export class CurrencyRateDirective implements OnInit, AfterViewInit{

  constructor(private el: ElementRef,private model: NgModel) { }

    ngOnInit(){
      this.el.nativeElement.style.textAlign = "right"
    }

    ngAfterViewInit(){
      this.model.valueChanges.subscribe(a=>
      {
        if(!this.model.touched){
          this.onBlur(this.el.nativeElement);
          this.model.control.markAsPristine();
        }
      })
    }
  	
    @HostListener("blur", ["$event.target"]) onBlur(target) {
    	if(target.value !=''){
  	  	let sNum = target.value.split('.');
  	  	sNum[0] = sNum[0].replace(new RegExp(",", "g"),'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  	    if(!/^(?:[- (])?\d{1,3}(,\d{3})*(\.\d+)?(?:[)])?$/.test(sNum.join('.'))){
  	    	highlight(this.el);
  	    }else{
  	    	unHighlight(this.el);
  	    	sNum[1] = sNum[1] !== undefined ? sNum[1] : '000000';
          sNum[1] = (sNum[1] + "000000").substring(0,6);
  	  		target.value = sNum.join('.');
  	    }
        this.model.valueAccessor.writeValue(parseFloat(this.model.value).toFixed(6));
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
