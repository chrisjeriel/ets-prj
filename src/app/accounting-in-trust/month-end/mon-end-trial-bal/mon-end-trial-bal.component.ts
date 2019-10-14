import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NotesService, AccountingService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-mon-end-trial-bal',
  templateUrl: './mon-end-trial-bal.component.html',
  styleUrls: ['./mon-end-trial-bal.component.css']
})
export class MonEndTrialBalComponent implements OnInit {
  @ViewChild('eomTbMdl') eomTbMdl: ModalComponent;
  @ViewChild('printMdl') printMdl: ModalComponent;
  @ViewChild('eomTbDialog') eomTbDialog: SucessDialogComponent;

  tranDate: string = '';
  inclPrevMon: boolean = true;
  inclPrevYrs: boolean = true;
  adjEntsOnly: boolean = true;
  returnCode: number = null;
  dialogIcon: string = '';
  dialogMessage: string = '';
  showPrintDialog: boolean = false;
  printMethod: string = '1';

  constructor( private router: Router, private ns: NotesService, private as: AccountingService) { }

  ngOnInit() {
    //add validation
  }
  
  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }

  onClickGenerate(force?) {
    $('.globalLoading').css('display', 'block');

    var params = {
      force: force === undefined ? 'N' : 'Y',
      eomDate: this.tranDate,
      eomUser: this.ns.getCurrentUser(),
      includeMonth: this.inclPrevMon ? 'Y' : 'N',
      includeYear: this.inclPrevYrs ? 'Y' : 'N',
      aeTag: this.adjEntsOnly ? 'Y' : 'N'
    }

    this.as.saveAcitMonthEndTrialBal(params).subscribe(data => {
      $('.globalLoading').css('display', 'none');
      this.returnCode = data['returnCode'];
      if(this.returnCode == 1 || this.returnCode == 2) {
        this.showPrintDialog = false;
        this.eomTbMdl.openNoClose();
      } else if(this.returnCode == -1) {
        this.dialogIcon = 'success-message';
        this.dialogMessage = 'Successfully generated Trial Balance.'
        this.eomTbDialog.open();
      } else if(this.returnCode == 0) {
        this.showPrintDialog = false;
        this.dialogIcon = 'error-message';
        this.dialogMessage = 'Generation of Trial Balance failed.'
        this.eomTbDialog.open();
      }
    });
  }

  onClickPrint() {
    this.printMdl.openNoClose();
  }

}
