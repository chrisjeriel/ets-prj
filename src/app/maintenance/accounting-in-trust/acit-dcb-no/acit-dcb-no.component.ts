import { Component, OnInit } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';

@Component({
  selector: 'app-acit-dcb-no',
  templateUrl: './acit-dcb-no.component.html',
  styleUrls: ['./acit-dcb-no.component.css']
})
export class AcitDcbNoComponent implements OnInit {
  
   passData: any = {
      tableData: [],
      tHeader: ['DCB Date','DCB Year', 'DCB No.', 'DCB Status','Remarks', 'Auto'],
      dataTypes: ['date','year', 'number', 'text','text', 'checkbox'],
      nData: {
        createUser : this.ns.getCurrentUser(),
        createDate : '',
        updateUser : this.ns.getCurrentUser(),
        updateDate : '',
      },
      searchFlag: true,
      infoFlag: true,
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      paginateFlag: true,
      pageLength: 10,
      pageID: 1,
      //uneditable: [true,true,true,true,true,true,true,true,true,true],
      widths: [60,70,390,115,75,110],
      keys: ['whtaxId', 'taxCd', 'taxName', 'taxType', 'rate', 'defaultAcitGl'],
  };

  params = {
    createUser:'',
    createDate:'',
    updateUser:'',
    updateDate:''
  }

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  }

}
