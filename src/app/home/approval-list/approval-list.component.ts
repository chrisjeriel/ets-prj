import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkFlowManagerService, AuthenticationService, QuotationService, NotesService } from '@app/_services';
import { User } from '@app/_models';
import { Router } from '@angular/router';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

interface Module {
  referenceId: string;
  module: string;
  details: string;
  assignedBy: string;
  assignedDate: string;
}

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css']
})
export class ApprovalListComponent implements OnInit {
  constructor(private workFlowManagerService: WorkFlowManagerService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private quotationService: QuotationService,
              private ns : NotesService) {}

  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('warningConfirmation') warningConfirmation: ModalComponent;

  currentUser: User;
  approvalList: Module[] = [];
  selectedData:any;
  page = 1;
  pageSize = 2;
  collectionSize:any;
  currentUserId: string = JSON.parse(window.localStorage.currentUser).username;
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  confirmationMessage:string = "Are you sure you want to Approve Record?";
  confirmMethod:string = "approve";
  

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.retrieveWfmApprovals();

    $(document).ready(function(){
        $('.app-active-table').on('contextmenu', function(e) {
          var parentOffset = $(this).parent().offset(); 
         //or $(this).offset(); if you really just want the current element's offset
         var relX = e.pageX - parentOffset.left;
         var relY = e.pageY - parentOffset.top;
          $("#context-menu").css({
            display: "block",
            top: (relY + 35),
            left: (relX + 17)
          }).addClass("show");
          return false; //blocks default Webbrowser right click menu
        }).on("click", function() {
          $("#context-menu").removeClass("show").hide();
        });

        $("#context-menu a").on("click", function() {
          $(this).parent().removeClass("show").hide();
        });
    });
  }

  retrieveWfmApprovals() {
      while(this.approvalList.length>0){
          this.approvalList.pop();
      }


      this.workFlowManagerService.retrieveWfmApprovals(this.currentUser.username).subscribe((data)=>{
          if (data["approvalList"].length > 0) {
            this.collectionSize = data["approvalList"].length;

            for (var i = data["approvalList"].length - 1; i >= 0; i--) {
              this.approvalList.push({'referenceId' : data["approvalList"][i].referenceId,
                                          'module' : data["approvalList"][i].module,
                                          'details' : data["approvalList"][i].quotationNo,
                                          // 'assignedBy' : data["approvalList"][i].preparedBy,
                                          // 'assignedDate' : data["approvalList"][i].createDate
                                          'assignedBy' : data["approvalList"][i].assignedBy,
                                          'assignedDate' : this.ns.toDateTimeString(data["approvalList"][i].assignedDate)
                                        });
            }
          }
      });

      this.selectedData = null;
  }

  redirectToQuoteGenInfo() {
    var line = this.selectedData["details"].split("-")[0];

    this.quotationService.toGenInfo = [];
    this.quotationService.toGenInfo.push("edit", line);
    this.quotationService.savingType = 'normal';

    
    setTimeout(() => {
        this.router.navigate(['/quotation', { line: line,  quotationNo : this.selectedData["details"], quoteId: this.selectedData["referenceId"], from: 'quo-processing'}], { skipLocationChange: true });
    },100); 
  }

  onRowClick(event, mod) {
    console.log("Click Event: " + JSON.stringify(event));
    console.log("Click Mod: " + JSON.stringify(mod));
    this.selectedData = mod;
  }

  onRightClick(event, mod) {
    console.log("Click Event: " + JSON.stringify(event));
    console.log("Click Mod: " + JSON.stringify(mod));
    this.selectedData = mod;
  }

  approveRecord() {
    this.quotationService.updateQuoteStatus(this.selectedData.referenceId, 'A', this.currentUserId).subscribe((data)=>{
            if(data['returnCode'] == 0) {
              this.dialogIcon = "error-message";
              this.dialogMessage = "Status failed for Approval";
              this.successDiag.open();
            } else {
              this.dialogMessage = this.selectedData.module + " : " + this.selectedData.details + " " + "has been approved.";
              this.dialogIcon = "success-message";
              this.successDiag.open();
            }
            this.retrieveWfmApprovals();
    });
  }

  rejectRecord() {
    this.quotationService.updateQuoteStatus(this.selectedData.referenceId, 'R', this.currentUserId).subscribe((data)=>{
            if(data['returnCode'] == 0) {
              this.dialogIcon = "error-message";
              this.dialogMessage = "Status failed for Rejection";
              this.successDiag.open();
            } else {
              this.dialogMessage = this.selectedData.module + " : " + this.selectedData.details + " " + "has been rejected.";
              this.dialogIcon = "success-message";
              this.successDiag.open();
            }
            this.retrieveWfmApprovals();
    });
  }

  onClickConfirm(method) {
    this.confirmMethod = method;
    
    if (method == 'approve') {
      this.confirmationMessage = 'Are you sure you want to Approve Record?';
    } else if (method == 'reject') {
      this.confirmationMessage = 'Are you sure you want to Reject Record?';
    }

    setTimeout(() => {
        this.warningConfirmation.openNoClose();
    },100); 
  }

}



