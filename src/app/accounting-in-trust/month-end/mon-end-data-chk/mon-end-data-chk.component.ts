import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mon-end-data-chk',
  templateUrl: './mon-end-data-chk.component.html',
  styleUrls: ['./mon-end-data-chk.component.css']
})
export class MonEndDataChkComponent implements OnInit {
  
  passData: any = {
  	tHeader: ['Script No.', 'End of Month Checking Script', 'Solution'],
  	tableData: [
  		[1,'Undistributed Policies','Distribute'],
  		[2,'Policies with Incorrect Distribution','Check... Then...'],
  		[3,'Policies with Perils','Check... Then...'],
  		[4,'Policies with no Peril Distribution','Check... Then...'],
  		[5,'Incorrect Peril Distribution','Check... Then...'],
  		[6,'Claim Payment with no Distribution','Check... Then...'],
  		[7,'Claim Payment with Incorrect Distribution','Check... Then...'],
  		[8,'Incorrect percent share percentage','Check... Then...'],
  		[9,'Incorrect Commission','Check... Then...'],
  		[10,'Tagged for Cancellation','Check... Then...'],
  	],
  	dataTypes: ['sequence-3','text','text'],
  	checkFlag: true,
  	pageStatus: true,
    pagination: true,
    colSize:['60px','432px','432px']



  }

  constructor( private router: Router) { }

  ngOnInit() {

  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }
}