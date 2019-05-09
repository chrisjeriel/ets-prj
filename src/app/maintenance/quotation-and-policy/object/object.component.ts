import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  @ViewChild(MtnLineComponent) lineLov : MtnLineComponent;

  passData: any = {
    tableData: [],
    tHeader: ['Object No', 'Description', 'Active','Remarks'],
    tooltip:[null,null,null,null],
    magnifyingGlass: ['endtCd'],
    dataTypes: ['text', 'text', 'checkbox', 'text'],
    nData: {
        changeTag: 'N',
        endtCd: '',
        endtTitle: '',
        remarks: '',
        createDate: this.ns.toDateTimeString(0),
        updateDate: this.ns.toDateTimeString(0),
        createUser: JSON.parse(window.localStorage.currentUser).username,
        updateUser: JSON.parse(window.localStorage.currentUser).username,
        deductibles: [],
        deductiblesOc: [],
        endtText:{}
    },
    addFlag: true,
    deleteFlag: true,
    checkFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    pageID: 'endt',
    widths: [1, 'auto', 'auto', 'auto'],
    keys: ['changeTag','endtCd', 'endtTitle','text', 'remarks'],
    uneditable: [false, false, true, false,false]
  };

catPerilData: any = {
    tableData: [],
    tHeader: ['CAT Peril No', 'Name', 'Abbreviation', 'Percent Share on Premium (%)'],
    dataTypes: ['text', 'text', 'text', 'percent'],
    nData: {
        coverCd: 0,
        deductibleCd: '',
        deductibleTitle: '',
        deductibleTxt: '',
        deductibleRt: 0,
        deductibleAmt: 0,
        showMG: 1,
        createDate: this.ns.toDateTimeString(0),
        updateDate: this.ns.toDateTimeString(0),
        createUser: JSON.parse(window.localStorage.currentUser).username,
        updateUser: JSON.parse(window.localStorage.currentUser).username,
    },
    addFlag: true,
    disableAdd: true,
    deleteFlag: true,
    checkFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    pageID: 'deductible',
    widths: [1, 'auto', 'auto', 'auto', 'auto'],
    keys: ['deductibleCd','deductibleTitle', 'deductibleTxt', 'deductibleRt', 'deductibleAmt'],
    uneditable: [false,true,true,true,true]
  }

  line              : string;
  description       : string;

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle('Mtn | Object');
  }

  retrieveObject() {
    this.mtnService.getMtnObject(this.line, null).subscribe(data => {
      console.log(data);
    });
  }

  showLineLOV() {
    $('#lineLOV #modalBtn').trigger('click');
  }

  setLine(data) {
    this.line = data.lineCd;
    this.description = data.description;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveObject();
  }

  checkCode(ev) {
    this.ns.lovLoader(ev, 1);
    this.lineLov.checkCode(this.line.toUpperCase(), ev);
  }

}
