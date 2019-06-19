import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ClaimsService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-clm-claim-processing',
  templateUrl: './clm-claim-processing.component.html',
  styleUrls: ['./clm-claim-processing.component.css']
})
export class ClmClaimProcessingComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  passData: any = {
    tableData: [],
    tHeader: ['Claim No', 'Status', 'Policy No', 'Ceding Company', 'Insured', 'Risk', 'Loss Date', 'Loss Details', 'Currency', 'Total Reserve', 'Total Payments', 'Adjusters', 'Processed By'],
    dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'date', 'text','text', 'currency', 'currency', 'text', 'text'],
    keys: ['claimNo', 'clmStatus', 'policyNo', 'cedingName', 'insuredDesc', 'riskName', 'lossDate', 'lossDtl', 'currencyCd', 'totalLossExpRes', 'totalLossExpPd', 'adjName', 'processedBy'],
    addFlag: true,
    editFlag: true,
    pagination: true,
    pageStatus: true,
    searchFlag: true,
    pageLength: 20,
    filters: [
       {
            key: 'claimNo',
            title:'Claim No.',
            dataType: 'text'
        },
        {
            key: 'cedingName',
            title:'Ceding Name',
            dataType: 'text'
        },
        {
            key: 'clmStatus',
            title:'Status',
            dataType: 'text'
        },
        {
            key: 'policyNo',
            title:'Policy No.',
            dataType: 'text'
        },
        {
            key: 'insuredDesc',
            title:'Insured',
            dataType: 'text'
        },
        {
            key: 'riskName',
            title:'Risk',
            dataType: 'text'
        },
        {
             keys: {
                  from: 'lossDateFrom',
                  to: 'lossDateTo'
              },
              title: 'Loss Date',
              dataType: 'datespan'
        },
        {
            key: 'currencyCd',
            title:'Currency',
            dataType: 'text'
        },
        {
            key: 'processedBy',
            title:'Processed By',
            dataType: 'text'
        },
    ],
  };

  searchParams: any[] = [];
  selected: any;


  constructor(private titleService: Title, private modalService: NgbModal, private router: Router, private cs : ClaimsService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim Processing");
    this.retrieveClaimsList();
  }

  retrieveClaimsList(){
    this.cs.getClaimsListing(this.searchParams).subscribe((data : any)=>{
      if(data != null){
        for(var i of data.claimsList){
          for(var j of i.clmAdjusterList){
            if(i.adjName === undefined){
              i.adjName = j.adjName;
            }else{
              i.adjName = i.adjName + '/' + j.adjName;
            }
          }
          this.passData.tableData.push(i);
        }
        this.table.refreshTable();
      }
    });
  }

  navigateToGenInfo() {  
    this.router.navigate(
                    ['/claims-claim', {
                        from: 'add',

                    }],
                    { skipLocationChange: true }
      );
  }

  /*onRowDblClick(event) {
    this.slctd = event.target.closest("tr").children[0].innerText;
    this.slctdArr = this.slctd.split("-");
    for (var i = 0; i < this.slctdArr.length; i++) {
      this.polLine = this.slctdArr[0];
    }
    this.router.navigate(['/claims-claim', { line: this.polLine }], { skipLocationChange: true });
  }*/

  onClickAdd(event) {
    $('#addClaim > #modalBtn').trigger('click');
  }

  onClickEdit(event){
    let line = this.selected.policyNo.split('-')[0];
    this.router.navigate(
                    ['/claims-claim', {
                        from: 'edit',
                        claimId: this.selected.claimId,
                        claimNo: this.selected.claimNo,
                        line: line,
                        exitLink: 'clm-claim-processing'
                    }],
                    { skipLocationChange: true }
      );
  }

  searchQuery(searchParams){
    console.log(searchParams);
        this.searchParams = searchParams;
        this.passData.tableData = [];
        //this.passData.btnDisabled = true;
        this.retrieveClaimsList();

   }
}
