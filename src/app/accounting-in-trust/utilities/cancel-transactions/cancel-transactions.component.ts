import { Component, OnInit } from '@angular/core';
import { NgbModal,NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '@app/_services';

@Component({
  selector: 'app-cancel-transactions',
  templateUrl: './cancel-transactions.component.html',
  styleUrls: ['./cancel-transactions.component.css']
})
export class CancelTransactionsComponent implements OnInit {
  tranClass : string = '';
 
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.tranClass = 'ar';
    this.userService.emitModuleId("ACIT052");

  }

  onTabChange($event: NgbTabChangeEvent) {
      if($event.nextId == 'Exit') {
        this.router.navigateByUrl('');
      }else if($event.nextId == 'ar') {
        this.tranClass = 'ar';
      }else if($event.nextId == 'cv') {
        this.tranClass = 'cv';
      }else if($event.nextId == 'jv') {
        this.tranClass = 'jv';
      }
  }
}