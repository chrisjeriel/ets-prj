import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-consolidate-annual-taxes-withheld',
  templateUrl: './consolidate-annual-taxes-withheld.component.html',
  styleUrls: ['./consolidate-annual-taxes-withheld.component.css']
})
export class ConsolidateAnnualTaxesWithheldComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('');
    }
  }
}
