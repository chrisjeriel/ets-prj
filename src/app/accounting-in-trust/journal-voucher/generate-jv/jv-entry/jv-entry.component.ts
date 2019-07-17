import { Component, OnInit ,OnChanges,Input,Output,EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AccountingService, NotesService } from '@app/_services' 

@Component({
  selector: 'app-jv-entry',
  templateUrl: './jv-entry.component.html',
  styleUrls: ['./jv-entry.component.css']
})
export class JvEntryComponent implements OnInit {

  @Input() record: any = {
                  jvType: null
                 };

  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() emitData = new EventEmitter<any>();

  entryData:any = {
    jvYear:'',
    jvNo: '',
    status: '',
    autoTag:'',
    refNo:'',
    refNoDate:'',
    jvType: '',
    particulars: '',
    currencyCd:'',
    jvAmt:'',
    localAmt:'',
    preparedBy:'',
    preparedDate:'',
    approvedBy:'',
    approvedDate:''
  }

  tranId:any;
  jvDate: any;
  cancelJVBut: boolean = false;
  approveBut: boolean = false;
  printBut: boolean = false;
  UploadBut: boolean = false;
  allocBut: boolean = false;
  dcBut: boolean = false;

  constructor(private titleService: Title, private route: ActivatedRoute,private accService:AccountingService, private ns: NotesService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Journal Voucher");

    this.route.params.subscribe(params => {
      this.tranId = params.tranId;
    });

    this.cancelJVBut = true;
    this.approveBut = true;
    this.printBut = true;
    this.UploadBut = true;
    this.allocBut = true;
    this.dcBut = true;
    this.retrieveJVEntry();
  }

  retrieveJVEntry(){
    this.accService.getJVEntry(this.tranId).subscribe((data:any) => {
      console.log(data)
      if(data.transactions != null){
        this.entryData = data.transactions.jvListings;
        /*this.entryData.jvDate = this.ns.toDateTimeString(this.entryData.jvDate);
        this.entryData.refnoDate = this.ns.toDateTimeString(this.entryData.refnoDate);
        this.entryData.preparedDate = this.ns.toDateTimeString(this.entryData.preparedDate);
        this.entryData.approvedDate = this.ns.toDateTimeString(this.entryData.approvedDate);*/
        this.entryData.jvNum = this.entryData.jvNo;
        this.entryData.jvNo = String(this.entryData.jvNo).padStart(8,'0');
        this.entryData.createDate = this.ns.toDateTimeString(this.entryData.createDate);
        this.entryData.updateDate = this.ns.toDateTimeString(this.entryData.updateDate);

        this.cancelJVBut = false;
        this.approveBut = false;
        this.printBut = false;
        this.UploadBut = false;
        this.allocBut = false;
        this.dcBut = false;
        this.check(this.entryData)
        this.tabController(this.entryData.tranTypeName);
      }else{
        this.entryData.jvDate = this.ns.toDateTimeString(0);
        this.entryData.jvStatus = 'New';
        this.tabController(this.entryData.tranTypeName);
        this.onChange.emit({ type: '' });
      }
      
    });
  }

  tabController(event) {
  	this.onChange.emit({ type: event});
  }

  newJV(){
    this.entryData.jvYear = '';
    this.entryData.jvNo =  '';
    this.entryData.jvStatus =  'New';
    this.entryData.tranTypeName = '';
    this.entryData.jvDate = this.ns.toDateTimeString(0);
    this.entryData.autoTag = '';
    this.entryData.refnoTranId = '';
    this.entryData.refNoDate = '';
    this.entryData.jvType =  '';
    this.entryData.particulars =  '';
    this.entryData.currCd = 'PHP';
    this.entryData.currRate = '';
    this.entryData.jvAmt = '';
    this.entryData.localAmt = '';
    this.entryData.preparedBy = '';
    this.entryData.preparedDate = '';
    this.entryData.approvedBy = '';
    this.entryData.approvedDate = '';
       
    this.cancelJVBut = true;
    this.approveBut = true;
    this.printBut = true;
    this.UploadBut = true;
    this.allocBut = true;
    this.dcBut = true;
  }
 
  check(ev){
    this.emitData.emit({ jvNo: ev.jvNo, 
                         jvYear: ev.jvYear, 
                         jvDate: ev.jvDate, 
                         jvStatus: ev.jvStatus,
                         refnoDate: ev.refnoDate,
                         refnoTranId: ev.refnoTranId,
                         currCd: ev.currCd,
                         currRate: ev.currRate,
                         jvAmt: ev.jvAmt,
                         localAmt: ev.localAmt,
                         jvType: ev.tranTypeName});
  }

  setTranType(data){
    this.entryData.tranTypeName = data.tranTypeName;
    this.tabController(this.entryData.tranTypeName);

  }

  openJVType(){
    $('#jvTypeModal #modalBtn').trigger('click');
  }

}
