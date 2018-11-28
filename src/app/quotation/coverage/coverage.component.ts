import { Component, OnInit } from '@angular/core';
import { QuotationCoverageInfo, NotesReminders } from '../../_models';
import { QuotationService, NotesService } from '@app/_services';

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {

  private quotationCoverageInfo: QuotationCoverageInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  nData: QuotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null, null, null);
  //nData: NotesReminders = new NotesReminders(null, null, null, null, null, null, 'user', new Date());

  constructor(private quotationService: QuotationService, private notesService: NotesService) { }

  ngOnInit() {

    this.tHeader.push("");
    this.tHeader.push("Cover Code");
    this.tHeader.push("Section");
    this.tHeader.push("Bullet No");
    this.tHeader.push("Sum Insured");
    this.tHeader.push("Sort Se");
    this.tHeader.push("Add Sl");

    this.dataTypes.push("checkbox");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");

    // this.tHeader.push("Type");
    // this.tHeader.push("Details");
    // this.tHeader.push("Alarm User");
    // this.tHeader.push("Alarm Date");
    // this.tHeader.push("Alarm Time");
    // this.tHeader.push("Status");
    // this.tHeader.push("Created By");
    // this.tHeader.push("Date Created");

    this.tableData = this.quotationService.getCoverageInfo();

    //this.tableData = this.notesService.getNotesReminders();

    // this.quotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null, null, null, null);
    // this.quotationCoverageInfo.quotationNo = "MOCK DATA";
    // this.quotationCoverageInfo.insured = "MOCK DATA";
    // this.quotationCoverageInfo.currency = "MOCK DATA";
    // this.quotationCoverageInfo.sectionOne = "MOCK DATA";
    // this.quotationCoverageInfo.sectionTwo = "MOCK DATA";
    // this.quotationCoverageInfo.sectionThree = "MOCK DATA";
    // this.quotationCoverageInfo.deductibles = "MOCK DATA";
    // this.quotationCoverageInfo.remarks = "MOCK DATA";
  }

}
