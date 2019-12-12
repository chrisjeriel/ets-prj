import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ExpenseBudget } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-expense-budget',
  templateUrl: './expense-budget.component.html',
  styleUrls: ['./expense-budget.component.css']
})
export class ExpenseBudgetComponent implements OnInit {  

  @ViewChild(NgbTabset) tabset: any;


  constructor(private titleService: Title,private router: Router,private accountingService: AccountingService, private modalService: NgbModal) { }

  ngOnInit() {
  	/*this.titleService.setTitle("Acc-Srv | Expense Budget") ;*/
  }

  onTabChange($event: NgbTabChangeEvent) {
    /*if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('');
    }*/
    if ($event.nextId === 'Exit' && $('.ng-dirty.ng-touched:not([type="search"]):not(.exclude)').length == 0) {
         this.router.navigateByUrl('');
        }

        if($('.ng-dirty.ng-touched:not([type="search"]):not(.exclude)').length != 0){
          console.log('here 3');
          $event.preventDefault();
          const subject = new Subject<boolean>();
          const modal = this.modalService.open(ConfirmLeaveComponent,{
              centered: true, 
              backdrop: 'static', 
              windowClass : 'modal-size'
          });
          modal.componentInstance.subject = subject;

          subject.subscribe(a=>{
            if(a){
              console.log('here 4');
              $('.ng-dirty').removeClass('ng-dirty');
              this.tabset.select($event.nextId);
            }
          })
        
        }
  } 
}


