import { Component, OnInit } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';

@Component({
  selector: 'app-generate-cv',
  templateUrl: './generate-cv.component.html',
  styleUrls: ['./generate-cv.component.css']
})
export class GenerateCvComponent implements OnInit {

  exitLink: string;
  exitTab: string;
  sub: any;

  passData: any = {
    tranId: ''
  };

  constructor(private route: ActivatedRoute ,private router: Router,private titleService: Title, private acctService : AccountingService,  private ns : NotesService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.exitLink = params['link'] !== undefined ? params['link'] :'check-voucher';
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
