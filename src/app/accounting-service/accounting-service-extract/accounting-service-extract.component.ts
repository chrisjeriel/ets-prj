import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accounting-service-extract',
  templateUrl: './accounting-service-extract.component.html',
  styleUrls: ['./accounting-service-extract.component.css']
})
export class AccountingServiceExtractComponent implements OnInit {

  taxType: any;

  constructor(private router: Router,private route: ActivatedRoute) { }

  sub:any;
  activeID:any;
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.activeID = params['tabID'];
    });
  }

  tabController(taxType){
    this.taxType = taxType;
    console.log(this.taxType)
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}