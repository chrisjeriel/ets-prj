import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ClaimsService, NotesService, UploadService } from '@app/_services';
import { AttachmentInfo } from '@app/_models/Attachment';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';


@Component({
  selector: 'app-claims-attachment',
  templateUrl: './claims-attachment.component.html',
  styleUrls: ['./claims-attachment.component.css']
})
export class ClaimsAttachmentComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('main') successDiag: SucessDialogComponent;

  passData: any = {
  	tableData:[],
  	tHeader:['File Name', 'Description', 'Actions'],
    nData : new AttachmentInfo(null,null),
  	widths:['auto','auto',71],
  	checkFlag:true,
  	addFlag:true,
  	deleteFlag:true,
  	infoFlag:true,
  	paginateFlag:true,
    selectFlag: false,
    editFlag: false,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 10,
    uneditable: [true,false,false],
    keys:['fileName','description']
  };

  claimNo: string = 'CAR-2020-00001';

  constructor(config: NgbDropdownConfig,
              private claimsService: ClaimsService, 
              private titleService: Title, 
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private ns : NotesService,
              private location: Location, 
              private router: Router,
              private upload: UploadService) { 
              config.placement = 'bottom-right';
              config.autoClose = false;
  }

  ngOnInit() {
    this.titleService.setTitle("Clm | Attachment");
    this.getAttachment();
  }

  getAttachment(){
    this.claimsService.getAttachment(null, this.claimNo)
      .subscribe(data => {
        console.log(data);
        /*this.quoteId = data['quotation'][0].quoteId;
        this.attachmentData =  data['quotation'][0].attachmentsList;
        this.passData.tableData = this.attachmentData;
        this.table.refreshTable();
        console.log(JSON.stringify(this.attachmentData) + " >>>> this.attachmentData");*/
      });
  }

}
