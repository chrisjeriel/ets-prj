import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maint-ar-series-trst',
  templateUrl: './maint-ar-series-trst.component.html',
  styleUrls: ['./maint-ar-series-trst.component.css']
})
export class MaintArSeriesTrstComponent implements OnInit {
  
  passData: any = {
      tableData: [],
      tHeader: ['AR No', 'Tran ID', 'Used','Created By', 'Date Created', 'Last Update By', 'Last Update'],
      dataTypes: ['text', 'number', 'checkbox','text','date', 'text', 'date'],
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 15,
      pageID: 1,
      uneditable: [true,true,true,true,true,true,true],
      keys: ['quarterEnding', 'currCd', 'currRate', 'balanceAmt', 'localAmt','balanceAmt', 'localAmt'],
  }

  constructor() { }

  ngOnInit() {
  }

}
