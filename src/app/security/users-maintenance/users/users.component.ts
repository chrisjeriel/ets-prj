import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@app/_services';
import { UsersInfo } from '@app/_models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  PassData: any = {
    tableData: this.securityServices.getUsersInfo(),
    tHeader: ['User ID', 'User Name', 'User Group', 'Description','Active', 'Email','Remarks'],
    dataTypes: ['text', 'text', 'text','text', 'text', 'text','text'],
    nData: new UsersInfo(null,null,null,null,null,null,null),
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
