import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-generate-cv-service',
  templateUrl: './generate-cv-service.component.html',
  styleUrls: ['./generate-cv-service.component.css']
})
export class GenerateCvServiceComponent implements OnInit {

  exitLink: string;
  exitTab: string;
  sub: any;

  constructor(private route: ActivatedRoute ,private router: Router,private titleService: Title) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.exitLink = params['link'] !== undefined ? params['link'] : 'adasdas';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';
    });

    this.titleService.setTitle("Acct-IT | Check Voucher");
  }

  onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
  		} 
  
  }
}
