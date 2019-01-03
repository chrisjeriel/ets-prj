import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  @Input() optionsData: any[] = [];
  @Output() optionsValues = new EventEmitter();

  itemSelected: string = "";


  selected() {
    this.optionsValues.emit({ item: this.itemSelected });
  }
  constructor() { }

  ngOnInit() {

  }
}


