import { Component, OnInit } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserService } from '@app/_services';

@Component({
  selector: 'app-change-trans-stat-to-new',
  templateUrl: './change-trans-stat-to-new.component.html',
  styleUrls: ['./change-trans-stat-to-new.component.css']
})
export class ChangeTransStatToNewComponent implements OnInit {

  constructor( private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.emitModuleId("ACIT001");
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}
