import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'negativeAmount'
})
export class NegativeAmountPipe implements PipeTransform {

  transform(value: any, args?: any): any {
  	if(value!=null && value.toString().indexOf('-') != -1)
  		value = "("+value.substring(1)+")";
  	//console.log(value);
    return value;
  }

}
