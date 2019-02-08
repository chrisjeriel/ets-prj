import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ExpenseBudget } from '@app/_models';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-expense-budget',
  templateUrl: './expense-budget.component.html',
  styleUrls: ['./expense-budget.component.css']
})
export class ExpenseBudgetComponent implements OnInit {  

  constructor(private accountingService: AccountingService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acc-Srv | Expense Budget");  
  }

}
