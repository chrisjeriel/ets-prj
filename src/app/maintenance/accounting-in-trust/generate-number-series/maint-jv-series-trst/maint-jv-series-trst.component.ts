import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maint-jv-series-trst',
  templateUrl: './maint-jv-series-trst.component.html',
  styleUrls: ['./maint-jv-series-trst.component.css']
})
export class MaintJvSeriesTrstComponent implements OnInit {
  
  passData: any = {
      tableData: [],
      tHeader: ['JV Year','JV No', 'Tran ID', 'Used','Created By', 'Date Created', 'Last Update By', 'Last Update'],
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
