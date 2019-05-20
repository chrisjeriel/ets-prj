import { Component, OnInit, ViewChild } from '@angular/core';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-user-amt-limit',
  templateUrl: './user-amt-limit.component.html',
  styleUrls: ['./user-amt-limit.component.css']
})
export class UserAmtLimitComponent implements OnInit {
  @ViewChild(LovComponent) lov: LovComponent;
  passLov: any = {
  	selector: 'userGrp'
  }
  constructor() { }

  ngOnInit() {

  }

}
