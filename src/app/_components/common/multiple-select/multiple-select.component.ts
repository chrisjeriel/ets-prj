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

  returnData: any[] = [];
  uniqueArr: any[] = [];
  selectedDataId: any[] = [];

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
    this.multiSelectDataSelected.emit({ returnId: this.returnId, returnValue: this.returnValue });
  }

  selectAll(event) {
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

  // selectAll(event) {
  //   if (event.target.checked == true) {
  //     this.headerChecked = true;
  //     this.checkboxes = true;
  //     this.returnData = [];
  //     this.selectedDataId = [];
  //     for (var i = 0; i < this.msData.length; i++) {
  //       this.returnData.push(this.msData[i]);
  //       this.selectedDataId.push(i);
  //     }
  //     // for (var j = 0; j < this.selectedDataId.length; j++) {
  //     //   if (this.selectedDataId.length == 0) {
  //     //     this.selectedDataId.push(i);
  //     //     console.log('here');
  //     //   } else {
  //     //     console.log(this.selectedDataId[i]);
  //     //   }
  //     // }
  //     //this.msDataSelected.emit({ allSelectedData: this.returnData, ids: this.selectedDataId });
  //   } else {
  //     this.headerChecked = false;
  //     this.checkboxes = false;
  //     this.returnData = [];
  //     this.selectedDataId = [];
  //   }
  //   this.msDataSelected.emit({ allSelectedData: this.returnData, ids: this.removeDup(this.selectedDataId) });

  // }

  // dataSelected(event) {
  //   if (event.target.checked == true) {
  //     this.returnData.push(event.target.value);
  //     for (var i = 0; i < this.returnData.length; i++) {
  //       this.selectedDataId.push(i);
  //     }
  //   } else {
  //     // this.headerChecked = false;

  //     // for (var i = 0; i < this.returnData.length; i++) {
  //     //   if (this.returnData[i] == event.target.value) {
  //     //     this.returnData.splice(i, 1);
  //     //     // this.selectedDataId.splice(i, 1); WAIT!
  //     //   }
  //     // }
  //     // for(var i=0;i<this.selectedDataId.length;i++){

  //     // }
  //     console.log(event.target);

  //   }
  //   this.msDataSelected.emit({ allSelectedData: this.returnData, ids: this.removeDup(this.selectedDataId) });
  // }

  // removeDup(arr: any[]) {
  //   this.uniqueArr = [];
  //   for (var i = 0; i < arr.length; i++) {
  //     if (this.uniqueArr.indexOf(arr[i]) == -1) {
  //       this.uniqueArr.push(arr[i]);
  //     }
  //   }
  //   return this.uniqueArr;
  // }

}
