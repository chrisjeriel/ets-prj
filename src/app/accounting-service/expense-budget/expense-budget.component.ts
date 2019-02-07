import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-expense-budget',
  templateUrl: './expense-budget.component.html',
  styleUrls: ['./expense-budget.component.css']
})
export class ExpenseBudgetComponent implements OnInit {

 

  constructor(private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc-Srv | Expense Budget");  
  

}
