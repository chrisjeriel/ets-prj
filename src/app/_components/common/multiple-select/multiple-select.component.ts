import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.css']
})
export class MultipleSelectComponent implements OnInit {

  @Input() msHeaderTxt: string = "";
  @Input() msData: any[] = [];
  @Output() msDataSelected = new EventEmitter();

  constructor() { }

  headerChecked: boolean = false;
  checkboxes: boolean = false;

  returnData: any[] = [];
  uniqueArr: any[] = [];
  selectedDataId: any[] = [];

  counter: number = 0;
  ngOnInit() {

  }


  selectAll(event) {
    if (event.target.checked == true) {
      this.headerChecked = true;
      this.checkboxes = true;
      this.returnData = [];
      this.selectedDataId = [];
      for (var i = 0; i < this.msData.length; i++) {
        this.selectedDataId.push(i);
        this.returnData.push(this.msData[i]);
      }
      //this.msDataSelected.emit({ allSelectedData: this.returnData, ids: this.selectedDataId });
    } else {
      this.headerChecked = false;
      this.checkboxes = false;
      this.returnData = [];
      this.selectedDataId = [];
    }
    this.msDataSelected.emit({ allSelectedData: this.returnData, ids: this.selectedDataId });

  }

  dataSelected(event) {
    if (event.target.checked == true) {
      this.returnData.push(event.target.value);
      for (var i = 0; i < this.returnData.length; i++) {
        this.selectedDataId.push(i);
      }
    } else {
      this.headerChecked = false;
      for (var i = 0; i < this.returnData.length; i++) {
        if (this.returnData[i] == event.target.value) {
          this.returnData.splice(i, 1);
          this.selectedDataId.splice(i, 1);
        }
      }

    }
    this.msDataSelected.emit({ allSelectedData: this.returnData, ids: this.removeDup(this.selectedDataId) });
  }

  removeDup(arr: any[]) {
    this.uniqueArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (this.uniqueArr.indexOf(arr[i]) == -1) {
        this.uniqueArr.push(arr[i]);
      }
    }
    return this.uniqueArr;
  }

}
