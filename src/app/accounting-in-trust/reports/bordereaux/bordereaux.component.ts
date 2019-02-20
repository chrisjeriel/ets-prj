import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bordereaux',
  templateUrl: './bordereaux.component.html',
  styleUrls: ['./bordereaux.component.css']
})
export class BordereauxComponent implements OnInit {
  parameter:string = 'period';
  detail: string = 'outstanding';

  constructor() { }

  ngOnInit() {
  }

}
