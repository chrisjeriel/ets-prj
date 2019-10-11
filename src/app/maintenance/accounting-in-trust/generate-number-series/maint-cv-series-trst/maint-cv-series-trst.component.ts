import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maint-cv-series-trst',
  templateUrl: './maint-cv-series-trst.component.html',
  styleUrls: ['./maint-cv-series-trst.component.css']
})
export class MaintCvSeriesTrstComponent implements OnInit {
  
  passData: any = {
      tableData: [],
      tHeader: ['CV Year','CV No', 'Tran ID', 'Used','Created By', 'Date Created', 'Last Update By', 'Last Update'],
      dataTypes: ['number','text', 'number', 'checkbox','text','date', 'text', 'date'],
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 15,
      pageID: 1,
      uneditable: [true,true,true,true,true,true,true,true],
      keys: ['quarterEnding', 'quarterEnding', 'currCd', 'currRate', 'balanceAmt', 'localAmt','balanceAmt', 'localAmt'],
  }

  constructor() { }

  ngOnInit() {
  }

}
