import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sequence'
})
export class SequencePipe implements PipeTransform {

  transform(value: string): any {
    if (value !== undefined && value !== null) {
      return value.toString().replace(new RegExp(',', 'g'), "");
    } else {
      return "";
    }
  }

}
