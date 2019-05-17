import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approver',
  templateUrl: './approver.component.html',
  styleUrls: ['./approver.component.css']
})
export class ApproverComponent implements OnInit {

  passData: any = {
    tableData:[],
    tHeader				      : ["Line Class Code", "Description", "Active","Remarks"],
    dataTypes			      : ["text", "text", "checkbox", "text"],
    genericBtn          : 'Delete',
    nData: {
      lineClassCd       : null,
      lineCdDesc        : null,
      activeTag         : null,
      remarks           : '',
      createUser        : null,
      createDate        : this.ns.toDateTimeString(0),
      updateUser        : null,
      updateDate        : this.ns.toDateTimeString(0)
    },
    addFlag				      : true,
    paginateFlag		    : true,
    infoFlag			      : true,
    pageLength			    : 10,
    resizable			      : [true, true, true, false],
    pageID				      : 'line-mtn-line',
    keys				        : ['lineClassCd', 'lineCdDesc', 'activeTag', 'remarks'],
    uneditable          : [false, false, false, false],
    widths              : [1, 'auto', 'auto', 'auto'],
    disableGeneric      : true,
    disableAdd          : true
  };

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,
              private modalService: NgbModal) { }

  ngOnInit() {
  }

}
