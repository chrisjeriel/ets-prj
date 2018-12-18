import { Component, OnInit } from '@angular/core';
import { PolItem_MLP } from '@app/_models/PolItem';
import { UnderwritingService } from '@app/_services';


@Component({
  selector: 'app-pol-item',
  templateUrl: './pol-item.component.html',
  styleUrls: ['./pol-item.component.css']
})
export class PolItemComponent implements OnInit {

  constructor(private underwritingService: UnderwritingService) { }

  ngOnInit() {
  }

}
