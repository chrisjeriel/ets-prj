import { Directive, ElementRef, HostListener } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Directive({
  selector: '[appChangetheme]'
})
export class ChangethemeDirective {

  constructor(private el: ElementRef) { }

 @HostListener('document:click', ['$event'])
      clickout(event) {
        if(this.el.nativeElement.contains(event.target)) {
                      console.log("Click");
        } else {
                     console.log("Click"); 
        }
     }


}
