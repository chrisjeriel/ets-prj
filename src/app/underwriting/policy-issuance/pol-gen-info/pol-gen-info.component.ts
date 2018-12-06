import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pol-gen-info',
  templateUrl: './pol-gen-info.component.html',
  styleUrls: ['./pol-gen-info.component.css']
})
export class PolGenInfoComponent implements OnInit {

  @Input() mode;

  constructor() { }

  ngOnInit() {
  }

}
