import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  accountCode: string = "Total Debits & Credits";

  accCodeChange(data){
    this.accountCode = data;
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}
