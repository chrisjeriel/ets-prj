import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService, QuotationService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-type-of-cession',
  templateUrl: './type-of-cession.component.html',
  styleUrls: ['./type-of-cession.component.css']
})
export class TypeOfCessionComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

	passData: any = {
        tableData            : [],
        tHeader              : ['Cession No', 'Type of Cession', 'Description','Active','Remarks'],
        dataTypes            : ['number','text','text','checkbox','text'],
        nData:
        {
            cessionId	: null,
            cessionAbbr : null,
            description : null,
            activeTag   : null,
            remarks    	: null
        },
        checkFlag			: true,
        paginateFlag        : true,
        infoFlag            : true,
        searchFlag          : true,
        pageLength          : 10,
        addFlag             : true,
        deleteFlag          : true,
        keys                : ['cessionId','cessionAbbr','description','activeTag','remarks'],
        uneditable          : [true,false,false,false,false],
        pageID              : 'mtn-cession',
        widths              : ['auto','auto','auto','auto','auto']

    };

    cessionData : any = {
    	updateDate : null,
        updateUser : null,
        createDate : null,
        createUser : null,
    }

    cessionReq 		: any;
    dialogIcon		: string = '';
    dialogMessage	: string = '';
    cancelFlag      : boolean;
    warnMsg			: string = '';
    arrCessionDesc	: any[];

  	constructor(private titleService: Title, private mtnService: MaintenanceService, private ns : NotesService, private quotationService: QuotationService) { }

	ngOnInit() {
		this.titleService.setTitle('Mtn | Type of Cession'); 
		this.getTypeofCession();
	}

	getTypeofCession(){
		this.mtnService.getMtnTypeOfCession('')
		.subscribe(data => {
			console.log(data);
			var rec = data['cession'];
			this.passData.tableData = rec;
			this.table.refreshTable();
		});
	}

	saveTypeOfCession(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.dialogIcon = '';
        this.dialogMessage = '';

		for(var i=0;i<this.passData.tableData.length;i++){
            var rec = this.passData.tableData[i];
            console.log(rec);
            if(rec.cessionAbbr === '' || rec.cessionAbbr === null || rec.description === '' || rec.description === null){
            	 setTimeout(()=>{
                    $('.globalLoading').css('display','none');
                    this.dialogIcon = 'error';
                    $('app-sucess-dialog #modalBtn').trigger('click');
                },500);
            }else{
            	if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
            		this.cessionReq = {
					  	"deleteTypeOfCession": [],
					  	"saveTypeOfCession": [
					    	{
					      	"activeTag"		: rec.activeTag,
					      	"cessionAbbr"	: rec.cessionAbbr,
					      	"cessionId"		: rec.cessionId,
					      	"createDate"	: (rec.createDate === '' || rec.createDate === null || rec.createDate === undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(rec.createDate),
					      	"createUser"	: (rec.createUser === '' || rec.createUser === null || rec.createUser === undefined)?this.ns.getCurrentUser():rec.createUser,
					      	"description"	: rec.description,
					      	"remarks"		: rec.remarks,
					      	"updateDate"	: this.ns.toDateTimeString(0),
					      	"updateUser"	: this.ns.getCurrentUser()
					    	}
					  	]
            		}
            		this.mtnService.saveMtnTypeOfCession(JSON.stringify(this.cessionReq))
					.subscribe(data => {
						console.log(data);
						$('app-sucess-dialog #modalBtn').trigger('click');
						this.getTypeofCession();
					});
            	}else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
            		this.cessionReq = {
					  	"deleteTypeOfCession": [
							{
					      	"activeTag"		: '',
					      	"cessionAbbr"	: '',
					      	"cessionId"		: rec.cessionId,
					      	"createDate"	: '',
					      	"createUser"	: '',
					      	"description"	: '',
					      	"remarks"		: '',
					      	"updateDate"	: '',
					      	"updateUser"	: ''
					    	}
					  	],
					  	"saveTypeOfCession": []
            		}
            		this.mtnService.saveMtnTypeOfCession(JSON.stringify(this.cessionReq))
					.subscribe(data => {
						console.log(data);
						$('app-sucess-dialog #modalBtn').trigger('click');
						this.getTypeofCession();
					});
            	}
            }
        }

	}

	getQuotationProcessing(){
		this.quotationService.getQuoProcessingData([])
		.subscribe(data => {
			console.log(data);
			var rec = data['quotationList'];
			for(let i of rec){
				this.arrCessionDesc.push(i.cessionDesc);
			}
		});
	}

	onRowClick(event){
		if(event !== null){
			this.cessionData.updateDate = this.ns.toDateTimeString(event.updateDate);
	        this.cessionData.updateUser = event.updateUser;
	        this.cessionData.createDate = this.ns.toDateTimeString(event.createDate);
	        this.cessionData.createUser = event.createUser;
		}
	}

	cancel(){
  	  	this.cancelBtn.clickCancel();
	}

	onClickSave(){
	    $('#confirm-save #modalBtn2').trigger('click');
	}

	showWarnLov(){
		$('#warnMdl > #modalBtn').trigger('click');
	}

}
