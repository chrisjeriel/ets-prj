import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pcv-entry',
  templateUrl: './pcv-entry.component.html',
  styleUrls: ['./pcv-entry.component.css']
})
export class PcvEntryComponent implements OnInit {
  @Input()
	record: any = {
	  pcvNo: null,
	  payee: null,
	  pcvType: null,
	  status: null,
	  pcvDate: null,
	  purpose: null,
	  curr: null,
	  amount: null,
	  repFlag: null
	}

  constructor() { }

  ngOnInit() {
  	console.log(this.record);
  }

}
