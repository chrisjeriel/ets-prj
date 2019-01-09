import { Directive, ElementRef, HostListener } from '@angular/core';
import { unHighlight, highlight} from './highlight';

@Directive({
    selector: '[appRequired]'
})
export class RequiredDirective {

    constructor(private er: ElementRef) { 

    }
    // @HostListener('blur', ['$event.target.value']) onBlur(value){
    //     if(value === null || typeof value === 'undefined' || value == ''){
    //         highlight(this.er);
    //     }else{
    //         unHighlight(this.er);
    //     }
    // }
    
    // @HostListener('ngModelChange', ['$event']) onNgModelChange(value){
    //     if(value === null || typeof value === 'undefined' || value == ''){
    //         highlight(this.er);
    //     }else{
    //         unHighlight(this.er);
    //     }
    // }

}
