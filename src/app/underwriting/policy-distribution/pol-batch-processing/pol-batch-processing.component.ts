import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-pol-batch-processing',
  templateUrl: './pol-batch-processing.component.html',
  styleUrls: ['./pol-batch-processing.component.css']
})
export class PolBatchProcessingComponent implements OnInit {
  
  passDataPosting: any = {
        tHeader: [
            "Dist No.", "Risk Dist No.", "Status","Line", "Policy No.",
            "Ceding Company", "Insured", "Risk","Currency","Sum Insured","Distribution Date", "Accounting Date"
        ],
        resizable: [
            false, false, true,false, false, true, true, true,false,true,false, false,
        ],
        dataTypes: [
            "text", "text", "text","text", "text", "text", "text", "text","text","currency","date", "date"
        ],
        tableData: this.underwritingService.getPolicyBatchPosting(),
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 10,
        searchFlag:true,
        paginateFlag:true,
        infoFlag:true,
   };

   passDataDistribution: any = {
        tHeader: [
            "Dist No.", "Risk Dist No." , "Status","Line", "Policy No.",
            "Ceding Company", "Insured", "Risk","Currency","Sum Insured","Distribution Date", "Accounting Date"
        ],
        resizable: [
            false, false, true,false, false, true, true, true,false,true,false, false,
        ],
        dataTypes: [
            "text", "text", "text","text", "text", "text", "text", "text","text","currency","date", "date"
        ],
        tableData: this.underwritingService.getPolicyBatchDistribution(),
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 10,
        searchFlag:true,
        paginateFlag:true,
        infoFlag:true,
   };

  constructor(private titleService: Title, private underwritingService: UnderwritingService) { }

  ngOnInit() {
        this.titleService.setTitle("Pol | Batch Processing");
    }

}
