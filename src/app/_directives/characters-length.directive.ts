import { Directive, ElementRef,Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appCharactersLength]'
})
export class CharactersLengthDirective {


 constructor(private el : ElementRef) { 
  	this.el.nativeElement.setAttribute('maxlength','3');
  	// el.nativeElement.style.backgroundColor = 'yellow';
  }

  @Input('appCharactersLength') test : string;

  @HostListener('input', ['$event']) onInputChange($event) {
   this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
  }
  
  
  private maxlength(max : string) {
    this.test = max;
    this.el.nativeElement.setAttribute('maxlength','3');
  }

}
