import { Directive, ElementRef, HostListener } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Directive({
  selector: '[appChangetheme]'
})
export class ChangethemeDirective {
  theme =  window.localStorage.getItem("selectedTheme");
  constructor(private el: ElementRef,private app: AppComponent) { }
  	
	@HostListener("keyup", ["$event.target"]) onkeyup(target) {	
        console.log(target.value);
         if (target.value == "") {
         	 this.app.changeTheme(this.theme);
         }
        
	}

}
