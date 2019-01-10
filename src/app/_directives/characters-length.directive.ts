import { Directive, ElementRef,Input, HostListener } from '@angular/core';
import { unHighlight, highlight} from './highlight';

@Directive({
  selector: '[appCharactersLength]'
})
export class CharactersLengthDirective {


 constructor(private el : ElementRef) { 
  	// el.nativeElement.style.backgroundColor = 'yellow';
  }

  @Input('appCharactersLength') charLength : string;

  @HostListener('input', ['$event']) onInputChange($event) {
   this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
  }
  
  @HostListener('focus', ['$event.target.value']) onfocus(value){
     this.el.nativeElement.setAttribute('maxlength',this.charLength);
     	

}

 @HostListener("blur", ["$event.target.value"]) onBlur(value) {
 	if (value != ''){
 		if(value.length != parseInt(this.charLength) && value != ''){
            highlight(this.el);
        }else{
            unHighlight(this.el);
        }
    }else if(!this.el.nativeElement.hasAttribute('appRequired')){
    	unHighlight(this.el);
    }else{
    	highlight(this.el);
    }
 }

}
