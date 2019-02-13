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

  exitLink: string;
  exitTab: string;
  sub: any;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.exitLink = params['link'] !== undefined ? params['link'] : 'journal-voucher-service';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
    }
  }
}
