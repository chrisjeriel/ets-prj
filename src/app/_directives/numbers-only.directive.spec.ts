import { NumbersOnlyDirective } from './numbers-only.directive';
import { ElementRef } from '@angular/core';

describe('NumbersOnlyDirective', () => {
  it('should create an instance', () => {
    let elRefMock = {
      nativeElement: document.createElement('div')
    };
    const directive = new NumbersOnlyDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
