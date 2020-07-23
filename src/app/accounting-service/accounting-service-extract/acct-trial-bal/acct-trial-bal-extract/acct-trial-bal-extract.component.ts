import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, PrintService } from '@app/_services';
import { SucessDialogComponent, ModalComponent } from '@app/_components/common';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';

@Component({
  selector: 'app-acct-trial-bal-extract',
  templateUrl: './acct-trial-bal-extract.component.html',
  styleUrls: ['./acct-trial-bal-extract.component.css']
})
export class AcctTrialBalExtractComponent implements OnInit {
  
  constructor(private titleService: Title, private ns : NotesService, private ps: PrintService) { }



  @Output() accCodeChange : EventEmitter<any> = new EventEmitter();

  params: any = {
      reportId : 'ACSER009',
      reportName : 'ACSER009',
      type : 'T',
      periodFrom : '',
      periodTo : '',
      extractUser : this.ns.getCurrentUser(),
      extractDate : '',
      currCdParam: ''
    }

   loading: Boolean = false;

   modalHeader: string = "";
   modalBody: string = "";
   dialogIcon: string = "";
   dialogMessage: string = "";
   modalMode: string = "";

   @ViewChild('polReportsModal') polReportsModal: ModalComponent;
   @ViewChild('appDialog') appDialog: SucessDialogComponent;

   currencyDesc:String = '';
   @ViewChild(MtnCurrencyCodeComponent) currCdLov: MtnCurrencyCodeComponent;

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Trial Balance");
  }


  onClickExtract(forceExtract?){

    let param:any = JSON.parse(JSON.stringify(this.params));
    param.forceExtract = forceExtract != undefined ? 'Y' : 'N';
    this.loading = true;
    this.ps.extractReport({ reportId: param.reportId, acser009Params:param }).subscribe((data:any)=>{
        this.modalMode = "";
        this.loading = false;
        if (data.errorList.length > 0) {
          
          if (data.errorList[0].errorMessage.includes("parameters already exists.")) {
            this.modalMode = "reExtract";
            this.modalHeader = "Confirmation";
            this.polReportsModal.openNoClose();
          } else {
            this.dialogIcon = 'error';
            this.appDialog.open();
          }
          
        } else {
          if (data.params.extractCount != 0) {
            this.modalHeader = "Extraction Completed";
            this.modalBody = "Successfully extracted " + data.params.extractCount + " record/s.";
            this.polReportsModal.openNoClose();
          } else {
            this.modalHeader = "Extraction Completed";
            this.modalBody = "No record/s extracted.";
            this.polReportsModal.openNoClose();
          }
        }
        console.log(data)
    },
    (err) => {
      alert("Exception when calling services.");
    });
  }

  setCurrency(data){
    if(data != null){
      this.params.currCdParam = data.currencyCd;
      this.currencyDesc = data.description;
    }else{
      this.params.currCdParam = '';
      this.currencyDesc = '';
    }
    this.ns.lovLoader(data.ev, 0);
  }

  showCurrLOV(){
    this.currCdLov.modal.openNoClose();
  }

  checkCode(ev, field){
    this.ns.lovLoader(ev, 1);
    if(field == 'currCd') {
      this.currCdLov.checkCode(this.params.currCdParam, ev);
    }
  }

}
