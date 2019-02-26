import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BatchOR } from '@app/_models';
import { AccountingService } from '@app/_services';
import { ActivatedRoute,Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-batch-or-printing',
  templateUrl: './batch-or-printing.component.html',
  styleUrls: ['./batch-or-printing.component.css']
})
export class BatchOrPrintingComponent implements OnInit {
  exitLink: string;
  exitTab: string;
  sub: any;

  PassData: any = {
  	tableData: this.accountingService.getBatchOR(),
  	tHeader: ['G', 'P', 'OR Date', 'OR', 'Number', 'Payor','Amount'],
  	dataTypes: ['checkbox', 'checkbox', 'date', 'number', 'text','text', 'currency'],
  	nData: new BatchOR(null,null,null,null,null,null,null),
  	searchFlag: true,
  	pageLength: 10,
    infoFlag: true,
    paginateFlag: true,
  	widths: [50,50,  100,100, 250, 'auto', 150]
  }

  constructor(private accountingService: AccountingService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  }
}
