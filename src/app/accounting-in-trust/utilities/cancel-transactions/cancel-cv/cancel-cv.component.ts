import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { AccountingService} from '@app/_services';

@Component({
  selector: 'app-cancel-cv',
  templateUrl: './cancel-cv.component.html',
  styleUrls: ['./cancel-cv.component.css']
})
export class CancelCvComponent implements OnInit {

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
