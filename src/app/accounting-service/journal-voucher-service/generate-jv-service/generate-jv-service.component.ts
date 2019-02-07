import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-generate-jv-service',
  templateUrl: './generate-jv-service.component.html',
  styleUrls: ['./generate-jv-service.component.css']
})
export class GenerateJvServiceComponent implements OnInit {

  constructor(private route: ActivatedRoute ,private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('journal-voucher-service');
    }
  }
}
