import { Directive, ElementRef, HostListener } from '@angular/core';
import { interceptingHandler } from '@angular/common/http/src/module';

@Directive({
  selector: '[numbers-only]'
})

export class NumbersOnlyDirective {
  strArr = [];

  inputElement: HTMLElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('blur', ['$event'])
  onblur(event) {
    var content = "";
    var newCont = "";
    var contentArr = [];
    var newContArr = [];
    content = (event.target.value).toString();
    contentArr = content.split("");

    content = this.remComParNeg(contentArr);
    contentArr = content.split("");

    for (var i = contentArr.length - 1; i >= 0; i--) {
      newContArr.push(contentArr[i]);
    }

    for (var j = newContArr.length - 1; j >= 0; j--) {
      if (j % 3 == 0) {
        if (j != 0) {
          newCont += (newContArr[j] + ",");
        } else {
          newCont += newContArr[j];
        }
      } else {
        newCont += newContArr[j];
      }
    }

    event.target.value = this.cvrtNeg(newCont);
  }

  @HostListener('focus', ['$event'])
  onfocus(event) {
    var content = "";
    content = (event.target.value).toString();
    event.target.value = this.addNegSign(content);

  }

  remComParNeg(strArr) {
    var newCont = "";
    for (var i = 0; i < strArr.length; i++) {
      if (strArr[i] == "," || strArr[i] == "(" || strArr[i] == ")") {
        newCont += "";
      } else {
        newCont += strArr[i];
      }
    }
    return newCont;
  }

  addNegSign(str) {
    if (str.substring(0, 1) === "(") {
      str = "-" + str.substring(1, str.length - 1);
      return str;
    } else {
      return str;
    }
  }

  cvrtNeg(str) {
    if (str.substring(0, 1) === "-") {
      str = "(" + str.replace("-", "") + ")";
      if (str.substring(1, 2) === ",") {
        str = str.replace(",", "");
      }
      return str;
    } else {
      return str;
    }
  }
  // @HostListener('keydown', ['$event'])
  // onkeydown(e: KeyboardEvent) {
  //   if(e.keyCode === 190 && e.keyCode === 1110){
  //     console.log("");
  //   }
  // }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 || // Allow: Delete, Backspace, Tab, Escape, Enter
      (e.keyCode === 65 && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.keyCode === 67 && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.keyCode === 86 && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.keyCode === 88 && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.keyCode === 65 && e.metaKey === true) || // Allow: Cmd+A (Mac)
      (e.keyCode === 67 && e.metaKey === true) || // Allow: Cmd+C (Mac)
      (e.keyCode === 86 && e.metaKey === true) || // Allow: Cmd+V (Mac)
      (e.keyCode === 88 && e.metaKey === true) || // Allow: Cmd+X (Mac)
      (e.keyCode === 190 && e.shiftKey === false) ||
      (e.keyCode === 109) ||
      (e.keyCode === 110) ||
      (e.keyCode === 188 && e.shiftKey === false) ||
      (e.keyCode === 189 && e.shiftKey === false) ||
      (e.keyCode >= 35 && e.keyCode <= 39) // Allow: Home, End, Left, Right

    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData
      .getData('text/plain')
      .replace(/\D/g, ''); // get a digit-only string
    document.execCommand('insertText', false, pastedInput);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text').replace(/\D/g, '');
    this.inputElement.focus();
    document.execCommand('insertText', false, textData);
  }
}
