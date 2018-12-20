import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.css']
})
export class MultipleSelectComponent implements OnInit {

  @Input() multiSelectHeaderTxt: string = "";
  @Input() multiSelectData: any[] = [];
  @Output() multiSelectDataSelected = new EventEmitter();

  constructor() { }

  headerChecked: boolean = false;
  checkboxes: boolean = false;
  returnValueId: any[] = [];
  returnId: any[] = [];
  returnValue: any[] = [];

  ngOnInit() {
    for (var i = 0; i < this.multiSelectData.length; i++) {
      this.returnValueId.push({ id: i, value: this.multiSelectData[i] });
    }
  }

  dataSelected(event) {
    if (event.target.checked == true) {
      this.returnId.push(event.target.id);
      this.returnValue.push(event.target.value);
    } else {
      for (var i = 0; i < this.returnValue.length; i++) {
        if (this.returnValue[i] == event.target.value) {
          this.returnValue.splice(i, 1);
          this.returnId.splice(i, 1);
        }
      }
    }
    if (this.returnValue.length == this.returnValueId.length) {
      this.headerChecked = true;
    } else {
      this.headerChecked = false;
    }
    this.multiSelectDataSelected.emit({ returnId: this.returnId, returnValue: this.returnValue });
  }

  selectAll(event) {
    this.returnId = [];
    this.returnValue = [];
    for (var i = 0; i < this.returnValueId.length; i++) {
      if (event.target.checked == true) {
        this.headerChecked = true;
        this.checkboxes = true;
        this.returnId.push(i);
        this.returnValue.push(this.multiSelectData[i]);
      } else {
        this.headerChecked = false;
        this.checkboxes = false;
        this.returnId = [];
        this.returnValue = [];
      }
    }
    this.multiSelectDataSelected.emit({ returnId: this.returnId, returnValue: this.returnValue });
  }

}
