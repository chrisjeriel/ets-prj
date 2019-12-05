import { Component, OnInit } from '@angular/core';
import { NgbModal,NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-cancel-transactions-service',
  templateUrl: './cancel-transactions-service.component.html',
  styleUrls: ['./cancel-transactions-service.component.css']
})
export class CancelTransactionsServiceComponent implements OnInit {
  tranClass : string = '';

  constructor( private router: Router) { }

  ngOnInit() {
    this.tranClass = 'or';
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      }else if($event.nextId == 'or') {
        this.tranClass = 'or';
      }else if($event.nextId == 'cv') {
        this.tranClass = 'cv';
      }else if($event.nextId == 'jv') {
        this.tranClass = 'jv';
      }
  
  }
}
