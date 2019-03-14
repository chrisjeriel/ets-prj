import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../../../../_services';
import { CVListing } from '@app/_models'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cv-entry',
  templateUrl: './cv-entry.component.html',
  styleUrls: ['./cv-entry.component.css']
})
export class CvEntryComponent implements OnInit {
  
/*  passDataCheckDetails: any = {
        tableData: this.accountingService.getCheckDetails(),
        tHeader: ["Bank", "Account No", "Check Date", "Check No", "Check Class","Curr","Amount"],
        dataTypes: ['select','text','date','sequence-8','select','select','currency',],
        opts: [{ selector: "bank", vals: ["Banco De Oro", "Bank of the Philippine Island", "Philippine National Bank"] }, { selector: "accountNo", vals: ["PCPA-9091-7001-7389", "PCPA-9095-3001-7529", "PCPA-9071-8001-7356"] }, { selector: "checkClass", vals: ["Local Clearing", "Manager's Check", "On Us"]}, { selector: "currency", vals: ["PHP", "EUR", "USD"]}],
        uneditable:[false,false,false,true,false,false,true],
        addFlag:true,
        editFlag:true,
        //totalFlag:true,
        pageLength: 10,
        infoFlag: true,
        paginateFlag: true,
    };*/

    preparedByData: any = {
      tableData: [
      ['Ma. Cecilia Dela Paz- Castro','Accountant I',new Date(2018,10,1,8,45)],
      ],
      tHeader: ['Name','Position','Date'],
      dataTypes: ['text','text','datetime'],
      keys: ['name','position','date'],
      nData: [null, null, new Date()],
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
      ['Juan Dela Cruz','Section Manager',new Date(2018,10,2,8,45)],
      ],
      tHeader: ['Name','Position','Date'],
      dataTypes: ['text','text','datetime'],
      keys: ['name','position','date'],
      nData: [null, null, new Date()],
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
      ['Jose Reyes','Comptroller',new Date(2018,10,2,8,45)],
      ['Paul Salazar','Chairman',new Date(2018,10,2,8,45)]
      ],
      tHeader: ['Name','Position','Date'],
      dataTypes: ['text','text','datetime'],
      keys: ['name','position','date'],
      nData: [null, null, new Date()],
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

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | CV Entry");
  }

/*  changeAccountNumber(data){
    for (var i = data.length - 1; i >= 0; i--) {
      if(data[i].bank=='Banco De Oro'){
        data[i].accountNo = 'PCPA-9091-7001-7389';
      }else if(data[i].bank=='Bank of the Philippine Island'){
        data[i].accountNo = 'PCPA-9095-3001-7529';
      }else if(data[i].bank=='Philippine National Bank'){
        data[i].accountNo = 'PCPA-9071-8001-7356';
      }
    }
    this.passDataCheckDetails.tableData = data;
    
  }
*/
  showPrintModal(){
    $('#printModal > #modalBtn').trigger('click');
  }

  showCVEndtDetModal(){
    $('#cvEndt > #modalBtn').trigger('click');
  }

  save(){
    //do something
  }

  cancel(){
    //do something
  }

  print(){
    //print something
  }

}
