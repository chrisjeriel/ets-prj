import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-maint-chart-trst-acct',
  templateUrl: './maint-chart-trst-acct.component.html',
  styleUrls: ['./maint-chart-trst-acct.component.css']
})
export class MaintChartTrstAcctComponent implements OnInit {

  chartOfAccounts: any = {
    tableData: [
      {
        glAcctId: 1,
        glAcctCategoryDesc: 'Asset',
        glAcctCategory: 1,
        glAcctControl: 0,
        glAcctSub1: 0,
        glAcctSub2: 0,
        glAcctSub3: 0,
        shortDesc: 'ASSETS',
        longDesc: 'ASSETS',
        shortCode: '1',
        slTypeDesc: '',
        drCrTag: 'D',
        postTag: 'S',
        activeTag: 'Y'
      },
    ],
    tHeader: ['Acct ID','Type','Acct||Category','Control||Acct','Sub1','Sub2','Sub3','Short Description','Long Description','Short Code','SL Type','Dr/Cr||Normal','Post Tag','Active'],
    dataTypes: ['number','select','number','number','number','number','number','text','text','text','text','select','select','checkbox'],
    keys: ['glAcctId','glAcctCategory','glAcctCategory','glAcctControl','glAcctSub1','glAcctSub2','glAcctSub3','shortDesc','longDesc','shortCode','slTypeDesc','drCrTag','postTag','activeTag'],
    widths: ['1','auto','1','1','1','1','1','auto','auto','95','1','55','95','1'],
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    addFlag: true,
    searchFlag: true,
    opts: [{
      selector: 'glAcctCategory',
      prev: ['Asset','Liability','Equity'],
      vals: [1,2,3],
    },
    {
      selector: 'drCrTag',
      prev: ['Dr','Cr'],
      vals: ['D','C'],
    },
    {
      selector: 'postTag',
      prev: ['Summary','Detail'],
      vals: ['S','D'],
    }],
  };

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Mtn | Chart of Accounts");
  }

}
