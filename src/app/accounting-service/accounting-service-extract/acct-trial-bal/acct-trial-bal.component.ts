import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-acct-trial-bal',
  templateUrl: './acct-trial-bal.component.html',
  styleUrls: ['./acct-trial-bal.component.css']
})
export class AcctTrialBalComponent implements OnInit {

   constructor(private router: Router) { }

  ngOnInit() {
  }

  accountCode: string = "Total";

  accCodeChange(data){
    this.accountCode = data;
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}
