import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService, UnderwritingService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-hundred-val-pol-print',
  templateUrl: './hundred-val-pol-print.component.html',
  styleUrls: ['./hundred-val-pol-print.component.css']
})
export class HundredValPolPrintComponent implements OnInit {

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

  private currentUser: string = JSON.parse(window.localStorage.currentUser).username;

  dialogIcon: string = '';
  dialogMessage: string = '';

  selected: any;

  btnDisabled: boolean = false;
  isType: boolean = false;
  noDataFound: boolean = false;
  cancelFlag: boolean = false;
  flawlessTransaction: boolean = false;
  generateFlag: boolean = true;
  loading: boolean = false;
  change: boolean = false;

  policyListingData: any = {
  	tableData: [],
  	tHeader: ['Policy No.', 'Ceding Company', 'Insured', 'Risk'],
  	dataTypes: ['text', 'text', 'text', 'text'],
  	pageLength: 10,
  	pagination: true,
  	pageStatus: true,
  	keys: ['policyNo','cedingName', 'insuredDesc', 'riskName']
  }

  policyInfo: any = {
  	policyId: '',
  	policyNo: '',
  	cedingName: '',
  	insuredDesc: '',
  	riskName: '',
  	treatyPercent: ''
  }

  tempPolNo: string[] = ['','','','','',''];

  constructor(private route: ActivatedRoute,private router: Router, public modalService: NgbModal, private us: UnderwritingService, private ns: NotesService) { }

  ngOnInit() {
  	//this.retrievePolListing();
  }

  onTabChange($event: NgbTabChangeEvent) {            
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('');
      }
    }

	openPolListModal(){
		this.policyListingData.tableData = [];
		this.retrievePolListing();
		$('#lovMdl > #modalBtn').trigger('click');

	}
	retrievePolListing(){
		this.policyListingData.tableData = [];
		this.table.loadingFlag = true;
		this.us.getParListing([{key: 'policyNo', search: this.noDataFound ? '' : this.tempPolNo.join('%-%')}]).subscribe((data: any)=>{
			console.log(data);
			this.table.loadingFlag = false;
			if(data.policyList.length !== 0){
				this.noDataFound = false;
				for(var rec of data.policyList){
					this.policyListingData.tableData.push({
						policyId: rec.policyId,
						policyNo: rec.policyNo,
						cedingName: rec.cedingName,
						insuredDesc: rec.insuredDesc,
						riskName: rec.project.riskName,
						statusDesc: rec.statusDesc,
						totalSi: rec.project.coverage.totalSi
					});
				}
				this.policyListingData.tableData = this.policyListingData.tableData.filter(a => {return a.statusDesc.toUpperCase() !== 'SPOILED'});
				this.table.refreshTable();
				if(this.isType){
					this.selected = this.policyListingData.tableData[0];
					this.selectPol();
					this.isType = false;
				}
			}else{
				this.noDataFound = true;
				this.isType = false;
				setTimeout(()=>{this.openPolListModal()},100);
			}
		});
	}

	onRowClick(data){
		if(data !== null && Object.keys(data).length !== 0){
			this.selected = data;
			this.btnDisabled = false;
		}else{
			this.btnDisabled = true;
		}
	}

	selectPol(){
		this.loading = true;
		this.policyInfo.policyId = this.selected.policyId;
		this.policyInfo.policyNo = this.selected.policyNo;
		this.tempPolNo = this.selected.policyNo.split('-');
		this.policyInfo.cedingName = this.selected.cedingName;
		this.policyInfo.insuredDesc = this.selected.insuredDesc;
		this.policyInfo.riskName = this.selected.riskName;
		this.us.getFullCoverage(this.policyInfo.policyNo, this.policyInfo.policyId).subscribe((data: any)=>{
			if(data.policy === null){
				this.generateFlag = true;
			}else{
				this.generateFlag = false;
				this.policyInfo.treatyPercent = data.policy.project.fullCoverage.treatyShare;
				setTimeout(()=>{
					$('#treatyShare').focus();
					$('#treatyShare').blur();
				}, 0);
			}
			this.loading = false;
		});
	}

	onClickGenerate(){
		if(this.policyInfo.policyId.toString().length === 0 || this.policyInfo.policyNo.length === 0 ||
		   this.policyInfo.cedingName.length === 0 || this.policyInfo.insuredDesc.length === 0 ||
		   this.policyInfo.riskName.length === 0 || this.policyInfo.treatyPercent.toString().length === 0){
			this.dialogIcon = "info";
			this.dialogMessage = "Please fill all required fields";
			this.successDiag.open();
		}else if(!this.generateFlag){
			this.flawlessTransaction = true;
			this.navigate();
		}else if(this.generateFlag){
			$('#confirm-save #modalBtn2').trigger('click');
		}
	}

	generate(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.us.getUWCoverageInfos(this.policyInfo.policyNo, this.policyInfo.policyId).subscribe((data:any)=>{
			console.log(data);
			let params: any = {
				policyId: this.policyInfo.policyId,
				projId: data.policy.project.projId,
				riskId: data.policy.project.riskId,
				lineCd: this.policyInfo.policyNo.split('-')[0],
				treatyShare: this.policyInfo.treatyPercent,
				createUser: this.currentUser,
				createDate: this.ns.toDateTimeString(0),
				updateUser: this.currentUser,
				updateDate: this.ns.toDateTimeString(0)
			}
			this.us.generateHundredValPolPrinting(params).subscribe((data: any)=>{
				if(data.returnCode === 0){
					this.dialogIcon = "error-message";
					this.dialogMessage = "Error generating Policy Print";
					this.successDiag.open();
				}else{
					this.dialogIcon = "success-message";
					this.dialogMessage = "Coverage details were successfully generated";
					this.successDiag.open();
					this.flawlessTransaction = true;
				}
			});
		});
	}

	navigate(){
		if(this.flawlessTransaction){
			this.router.navigate(['/pol-value-coverage', { 
                                                        policyId: this.policyInfo.policyId,
                                                        policyNo: this.policyInfo.policyNo,
                                                        insuredDesc: this.policyInfo.insuredDesc,
                                                        riskName: this.policyInfo.riskName
                                                   }
                     ], { skipLocationChange: true });
		}
	}

	checkPolicySearch(){
		console.log(this.tempPolNo);
		if(this.change){
			let emptyCheck: boolean = false;
			for(var i of this.tempPolNo){
				if(i.length === 0){
					this.clearFields();
					emptyCheck = true;
					break;
				}
			}
			if(!emptyCheck){
				this.policyListingData.tableData = [];
				this.isType = true;
				this.change = false;
				this.retrievePolListing();
			}
		}
	}

	onClickCancel(){
		this.cancelBtn.clickCancel();
	}

	clearFields(){
		this.policyInfo = {
						  	policyId: '',
						  	policyNo: '',
						  	cedingName: '',
						  	insuredDesc: '',
						  	riskName: '',
						  	treatyPercent: ''
						  };
	}

	pad(str, field) {
	  if(str === '' || str == null){
	    return '';
	  }else{
	    if(field === 'seqNo'){
	      return String(str).padStart(5, '0');
	    }else if(field === 'coSeriesNo'){
	      return String(str).padStart(4, '0');
	    }else if(field === 'cedingId'){
	      return String(str).padStart(3, '0');
	    }else if(field === 'altNo'){
	      return String(str).padStart(3, '0');
	    }
	  }
	}

}
