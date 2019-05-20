import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { MtnRegionComponent } from '@app/maintenance/mtn-region/mtn-region/mtn-region.component';
import { MtnProvinceComponent } from '@app/maintenance/mtn-region/mtn-province/mtn-province.component';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild("confirmSave") confirmDialog: ConfirmSaveComponent;
  @ViewChild("cityTable") provinceTable: CustEditableNonDatatableComponent;
  @ViewChild(MtnRegionComponent) regionLov: MtnRegionComponent;
  @ViewChild(MtnProvinceComponent) provinceLov: MtnProvinceComponent;

   passData: any = {
		tableData:[],
		tHeader				:["City Code", "Description","CRESTA Zone", "Active", "Remarks"],
		dataTypes			:["reqNumber", "reqText", "text", "checkbox", "text"],
		nData:{
			provinceCd      : null,
			description     : null,
			activeTag       : null,
			catTag          : null,

			remarks         : null,
			"createUser"    : this.ns.getCurrentUser(),
      		"createDate"    : this.ns.toDateTimeString(0),
      		"updateUser"	  : this.ns.getCurrentUser(),
      		"updateDate"	  : this.ns.toDateTimeString(0)
		},
		checkFlag			  : false,
		searchFlag			  : true,
		addFlag				  : true,
		genericBtn      	  :'Delete',
		disableAdd      	  : true,
		disableGeneric 		  : true,
		paginateFlag		  : true,
		infoFlag			  : true,
		pageLength			  : 10,
		widths				  :[1,'auto','auto',1,'auto'],
		resizable			  :[true, true, true, false ,true],
		pageunID		      :'mtn-city',
		keys				  :['cityCd','description','cresta','activeTag','remarks'],
		uneditable			  :[false,false,false,false,false]

	};

    cityRecord : any = {
		cityCd				: null,
		createUser			: null,
	    createDate			: null,
	    updateUser			: null,
	    updateDate			: null,
	}

	regionCD   		: any;
	descRegion 		: any;
	provinceCD  	: any;
	descProvince 	: any;


  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal) { }


  ngOnInit() {
  	this.titleService.setTitle('Mtn | City');
  }

}
