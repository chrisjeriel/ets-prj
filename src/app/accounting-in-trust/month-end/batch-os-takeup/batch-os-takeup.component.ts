import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-batch-os-takeup',
  templateUrl: './batch-os-takeup.component.html',
  styleUrls: ['./batch-os-takeup.component.css']
})
export class BatchOsTakeupComponent implements OnInit {
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;

  eomDate: string = '';
  dialogMsg: string = '';
  dialogIcon: string = '';

  constructor( private router: Router, private as: AccountingService, private ns: NotesService) { }

  ngOnInit() {
  }
  
  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }

  onClickBookOS() {
    var param = {
      eomDate: this.eomDate,
      eomUser: this.ns.getCurrentUser()
    }

    this.as.saveAcitMonthEndBatchOS(param).subscribe(data => {
      if(data['returnCode'] == -1) {
        this.dialogIcon = 'success';
        this.successDialog.open();
      } else {
        this.dialogIcon = 'error-message';
        this.dialogMsg = data['errorList'][0].errorMessage;
        this.successDialog.open();
      }
    });
  }
}
