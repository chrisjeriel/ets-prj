import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '@app/_services';


@Component({
  selector: 'app-mon-end-data-chk',
  templateUrl: './mon-end-data-chk.component.html',
  styleUrls: ['./mon-end-data-chk.component.css']
})
export class MonEndDataChkComponent implements OnInit {
  
  passData: any = {
  	tHeader: ['Script No.', 'End of Month Checking Script', 'Solution'],
  	tableData: [],
  	dataTypes: ['sequence-3','text','text'],
  	checkFlag: true,
  	pageStatus: true,
    pagination: true,
    colSize:['60px','432px','432px'],
    keys: ['scriptNo', 'scriptDesc', 'solution']
  }

  constructor( private router: Router, private titleService: Title,private userService: UserService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Data Checking");
    this.userService.emitModuleId("ACIT062");
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }
}
