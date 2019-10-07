import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, NotesService } from '@app/_services';

@Component({
  selector: 'app-mon-end-batch',
  templateUrl: './mon-end-batch.component.html',
  styleUrls: ['./mon-end-batch.component.css']
})
export class MonEndBatchComponent implements OnInit {

  eomDate: string = '';
  extLog: string = '';

  constructor( private router: Router, private as: AccountingService, private ns: NotesService) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }

  onClickGenerate() {
    var param = {
      eomDate: this.eomDate,
      eomUser: this.ns.getCurrentUser()
    }

    this.extLog = '';

    this.as.saveAcitMonthEndBatchProd(param).subscribe(data => {
      if(data['returnCode'] == -1) {
        this.extLog = 'Initializing . . . \nClosing Valid Transaction . . . \nInward Production Processing . . . \nDistributing Inward Production . . . \nFunds Held Extraction . . . \nComputing Interest on Overdue Accounts \nFinished . . .'
      } else {
        this.extLog = 'Initializing . . . \n' + data['errorList'][0].errorMessage;
      }
    });
  }

}
