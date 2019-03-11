import { Component, OnInit,ViewChild } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Location } from '@angular/common'



@Component({
  selector: 'app-hold-cover',
  templateUrl: './hold-cover.component.html',
  styleUrls: ['./hold-cover.component.css']
})
export class HoldCoverComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  tableData: any[] = [];
  tHeader: any[] = [];
  quoteLine: string = "";
  private holdCoverInfo: HoldCoverInfo;
  
  passDataQuoteLOV : any = {
    tableData: [],
    tHeader:["Quotation No.", "Ceding Company", "Insured", "Risk"],
    dataTypes: ["text","text","text","text"],
    pageLength: 10,
    resizable: [false,false,false,false],
    tableOnly: false,
    keys: ['quotationNo','cedingName','insuredDesc','riskName'],
    pageStatus: true,
    pagination: true,
      /*filters: [
        {
          key: 'quotationNo',
          title : 'Quotation No.',
          dataType: 'text'
        },
        {
          key: 'cedingName',
          title : 'Ceding Company',
          dataType: 'text'
        },
        {
          key: 'insuredDesc',
          title : 'Insured',
          dataType: 'text'
        },
        {
          key: 'riskName',
          title : 'Risk',
          dataType: 'text'
        }
        ]*/
        filters: [
        {
          key: 'quotationNo',
          title: 'Quotation No.',
          dataType: 'seq'
        },
        {
          key: 'cessionDesc',
          title: 'Type of Cession',
          dataType: 'text'
        },
        {
          key: 'lineClassCdDesc',
          title: 'Line Class',
          dataType: 'text'
        },
        {
          key: 'status',
          title: 'Status',
          dataType: 'text'
        },
        {
          key: 'cedingName',
          title: 'Ceding Co.',
          dataType: 'text'
        },
        {
          key: 'principalName',
          title: 'Principal',
          dataType: 'text'
        },
        {
          key: 'contractorName',
          title: 'Contractor',
          dataType: 'text'
        },
        {
          key: 'insuredDesc',
          title: 'Insured',
          dataType: 'text'
        },
        {
          key: 'riskName',
          title: 'Risk',
          dataType: 'text'
        },
        {
          key: 'objectDesc',
          title: 'Object',
          dataType: 'text'
        },
        {
          key: 'site',
          title: 'Site',
          dataType: 'text'
        },
        {
          key: 'policyNo',
          title: 'Policy No.',
          dataType: 'seq'
        },
        {
          key: 'currencyCd',
          title: 'Currency',
          dataType: 'text'
        },
        {
          key: 'issueDate',
          title: 'Quote Date',
          dataType: 'date'
        },
        {
          key: 'expiryDate',
          title: 'Valid Until',
          dataType: 'date'
        },
        {
          key: 'reqBy',
          title: 'Requested By',
          dataType: 'text'
        },
        {
          key: 'createUser',
          title: 'Created By',
          dataType: 'text'
        },
        ],

        colSize: ['', '250px', '250px', '250px'],
      };

      searchParams: any[] = [];

      constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private location: Location) { 
      }

      qLine: string;
      qYear: string;
      qSeqNo: string;
      qRevNo: string;
      qCedingId: string;

      quoteNo:string;
      cedCo:string;
      insured:string;
      risk:string;

      rowRec;

      hcLine               : string;
      hcYear               : string;
      hcSeqNo              : string;
      hcRevNo              : string;

      quoteId: number;
      warningMsg: string;
      clickView:boolean;
      clickModif:boolean;
      btnApprovalEnabled: boolean;
      btnCancelMainEnabled: boolean;
      loading:boolean;
      dialogMessage:string = '';
      dialogIcon:string = '';

      holdCover: any = {
        approvedBy:     "",
        compRefHoldCovNo:     "",
        createDate:     "",
        createUser:     "",
        holdCoverId:    "",
        holdCoverNo:    "",
        holdCoverRevNo:     "",
        holdCoverSeqNo:     "",
        holdCoverYear:    "",
        lineCd:     "",
        lineCdDesc:     "",
        periodFrom:     "",
        periodTo:     "",
        preparedBy:     "",
        reqBy:    "",
        reqDate:    "",
        status:     "",
        updateDate:     "",
        updateUser:     "",
      }

      project: any ={
        coverage: "",
        createDate: "",
        createUser: "",
        duration: "",
        ipl: "",
        noClaimPd: "",
        objectDesc: "",
        objectId: "",
        pctShare: "",
        pctShareI: "",
        projDesc: "",
        projId: "",
        quoteId: "",
        riskId: "",
        riskName: "",
        site: "",
        testing: "",
        timeExc: "",
        totalSi: "",
        totalSiI: "",
        totalValue: "",
        updateDate: "",
        updateUser: "",
      }

      ngOnInit() {
        this.titleService.setTitle("Quo | Quotation to Hold Cover");
        this.holdCoverInfo = new HoldCoverInfo();
        //this.holdCover.status = "I";
        this.holdCover.preparedBy = JSON.parse(window.localStorage.currentUser).username;
        this.btnApprovalEnabled = false;
      }

      formatDate(date){
        return new Date(date[0] + "/" + date[1] + "/" + date[2]).toISOString();
      }

      sliceQuoteNo(qNo: string){
        var qArr = qNo.split("-");
        this.qLine = qArr[0];
        this.qYear = qArr[1];
        this.qSeqNo = qArr[2];
        this.qRevNo = qArr[3];
        this.qCedingId = qArr[4];        
      }


      splitHcNo(hcNo: string){
        var hcArr = hcNo.split("-");
        this.hcLine = hcArr[1];
        this.hcYear = hcArr[2];
        this.hcSeqNo = hcArr[3];
        this.hcRevNo = hcArr[4];        
      }

      search() {
        // this.loading = true;
        this.passDataQuoteLOV.tableData = [];
        this.quotationService.getQuoProcessingData([])
        .subscribe(val => {
          var records = val['quotationList'];
          for(let rec of records){
            if(rec.status === 'Issued' || rec.status === 'ISSUED' || rec.status === 'issued'){
              this.passDataQuoteLOV.tableData.push({
                quotationNo: rec.quotationNo,
                cedingName:  rec.cedingName,
                insuredDesc: rec.insuredDesc,
                riskName: (rec.project == null) ? '' : rec.project.riskName
              });
              // this.loading = false;

            }

          }
          this.table.refreshTable();
        });

        var qLine = this.quoteLine.toUpperCase();

        if (qLine === '' ||
          qLine === 'EAR' ||
          qLine === 'EEI' ||
          qLine === 'CEC' ||
          qLine === 'MBI' ||
          qLine === 'BPV' ||
          qLine === 'MLP' ||
          qLine === 'DOS') {

          $('#lovMdl > #modalBtn').trigger('click');
      }

    }

    onRowClick(event){
      this.rowRec = event;
    }

    onSaveClickLOV(){

      this.sliceQuoteNo(this.rowRec.quotationNo);
      this.quoteNo = this.rowRec.quotationNo;
      if(this.quoteNo != null || this.quoteNo != undefined || this.quoteNo != ''){
      }

      this.modalService.dismissAll();
      this.btnApprovalEnabled = false;

      this.holdCover.reqDate  = new Date().toISOString();
      this.quotationService.getSelectedQuotationHoldCoverInfo(this.plainQuotationNo(this.quoteNo))
      .subscribe(data => {
        this.insured = this.rowRec.insuredDesc;
        this.cedCo = this.rowRec.cedingName;
        this.risk = this.rowRec.riskName;
        this.hcLine  = this.qLine;
        this.hcYear  =  String(new Date().getFullYear());

        if(data['quotationList'][0] === null || data['quotationList'][0] === undefined || data['quotationList'][0] === ''){ 
          this.holdCover.holdCoverId = '';
          this.hcLine  = '';
          this.hcYear  =  '';
          this.hcSeqNo = '';
          this.hcRevNo = '';
          this.holdCover.periodFrom = '';
          this.holdCover.periodTo = '';
          this.holdCover.compRefHoldCovNo = '';
          this.holdCover.status = '';
          this.holdCover.reqBy = '';
          this.holdCover.reqDate = '';
          this.holdCover.preparedBy = '';
          this.holdCover.approvedBy = '';
        }else{
          var rec = data['quotationList'][0].holdCover;
          this.holdCover.holdCoverNo = rec.holdCoverNo;
          this.splitHcNo(rec.holdCoverNo);
          console.log(" else laman ng servce " + rec.holdCoverNo)
          this.holdCover.periodFrom = this.formatDate(rec.periodFrom);
          this.holdCover.periodTo = this.formatDate(rec.periodTo);
          this.holdCover.compRefHoldCovNo = rec.compRefHoldCovNo;
          this.holdCover.reqBy  = rec.reqBy;
          this.holdCover.reqDate  = this.formatDate(rec.reqDate);
          this.holdCover.status  = rec.status;
          this.holdCover.approvedBy =  rec.approvedBy;
          this.holdCover.holdCoverId = rec.holdCoverId;
          this.holdCover.updateUser = JSON.parse(window.localStorage.currentUser).username;
          this.holdCover.preparedBy = JSON.parse(window.localStorage.currentUser).username;
          this.holdCover.createDate = this.formatDate(rec.createDate);
          this.holdCover.createUser = rec.createUser;

          if(rec.approvedBy === '' || rec.approvedBy === null ||  rec.approvedBy === undefined){
            this.clickView = false;

          }else{
            $('#modifMdl > #modalBtn').trigger('click');

          }
        }

      });
    }

    holdCoverReq:any
    onSaveClick(){
      if(this.quoteNo === '' || this.quoteNo === null || this.quoteNo === undefined ||
        this.holdCover.periodFrom === '' || this.holdCover.periodFrom === null || this.holdCover.periodFrom === undefined ||
        this.holdCover.periodTo === '' || this.holdCover.periodTo === null || this.holdCover.periodTo === undefined){

        this.dialogIcon = 'error';
      this.dialogMessage = 'Please complete all the required fields.';
      $('app-sucess-dialog #modalBtn').trigger('click');
      setTimeout(()=>{$('.globalLoading').css('display','none');},0);
      $('.warn').focus();
      $('.warn').blur();
    }else{
      //this.loading = true;
      console.log( 'before service hc req   ' + this.hcRevNo);
      this.quotationService.getQuoteGenInfo('',this.plainQuotationNo(this.quoteNo))
      .subscribe(val => {
        this.quoteId = val['quotationGeneralInfo'].quoteId;

        this.holdCoverReq = {
          "approvedBy": this.holdCover.approvedBy,
          "compRefHoldCovNo": this.holdCover.compRefHoldCovNo,
          "createDate": (this.holdCover.createDate === null || this.holdCover.createDate === '' || this.holdCover.createDate === undefined) ? new Date().toISOString() : this.holdCover.createDate,
          "createUser": (this.holdCover.createUser === null || this.holdCover.createUser === '' || this.holdCover.createUser === undefined) ? JSON.parse(window.localStorage.currentUser).username : this.holdCover.createUser,
          "holdCoverId": this.holdCover.holdCoverId,
          "holdCoverRevNo": this.hcRevNo,
          "holdCoverSeqNo": this.hcSeqNo,
          "holdCoverYear": (this.hcYear === null || this.hcYear === '' || this.hcYear === undefined) ? String(new Date().getFullYear()) : this.hcYear,
          "lineCd": (this.hcLine === null || this.hcLine === '' || this.hcLine === undefined) ? this.qLine : this.hcLine,
          "periodFrom": this.holdCover.periodFrom,
          "periodTo": this.holdCover.periodTo,
          "preparedBy": this.holdCover.preparedBy,
          "quoteId": this.quoteId,
          "reqBy": this.holdCover.reqBy,
          "reqDate": (this.holdCover.reqDate === null || this.holdCover.reqDate === '' || this.holdCover.reqDate === undefined) ? new Date().toISOString() :this.holdCover.reqDate,
          "status": (this.holdCover.status === null || this.holdCover.status === '') ? 'I' : this.holdCover.status.substring(0,1),
          "updateDate": new Date().toISOString(),
          "updateUser": (this.holdCover.preparedBy === null || this.holdCover.preparedBy === '') ? JSON.parse(window.localStorage.currentUser).username : this.holdCover.preparedBy
        }
        console.log( 'after hc req   ' + this.hcRevNo);

        console.log(JSON.stringify(this.holdCoverReq));
        this.quotationService.saveQuoteHoldCover(
          JSON.stringify(this.holdCoverReq)
          ).subscribe(data => {
            var returnCode = data['returnCode'];
            if(returnCode === 0){
              this.dialogIcon = 'error';
              this.dialogMessage = 'Data insertion error.';
              $('app-sucess-dialog #modalBtn').trigger('click');
              setTimeout(()=>{$('.globalLoading').css('display','none');},0);
              $('.warn').focus();
              $('.warn').blur();
            }else{
              //this.loading = false;
              this.dialogIcon = '';
              this.dialogMessage = '';
              $('app-sucess-dialog #modalBtn').trigger('click');
              this.btnApprovalEnabled = true;
              this.quotationService.getSelectedQuotationHoldCoverInfo(this.plainQuotationNo(this.quoteNo))
              .subscribe(data => {
                var rec = data['quotationList'][0].holdCover;
                console.log("qwerty   " + rec.holdCoverNo);
                this.splitHcNo(rec.holdCoverNo);
                this.holdCover.status = rec.status;
                this.holdCover.holdCoverId = rec.holdCoverId;

                if(this.btnCancelMainEnabled === true){
                  this.location.back();
                }  

                //changing status of prev hold cover to replaced
                // if(this.clickModif === true){

                  // }
                });
            }
          });

        });
      // }
    }

  }

  plainQuotationNo(data: string){
    var arr = data.split('-');
    return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
  }

  setPeriodTo(periodFrom){
    try{
      var d = new Date(periodFrom);
      d.setDate(d.getDate()+30);
      this.holdCover.periodTo = d.toISOString();
      this.holdCover.periodFrom = periodFrom;
    }catch(Exception){
    }
  }

  searchQuoteInfo(line,year,seq,rev,ced){
    this.holdCover.reqDate  = new Date().toISOString();
    var qNo = line.toUpperCase() +"-"+year+"-"+seq+"-"+rev+"-"+ced;
    // this.quotationService.getSelectedQuote(this.plainQuotationNo(qNo))
    // .subscribe(val => {

      //   var data = val['quotationList'][0];
      //   if(data === undefined || data === null){
        //     this.quoteNo = '';
        //     this.insured = '';
        //     this.cedCo = '';
        //     this.risk = '';
        //     this.hcLine  = '';
        //     this.hcYear  =  '';
        //   }else{
          //     if(data.status === 'Issued' || data.status === 'issued'){
            //       this.quoteNo = (data.quotationNo === null || data.quotationNo === undefined) ? '' : data.quotationNo;
            //       this.insured = (data.insuredDesc  === null || data.insuredDesc === undefined) ? '' : data.insuredDesc;
            //       this.cedCo = (data.cedingName  === null || data.cedingName === undefined) ? '' : data.cedingName;
            //       this.risk = (data.project  === null || data.project === undefined) ? '' : data.project.riskName;
            //       this.hcLine  = line;
            //       this.hcYear  =  year;
            //     }
            //   }
            // });


            ///////



            try{
              this.btnApprovalEnabled = false;
              this.quotationService.getSelectedQuotationHoldCoverInfo(this.plainQuotationNo(qNo))
              .subscribe(data => {

                if(data['quotationList'][0] === null || data['quotationList'][0] === undefined || data['quotationList'][0] === ''){
                  this.holdCover.holdCoverId = '';
                  this.hcLine  = '';
                  this.hcYear  =  '';
                  this.hcSeqNo = '';
                  this.hcRevNo = '';
                  this.holdCover.periodFrom = '';
                  this.holdCover.periodTo = '';
                  this.holdCover.compRefHoldCovNo = '';
                  this.holdCover.status = '';
                  this.holdCover.reqBy = '';
                  this.holdCover.reqDate = '';
                  this.holdCover.preparedBy = '';
                  this.holdCover.approvedBy = '';

                }else{
                  var rec = data['quotationList'][0].holdCover;
                  this.quoteNo = (data['quotationList'][0].quotationNo === null || data['quotationList'][0].quotationNo === undefined) ? '' : data['quotationList'][0].quotationNo;
                  this.sliceQuoteNo(this.quoteNo);
                  this.insured = (data['quotationList'][0].insuredDesc  === null || data['quotationList'][0].insuredDesc === undefined) ? '' : data['quotationList'][0].insuredDesc;
                  this.cedCo = (data['quotationList'][0].cedingName  === null || data['quotationList'][0].cedingName === undefined) ? '' : data['quotationList'][0].cedingName;
                  this.risk = (data['quotationList'][0].project  === null || data['quotationList'][0].project === undefined) ? '' : data['quotationList'][0].project.riskName;
                  this.holdCover.holdCoverNo = rec.holdCoverNo;
                  this.splitHcNo(rec.holdCoverNo);
                  console.log(" else laman ng servce " + rec.holdCoverNo)
                  this.holdCover.periodFrom = this.formatDate(rec.periodFrom);
                  this.holdCover.periodTo = this.formatDate(rec.periodTo);
                  this.holdCover.compRefHoldCovNo = rec.compRefHoldCovNo;
                  this.holdCover.reqBy  = rec.reqBy;
                  this.holdCover.reqDate  = this.formatDate(rec.reqDate);
                  this.holdCover.status  = rec.status;
                  this.holdCover.approvedBy =  rec.approvedBy;
                  this.holdCover.holdCoverId = rec.holdCoverId;
                  this.holdCover.updateUser = JSON.parse(window.localStorage.currentUser).username;
                  this.holdCover.preparedBy = JSON.parse(window.localStorage.currentUser).username;
                  this.holdCover.createDate = this.formatDate(rec.createDate);
                  this.holdCover.createUser = rec.createUser;

                  if(rec.approvedBy === '' || rec.approvedBy === null ||  rec.approvedBy === undefined){
                    this.clickView = false;

                  }else{
                    $('#modifMdl > #modalBtn').trigger('click');

                  }
                }
              });
            }catch(Exception){
            }



          }


          onClickView(){
            this.modalService.dismissAll();
            this.clickView = true;
          }

          onClickModif(){
            this.modalService.dismissAll();
            this.clickView = false;
            this.clickModif = true;
          }

          onClickCancelModifMdl(){
            this.modalService.dismissAll();
            this.clearAll();
          }

          onClickCancelQuoteLOV(){
            this.modalService.dismissAll();
            //this.loading = false;
          }

          onClickCancel(){
            this.btnCancelMainEnabled = true;
            $('#confirm-save #modalBtn2').trigger('click');
          }

          clearAll(){
            this.quoteNo = '';
            this.qLine = '';
            this.qYear = '';
            this.qSeqNo = '';
            this.qRevNo = '';
            this.qCedingId ='';
            this.insured = '';
            this.cedCo = '';
            this.risk = '';
            this.hcLine  = '';
            this.hcYear  =  '';
            this.hcSeqNo = '';
            this.hcRevNo ='';
            this.holdCover.periodFrom = '';
            this.holdCover.periodTo = '';
            this.holdCover.compRefHoldCovNo = '';
            this.holdCover.status = '';
            this.holdCover.reqBy = '';
            this.holdCover.reqDate = '';
            this.holdCover.preparedBy = '';
            this.holdCover.approvedBy = '';
          }

          // updatePrevStats(rec){
            //   this.quotationService.saveQuoteHoldCover(JSON.stringify(this.holdCoverReq)).subscribe(data => {console.log(data);});
            // }
            onClickSave(){
              $('#confirm-save #modalBtn2').trigger('click');
            }

            onClickApprovalBtnMdl(){
              $('#approvalBtnMdl #modalBtn').trigger('click');
            }

          }
