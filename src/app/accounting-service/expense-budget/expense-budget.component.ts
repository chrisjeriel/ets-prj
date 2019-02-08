import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ExpenseBudget } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-expense-budget',
  templateUrl: './expense-budget.component.html',
  styleUrls: ['./expense-budget.component.css']
})
export class ExpenseBudgetComponent implements OnInit {  


  constructor(private titleService: Title,private router: Router,private accountingService: AccountingService,) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc-Srv | Expense Budget") ;
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('');
    }
  } 
}


