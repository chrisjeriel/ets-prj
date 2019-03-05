import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@app/_services';
import { UserGroups } from '@app/_models';

@Component({
  selector: 'app-user-groups-maintenance',
  templateUrl: './user-groups-maintenance.component.html',
  styleUrls: ['./user-groups-maintenance.component.css']
})
export class UserGroupsMaintenanceComponent implements OnInit {
  
  PassData: any = {
    tableData: this.securityServices.getUsersGroup(),
    tHeader: ['User Group', 'Description','Remarks'],
    dataTypes: ['text', 'text', 'text'],
    nData: new UserGroups(null,null,null),
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    pageLength:10,
    magnifyingGlass:['userGroup'],
    searchFlag: true,
    widths: [],
  }

  constructor(private securityServices: SecurityService) { }

  ngOnInit() {
  }

}
