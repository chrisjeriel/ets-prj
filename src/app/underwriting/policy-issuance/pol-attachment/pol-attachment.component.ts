import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PolAttachmentInfo } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { UnderwritingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-pol-attachment',
    templateUrl: './pol-attachment.component.html',
    styleUrls: ['./pol-attachment.component.css'],
    providers: [NgbDropdownConfig]
})
export class PolAttachmentComponent implements OnInit {

    @Input() alterationFlag: true;

    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    
    attachmentData: any = {
        tableData: [],
        tHeader: ['File Name', 'Description', 'Actions'],
        dataTypes: ['string', 'string', 'Actions'],
        nData: new PolAttachmentInfo(null, null),
        checkFlag: true,
        addFlag: true,
        deleteFlag: true,
        searchFlag: true,
        infoFlag: true,
        paginateFlag: true,
        pageLength: 10,
        keys: ['fileName', 'description'],
        widths: ['auto', 'auto', 1]
    }

    savedData: any[];
    deletedData: any[];

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title, private notes: NotesService) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Attachment");
        this.retrievePolAttachment();
    }

    retrievePolAttachment(){
        this.underwritingService.getPolAttachment('8','CAR-2019-1-001-1-1').subscribe((data: any) =>{
            console.log(data);
            if(data.polAttachmentList !== null){
                for(var i of data.polAttachmentList.attachments){
                    this.attachmentData.tableData.push(i);
                }
                this.table.refreshTable();
            }
        });
    }

    cancelFlag: boolean;
    dialogMessage: string = "";
    dialogIcon: string = "";

    saveData(cancelFlag?){

        this.cancelFlag = cancelFlag !== undefined;  

        this.savedData = [];
        this.deletedData = [];
        for (var i = 0 ; this.attachmentData.tableData.length > i; i++) {
          if(this.attachmentData.tableData[i].edited && !this.attachmentData.tableData[i].deleted){
              this.savedData.push(this.attachmentData.tableData[i]);
              this.savedData[this.savedData.length-1].createDate = this.notes.toDateTimeString(0);
              this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
              this.savedData[this.savedData.length-1].updateDate = this.notes.toDateTimeString(0);
              this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
          }
          else if(this.attachmentData.tableData[i].edited && this.attachmentData.tableData[i].deleted){
             this.deletedData.push(this.attachmentData.tableData[i]);
             this.deletedData[this.deletedData.length-1].createDate = this.notes.toDateTimeString(0);
             this.deletedData[this.deletedData.length-1].updateDate = this.notes.toDateTimeString(0);
          }

        }
        this.underwritingService.savePolAttachment(8,this.savedData,this.deletedData).subscribe((data: any) => {
          console.log(data);
          if(data.returnCode === 0){
              this.dialogMessage="The system has encountered an unspecified error.";
              this.dialogIcon = "error";
              $('#polAttachment > #successModalBtn').trigger('click');
          }else{
              this.dialogMessage="";
              this.dialogIcon = "";
              $('#genInfo > #successModalBtn').trigger('click');
              this.table.refreshTable();
          }
        });
    }

    cancel(){
        this.cancelBtn.clickCancel();
    }

    onClickSave(){
       $('#confirm-save #modalBtn2').trigger('click');
    }

}
