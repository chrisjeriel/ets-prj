import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ClaimsService,NotesService } from '@app/_services';

@Component({
  selector: 'app-pol-inq-claims',
  templateUrl: './pol-inq-claims.component.html',
  styleUrls: ['./pol-inq-claims.component.css']
})
export class PolInqClaimsComponent implements OnInit {

  constructor(private cs : ClaimsService, private ns : NotesService, private route: ActivatedRoute, private router: Router) { }
  passData: any = {
    tableData: [],
    tHeader: ['Claim No', 'Loss Date','Loss Cause','Loss Details' ,'Currency', 'Total Reserve', 'Total Payments','Report Date'],
    uneditable:[true,true,true,true,true,true,true,true,true,true,],
    dataTypes: ['text', 'date', 'text', 'text', 'text', 'currency', 'currency','date'],
    keys: ['claimNo', 'lossDate','lossAbbr','lossDtl', 'currencyCd', 'totalLossExpRes', 'totalLossExpPd','reportDate'],
    colSize: ['90px','70px','120px','120px','49px','110px','110px','70px'],
    addFlag: false,
    editFlag: false,
    pagination: true,
    pageStatus: true,
    searchFlag: true,
    pageLength: 10,
    pageID: 'passDataLOVTbl',
    filters: [
       {
            key: 'claimNo',
            title:'Claim No.',
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
             keys: {
                  from: 'totalResFrom',
                  to: 'totalResTo'
              },
              title: 'Total Reserve',
              dataType: 'textspan'
        },
        {
             keys: {
                  from: 'totalPaytFrom',
                  to: 'totalPaytTo'
              },
              title: 'Total Payment',
              dataType: 'textspan'
        }
    ],
  };
  @ViewChild('claim') table:any;
  policyNo:any;

  searchParamsLOVTbl:any[] = [];
  ngOnInit() {
    this.route.params.subscribe(params => {
        this.policyNo = params['showPolicyNo'];
        this.searchQueryLOVTbl(this.searchParamsLOVTbl);
    }); 
  }



  searchQueryLOVTbl(searchParams){
        this.searchParamsLOVTbl = searchParams;
        this.searchParamsLOVTbl.push({ key: 'policyNo', search: this.policyNo });
        
        this.passData.tableData = [];
        this.cs.getClaimsListing(this.searchParamsLOVTbl).subscribe(data => {
          this.passData.tableData = data['claimsList'].map(a => {
                                    a.createDate = this.ns.toDateTimeString(a.createDate);
                                    a.updateDate = this.ns.toDateTimeString(a.updateDate);
                                    return a;
                                  });
          this.table.refreshTable();
        });
   }

   goToClaims(){
    this.router.navigate(
                    ['/claims-claim', {
                        from: 'edit',
                          readonly: true,
                          claimId: this.table.indvSelect.claimId,
                          claimNo: this.table.indvSelect.claimNo,
                          line: this.table.indvSelect.claimNo.split('-')[0],
                          exitLink: 'claims-inquiry'
                    }],
                    { skipLocationChange: true }
      );
   }

}
