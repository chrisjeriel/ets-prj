import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-loss-code',
  templateUrl: './loss-code.component.html',
  styleUrls: ['./loss-code.component.css']
})
export class LossCodeComponent implements OnInit {

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmDialog: ConfirmSaveComponent;
  @ViewChild("lossCodeTable") regionTable: CustEditableNonDatatableComponent;

  passData: any = {
		tableData:[],
		tHeader				:["Loss Code","Loss Code Abbr","Description","Loss Code Type","Active","Remarks"],
		dataTypes			:["reqNumber","reqText","reqText","select", "checkbox", "text"],
		nData:{
			lossCd        	: null,
			lossCdAbbr		: null,
			description     : null,
			lossCdType		: null,
			activeTag       : null,
			remarks         : null,
			"createUser"    : this.ns.getCurrentUser(),
            "createDate"    : this.ns.toDateTimeString(0),
            "updateUser"	: this.ns.getCurrentUser(),
      		"updateDate"	: null
		},
		checkFlag			: false,
		searchFlag		    : true,
		addFlag				: true,
		genericBtn          :'Delete',
		disableGeneric 		: true,
		paginateFlag		: true,
		infoFlag			: true,
		pageLength			: 10,
		widths				:[1,1,'auto',1,'auto','auto'],
		resizable			:[true, true, true ,true, true, true],
		pageunID		    : 'mtn-loss-code',
		keys				:['lossCd','lossCdAbbr','description','lossCdType','activeTag','remarks'],
		uneditable			:[false,false,false,false, false, false]

	};

	lossCode : any = {
		lossCd			: null,
		createUser		: null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null,
	}


  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal
    ,private route: ActivatedRoute) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Claims | Loss Code');
  }

}
