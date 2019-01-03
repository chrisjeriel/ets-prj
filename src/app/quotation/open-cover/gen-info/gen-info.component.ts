import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gen-info',
  templateUrl: './gen-info.component.html',
  styleUrls: ['./gen-info.component.css']
})
export class GenInfoComponent implements OnInit {

  quotationNum: any[] = [];
  
  constructor() { }

  ngOnInit() {
  }

}
