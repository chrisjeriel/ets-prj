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

  dialogIcon: string = '';
  dialogMessage: string = '';

  selected: any;

  btnDisabled: boolean = false;
  isType: boolean = false;
  noDataFound: boolean = false;

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

  constructor(private route: ActivatedRoute,private router: Router, private modalService: NgbModal, private us: UnderwritingService) { }

  ngOnInit() {
  	this.retrievePolListing();
  }

  onTabChange($event: NgbTabChangeEvent) {            
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('');
      }
    }

	openPolListModal(){
		this.retrievePolListing();
		$('#lovMdl > #modalBtn').trigger('click');

	}
	retrievePolListing(){
		this.us.getParListing([{key: 'policyNo', search: this.noDataFound ? '' : this.tempPolNo.join('%-%')}]).subscribe((data: any)=>{
			console.log(data);
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
		this.policyInfo.policyId = this.selected.policyId;
		this.policyInfo.policyNo = this.selected.policyNo;
		this.tempPolNo = this.selected.policyNo.split('-');
		this.policyInfo.cedingName = this.selected.cedingName;
		this.policyInfo.insuredDesc = this.selected.insuredDesc;
		this.policyInfo.riskName = this.selected.riskName;
	}

	generate(){
		this.us.getUWCoverageInfos(this.policyInfo.policyNo, this.policyInfo.policyId).subscribe((data:any)=>{
			console.log(data);
		});
	}

	checkPolicySearch(){
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
			this.retrievePolListing();
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
	      return String(str).padStart(2, '0');
	    }
	  }
	}

}
