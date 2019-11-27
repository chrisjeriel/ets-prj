import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent, ModalComponent, CustEditableNonDatatableComponent } from '@app/_components/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-batch-post',
  templateUrl: './batch-post.component.html',
  styleUrls: ['./batch-post.component.css']
})
export class BatchPostComponent implements OnInit {
  @ViewChild('confirmMdl') confirmMdl : ModalComponent;
  @ViewChild('msgMdl') msgMdl : ModalComponent;
  msgPassData:any = {
  	tHeader: [
          "Dist Id.", "Policy No.", "Status"
      ],
    dataTypes: [
        "sequence-5","text","text"
    ],  
    widths:[72,167,380],
    keys: ['distId', 'policyNo', 'message'],
    pageLength: 'unli',
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,],
    tableData:[]

  }

  confirmPassData:any = {
  	tHeader: [
          "Dist. Id", "Policy No.", "Ceding Company", "Insured", "Risk","Currency","Sum Insured"
      ],
    dataTypes: [
        "sequence-5","text","text", "text", "text", "text", "currency"
    ],  
    widths:[72,167,182,182,150,100],
    keys: ['distId', 'policyNo', 'cedingName', 'insuredDesc', 'riskName', 'currencyCd', 'totalSi'],
    pageLength: 'unli',
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,],
    tableData:[]

  }

  passData: any = {
      tHeader: [
          "Dist No.", "Risk Dist No.", "Status", "Line", "Policy No.",
          "Ceding Company", "Insured", "Risk","Currency","Sum Insured","Distribution Date", "Accounting Date"
      ],
      filters: [
         {
              key: 'distId',
              title:'Dist. No.',
              dataType: 'text'
          },
          {
              key: 'riskDistId',
              title:'Risk Dist. No.',
              dataType: 'text'
          },
          {
              key: 'status',
              title:'Status',
              dataType: 'text'
          },
          {
              key: 'lineCd',
              title:'Line',
              dataType: 'text'
          },
          {
              key: 'policyNo',
              title:'Policy No.',
              dataType: 'text'
          },
          {
              key: 'cedingName',
              title:'Ceding Co.',
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
              key: 'currencyCd',
              title:'Currency',
              dataType: 'text'
          },
          {
              key: 'totalSi',
              title:'Sum Insured',
              dataType: 'text'
          },
          {
               keys: {
                    from: 'distDateFrom',
                    to: 'distDateTo'
                },
                title: 'Dist Date',
                dataType: 'datespan'
          },
          {
               keys: {
                    from: 'acctDateFrom',
                    to: 'acctDateTo'
                },
                title: 'Acct Date',
                dataType: 'datespan'
            },
      ],
      dataTypes: [
          "sequence-5", "sequence-5", "text","text", "text", "text", "text", "text","text","currency","date", "date"
      ],
      tableData: [],
      keys: ['distId', 'riskDistId', 'status', 'lineCd' ,'policyNo', 'cedingName', 'insuredDesc', 'riskName', 'currencyCd', 'totalSi', 'distDate', 'acctDate'],
      pageLength: 20,
      printBtn: false,
      addFlag: false,
      pagination: true,
      pageStatus: true,
      exportFlag: true,
      checkFlag:true

  }

  searchParams: any[] = [];
  @ViewChild(CustNonDatatableComponent) table:CustNonDatatableComponent;
  @ViewChild('confirmTable') confirmTable:CustEditableNonDatatableComponent;
  @ViewChild('msgTable') msgTable:CustEditableNonDatatableComponent;

  constructor(private underwritingService: UnderwritingService, private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
        this.titleService.setTitle("Pol | Batch Distribution");
        this.retrievePolDistList();
    }

  retrievePolDistList(){
      this.searchParams.push({key:"statusArr",search:['D']})
      this.underwritingService.getPolDistList(this.searchParams).subscribe((data:any)=>{
          this.passData.tableData = data.polDistList.map(a=>{a.altNo = parseInt(a.policyNo.split('-')[5]);return a;});
          this.table.refreshTable();
      });
  }

  post(){
  	this.confirmTable.overlayLoader = true;
  	console.log(this.table.selected);
  	let params:any = {
  		distList : this.table.selected,
  		user : this.ns.getCurrentUser()
  	}
  	this.underwritingService.batchPost(params).subscribe(a=>{
  		this.confirmTable.overlayLoader = false;
  		this.confirmMdl.closeModal();
  		this.msgPassData.tableData = a['updateResult'];
  		this.msgTable.refreshTable();
  		this.msgMdl.openNoClose();
  		this.retrievePolDistList();
  		this.table.selected = [];
  	})
  }

  searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        this.retrievePolDistList();
   }

   confirmDist(){
   	this.confirmMdl.openNoClose();
   	this.confirmPassData.tableData=this.table.selected;
   	this.confirmTable.refreshTable();
   }

  getRecords(printParams?){
    this.underwritingService.getPolDistList(this.searchParams).pipe(finalize(() => this.finalGetRecords())).subscribe((data:any)=>{
      this.passData.tableData = data.polDistList;
    });
  }

  finalGetRecords(selection?){
    this.export(this.passData.tableData);
  };

  export(record?){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'BatchDistribution'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.nvl = function(text) {
        if (text === null){
          return '';
        } else {
          return text;
        }
      };

      alasql.fn.datetime = function(dateStr) {
             var date = new Date(dateStr);
             return date.toLocaleString().split(',')[0];
       };
    alasql('SELECT  distId AS [Dist No], riskDistId AS [Risk Dist No.], status AS [STATUS], lineCd AS [Line], policyNo AS [Policy No.], cedingName AS [Ceding Company], insuredDesc AS [Insured], riskName AS [Risk], currencyCd AS [Currency], totalSi AS [Sum Insured], datetime(distDate) AS [Distribution Date], datetime(acctDate) AS [Accounting Date] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);    
  }
}
