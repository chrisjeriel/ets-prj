import { Component, OnInit } from '@angular/core';
import { ExtractedPolicy } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purge-extracted-policy',
  templateUrl: './purge-extracted-policy.component.html',
  styleUrls: ['./purge-extracted-policy.component.css']
})
export class PurgeExtractedPolicyComponent implements OnInit {
  passData:any={
  	tableData:[new ExtractedPolicy("pol no",102023,2142124,new Date(),true,false)],
  	tHeader: ['Policy No', 'TSI Amount', 'Premium Amount', 'Expiry Date', 'P', 'X'],
  	dataTypes:['text','currency','currency','date', 'checkbox', 'checkbox'],
  	paginateFlag:true,
  	infoFlag:true

  }

  byDate: boolean = true;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  parameter() {
        $('#modalBtn').trigger('click');
    }

   clearDates() {
    $('#fromDate').val("");
    $('#toDate').val("");
  }
}