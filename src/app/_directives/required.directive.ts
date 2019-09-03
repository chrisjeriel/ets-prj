import { Directive, ElementRef, HostListener, OnInit, Input } from '@angular/core';
import { unHighlight, highlight, hideTooltip, showTooltip} from './highlight';

@Directive({
    selector: '[appRequired]'
})
export class RequiredDirective implements OnInit{

    @Input() appRequired: boolean = true;

    constructor(private er: ElementRef) { 

    }
    
    ngOnInit(){
      if(this.appRequired){
        this.er.nativeElement.style.backgroundColor = "#fffacd85";
      }
    }

    @HostListener('blur', ['$event.target.value']) onBlur(value){
        if(value === null || typeof value === 'undefined' || value == ''){
            highlight(this.er);
        }else{
            unHighlight(this.er);
        }
    }
    

    @HostListener('ngModelChange', ['$event']) onNgModelChange(value){
        if(value === null || typeof value === 'undefined' || value == ''){
            highlight(this.er);
        }else{
            unHighlight(this.er);
        }
    }

    @HostListener("mouseenter") mouseEnter(){
      showTooltip(this.er,'required');
  }

  @HostListener("mouseleave") mouseLeave(){
      hideTooltip();
  }

}
