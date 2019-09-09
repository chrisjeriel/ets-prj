import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cv-entry-service',
  templateUrl: './cv-entry-service.component.html',
  styleUrls: ['./cv-entry-service.component.css']
})
export class CvEntryServiceComponent implements OnInit {

  preparedByData: any = {
      tableData: [
      {name:'Ma. Cecilia Dela Paz- Castro',postion:'Accountant I',date:new Date(2018,10,1,8,45)},
      ],
      tHeader: ['Name','Position','Date'],
      dataTypes: ['text','text','datetime'],
      keys: ['name','position','date'],
      nData: [{name:null, position:null, date:new Date()}],
      resizable: [false,false,false],
      pageLength: 3,
      paginateFlag: true,
      infoFlag: true,
      addFlag: true,
      deleteFlag: true,
      tableOnly: true,
      checkFlag: true,
      pageID: 1,
      magnifyingGlass:['name'],
      widths:[250,200,200],
      uneditable: [true, true, true],
  }

    certifiedByData: any = {
      tableData: [
      {name:'Juan Dela Cruz',position:'Section Manager',date:new Date(2018,10,2,8,45)},
      ],
      tHeader: ['Name','Position','Date'],
      dataTypes: ['text','text','datetime'],
      keys: ['name','position','date'],
      nData: [{name:null, position:null, date:new Date()}],
      resizable: [false,false,false],
      pageLength: 3,
      paginateFlag: true,
      infoFlag: true,
      addFlag: true,
      deleteFlag: true,
      tableOnly: true,
      checkFlag: true,
      pageID: 2,
      magnifyingGlass:['name'],
      widths:[250,200,200],
      uneditable: [true, true, false],
  }


  approvedByData: any = {
      tableData: [
      {name:'Jose Reyes',position:'Comptroller',date: new Date(2018,10,2,8,45)},
      {name:'Paul Salazar',position:'Chairman',date:new Date(2018,10,2,8,45)}
      ],
      tHeader: ['Name','Position','Date'],
      dataTypes: ['text','text','datetime'],
      keys: ['name','position','date'],
      nData: [{name:null, position:null, date:new Date()}],
      resizable: [false,false,false],
      pageLength: 3,
      paginateFlag: true,
      infoFlag: true,
      addFlag: true,
      deleteFlag: true,
      tableOnly: true,
      checkFlag: true,
      pageID: 3,
      magnifyingGlass:['name'],
      widths:[250,200,200],
      uneditable: [true, true, false],
      
   }

  constructor(public modalService: NgbModal) { }

  ngOnInit() {
  }

  showPrintModal() {
    $('#printMdl > #modalBtn').trigger('click');
  }

   showCVEndtDetModal(){
    $('#cvEndt > #modalBtn').trigger('click');
  }

  save() {
    //do something
  }

}
