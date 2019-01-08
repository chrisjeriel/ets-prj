import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appRequired]'
})
export class RequiredDirective {

    constructor(private er: ElementRef) { 

    }
    @HostListener('blur', ['$event.target.value']) onBlur(value){
        if(value === null || typeof value === 'undefined' || value == ''){
            this.highlight('0 0 5px #ff3333');
        }else{
            this.highlight(null);
        }
    }
    
    @HostListener('ngModelChange', ['$event']) onNgModelChange(value){
        if(value === null || typeof value === 'undefined' || value == ''){
            this.highlight('0 0 5px #ff3333');
        }else{
            this.highlight(null);
        }
    }

    private highlight(color: string) {
        this.er.nativeElement.style.boxShadow = color;
        this.er.nativeElement.setAttribute('title', 'Required');
    }

}
