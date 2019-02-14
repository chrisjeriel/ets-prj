import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ar-register',
  templateUrl: './ar-register.component.html',
  styleUrls: ['./ar-register.component.css']
})
export class ArRegisterComponent implements OnInit {

  dateRadio: string = "1";
  desRadio: string = "1";

  constructor() { }

  ngOnInit() {
  }

}
