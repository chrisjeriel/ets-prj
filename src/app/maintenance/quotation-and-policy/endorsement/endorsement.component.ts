import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-endorsement',
  templateUrl: './endorsement.component.html',
  styleUrls: ['./endorsement.component.css']
})
export class EndorsementComponent implements OnInit, AfterViewInit {
  formGroup: FormGroup = new FormGroup({});
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild("endtTable") endtTable: CustEditableNonDatatableComponent;
  @ViewChild("dedTable") dedTable: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;


  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  dialogIcon:string = '';
  dialogMessage: string = '';

  line:any = {
    lineCd:'',
    description:'',
  }

  info:any = {
    createUser : '',
    createDate : '',
    updateUser : '',
    updateDate : '',
  }

  passEndtTable:any={
    tableData:[],
    widths:[1,'auto','auto','auto',1,1,'auto'],
    tHeader:['Endt Code','Endt Name','Description','Wordings','Active','Default','Remarks'],
    dataTypes:['sequence-3','text','text-editor-h','text-editor-h','checkbox','checkbox','text'],
    keys:['endtCd','endtTitle','description','text','activeTag','defaultTag','remarks'],
    addFlag: true,
    genericBtn:'Delete',
    paginateFlag:true,
    infoFlag:true,
    searchFlag:true,
    pageLength: 10,
    pageId: 'endt',
    nData:{
      "lineCd": "",
      "lineDesc": "",
      "endtCd": "",
      "endtTitle": "",
      "description": "",
      "text":'',
      "defaultTag": "N",
      "activeTag": "Y",
      "endtText01": "",
      "endtText02": null,
      "endtText03": null,
      "endtText04": null,
      "endtText05": null,
      "endtText06": null,
      "endtText07": null,
      "endtText08": null,
      "endtText09": null,
      "endtText10": null,
      "endtText11": null,
      "endtText12": null,
      "endtText13": null,
      "endtText14": null,
      "endtText15": null,
      "endtText16": null,
      "endtText17": null,
      "remarks": null,
      "createUser": this.ns.getCurrentUser(),
      "createDate": 0,
      "updateUser": this.ns.getCurrentUser(),
      "updateDate": 0,
      deductibles: []
    },
    disableGeneric : true,
    disableAdd : true
  }

  passDedTable: any = {
        tableData            : [],
        tHeader              : ['Deductible', 'Title', 'Deductible Type','Deductible Amount','Rate','Minimum Amount','Maximum Amount','Deductible Text','Active','Default','Remarks'],
        dataTypes            : ['text','text','select','currency','percent','currency','currency','text','checkbox','checkbox','text'],
        nData:
        {
          "activeTag": "Y",
          "deductibleCd": "",
          "coverCd": 0,
          "endtCd": "",
          "defaultTag": "N",
          "deductibleTitle": "",
          "deductibleType": "F",
          "typeDesc": "",
          "deductibleRate": '',
          "deductibleAmt": '',
          "lineCd": "",
          "minAmt": '',
          "maxAmt": '',
          "deductibleText": '',
          "remarks": '',
          "createUser": this.ns.getCurrentUser(),
          "createDate": 0,
          "updateUser": "this.ns.getCurrentUser()",
          "updateDate": 0
        }
        ,
        opts: [{
            selector        : 'deductibleType',
            prev            : [],
            vals            : [],
        }],
        paginateFlag        : true,
        infoFlag            : true,
        searchFlag          : true,
        pageLength          : 5,
        addFlag             : true,
        keys                : ['deductibleCd','deductibleTitle','deductibleType','deductibleAmt','deductibleRate','minAmt','maxAmt','deductibleText','activeTag','defaultTag','remarks'],
        uneditable          : [false,false,false,false,false,false,false,false,false,false],
        pageID              : 'mtn-deductibles',
        widths              : [1,'auto','auto','auto','auto','auto','auto','auto','auto','auto'],
        genericBtn: 'Delete',
      disableGeneric : true,
      disableAdd : true


    };

  fromChng:boolean;
  cancelFlag:boolean;
  exitUrl:string = '/maintenance-qu-pol';
  newLineEv: string;

  constructor(private ns: NotesService, private ms: MaintenanceService) { }

  ngAfterViewInit() {
      this.dedTable.loadingFlag = false;
      this.endtTable.loadingFlag = false;
      this.dedTable.form.forEach((f,i)=>{
        this.formGroup.addControl('dedTable'+i, f.control); 
      })
      this.endtTable.form.forEach((f,i)=>{
        this.formGroup.addControl('endtTable'+i, f.control); 
      }) 
  }



  ngOnInit() {
    //setTimeout(a=>{this.endtTable.refreshTable();this.dedTable.refreshTable();},0);

    this.ms.getRefCode('MTN_DEDUCTIBLES.DEDUCTIBLE_TYPE')
            .subscribe(data =>{
                this.passDedTable.opts[0].vals = [];
                this.passDedTable.opts[0].prev = [];
                var rec = data['refCodeList'];
                for(let i of rec){
                    this.passDedTable.opts[0].vals.push(i.code);
                    this.passDedTable.opts[0].prev.push(i.description);
                }
    });
  }

  checkCode(ev,force?){

    this.ns.lovLoader(ev, 1);
    this.lineLov.checkCode(ev.target.value.toUpperCase(), ev); 


     // this.newLineEv = ev;
     // console.log(ev)
     // if($('.ng-dirty:not([type="search"])').length == 0 || force !=undefined){
     //    if(ev.target.value == null || ev.target.value.toUpperCase() == ''){
     //      this.line.description = '';
     //      this.passEndtTable.disableAdd = true;
     //      this.passEndtTable.disableGeneric = true;
     //      this.passEndtTable.tableData = [];
     //      this.endtTable.refreshTable();

     //      this.passDedTable.disableAdd = true;
     //      this.passDedTable.disableGeneric = true;
     //      this.passDedTable.tableData = [];
     //      this.dedTable.refreshTable();
     //    }else{
     //      this.ns.lovLoader(ev, 1);
     //      this.lineLov.checkCode(ev.target.value.toUpperCase(), ev); 
     //    }
     //    this.fromChng = false;
     //  }else{
     //    this.exitUrl = null;
     //    this.cnclBtn.clickCancel();
     //    this.fromChng = true;
     //  }
  }

  setLine(data){
      this.ns.lovLoader(data.ev, 0);
      if(data.lineCd.length != 0){
        this.line.lineCd = data.lineCd;
        this.passEndtTable.nData.lineCd = data.lineCd;
        this.passDedTable.nData.lineCd = data.lineCd;
        this.line.description = data.description;
        this.getMtnEndorsements();
      }
      else{
        this.line.lineCd = '';
        this.line.description = '';
        this.passEndtTable.disableAdd = true;
        this.passEndtTable.disableGeneric = true;
        this.passEndtTable.tableData = [];
        this.endtTable.refreshTable();

        this.passDedTable.disableAdd = true;
        this.passDedTable.disableGeneric = true;
        this.passDedTable.tableData = [];
        this.dedTable.refreshTable();
      }
      this.exitUrl = '/maintenance-qu-pol';
    
  }

  getMtnEndorsements(){
    this.endtTable.loadingFlag = true;
      this.ms.getEndtCode(this.line.lineCd.trim(),'').subscribe(a=>{
        this.passEndtTable.disableAdd = false;
        this.passEndtTable.tableData = a['endtCode'];
        this.passEndtTable.tableData.forEach(a=>{{
          a.endtCd = String(a.endtCd).padStart(3,'0')
          a['text'] = (a.endtText01 === null ? '' :a.endtText01) +
                         (a.endtText02 === null ? '' :a.endtText02) +
                         (a.endtText03 === null ? '' :a.endtText03) +
                         (a.endtText04 === null ? '' :a.endtText04) +
                         (a.endtText05 === null ? '' :a.endtText05) +
                         (a.endtText06 === null ? '' :a.endtText06) +
                         (a.endtText07 === null ? '' :a.endtText07) +
                         (a.endtText08 === null ? '' :a.endtText08) +
                         (a.endtText09 === null ? '' :a.endtText09) +
                         (a.endtText10 === null ? '' :a.endtText10) +
                         (a.endtText11 === null ? '' :a.endtText11) +
                         (a.endtText12 === null ? '' :a.endtText12) +
                         (a.endtText13 === null ? '' :a.endtText13) +
                         (a.endtText14 === null ? '' :a.endtText14) +
                         (a.endtText15 === null ? '' :a.endtText15) +
                         (a.endtText16 === null ? '' :a.endtText16) +
                         (a.endtText17 === null ? '' :a.endtText17) ;
        a.deductibles = a.deductibles.filter(b=>b.deductibleCd != null)
        a.uneditable = ['endtCd']
        }})
        this.endtClick(null);
        this.endtTable.markAsPristine();
        this.endtTable.refreshTable();
        this.dedTable.markAsPristine();
      })
  }

  deleteEndt(){
    if(this.endtTable.indvSelect.okDelete == 'N'){
      this.dialogIcon = 'info';
      this.dialogMessage =  'You are not allowed to delete an Endorsement that is already used in quotation processing.';
      this.successDialog.open();
    }else{
      //this.passEndtTable.disableGeneric = true;
      this.passDedTable.disableGeneric = true;
      this.passDedTable.disableAdd = true;
      this.passDedTable.tableData = [];
      this.dedTable.refreshTable();
      this.endtTable.selected  = [this.endtTable.indvSelect]
      this.endtTable.confirmDelete();
    }
  }

  deleteDed(){
    if(this.dedTable.indvSelect.okDelete == 'N'){
      this.dialogIcon = 'info';
      this.dialogMessage =  'You are not allowed to delete a Deductible that is already used in quotation processing.';
      this.successDialog.open();
    }else{
      this.dedTable.selected  = [this.dedTable.indvSelect]
      this.dedTable.confirmDelete();
    }
  }

  endtClick(data){
    if(data != null){
      this.passDedTable.tableData = data.deductibles;
      this.passDedTable.disableAdd = false;
      this.passDedTable.disableGeneric = true;
      this.passDedTable.nData.endtCd = data.endtCd;
      this.passEndtTable.disableGeneric = false;
      this.disableFields();
      this.info = data;
    }else{
      this.passEndtTable.disableGeneric = true;
      this.passDedTable.disableAdd = true;
      this.passDedTable.disableGeneric = true;
      this.passDedTable.tableData = [];
      this.info = {
        createUser : '',
        createDate : '',
        updateUser : '',
        updateDate : '',
      }
    }
    this.dedTable.refreshTable();
  }

  disableFields(){
    // 'deductibleAmt','deductibleRate','minAmt','maxAmt'
    this.passDedTable.tableData.forEach(a=>{
      if(a.deductibleType == 'F'){
        a.uneditable = ['deductibleRate','minAmt','maxAmt','deductibleCd'];
        a.uneditable.forEach((b,i)=>{
          if(i != a.uneditable.length-1)
            a[b] = '';
        })
      }else{
        a.uneditable = ['deductibleAmt','deductibleCd'];
        a.uneditable.forEach((b,i)=>{
          if(i != a.uneditable.length-1)
            a[b] = '';
        })
      }

      if(a.add){
        a.uneditable.pop();
      }
    })
  }

  endtTextKeys:string[] = ['endtText01','endtText02','endtText03','endtText04','endtText05','endtText06','endtText07','endtText08','endtText09','endtText10','endtText11','endtText12','endtText13','endtText14','endtText15','endtText16','endtText17'];
  
  save(can?){
    this.cancelFlag = can !== undefined;
    let params : any = {
      saveEndorsement : [],
      delEndorsement :[],
      saveDeductibles:[],
      deleteDeductibles:[]
    }

    for(let endt of this.passEndtTable.tableData){
      if(endt.edited && !endt.deleted){
        let endtTextSplit = endt.text.match(/(.|[\r\n]){1,1500}/g);
            if(endtTextSplit!== null)
                for (var i = 0; i < endtTextSplit.length; ++i) {
                    endt[this.endtTextKeys[i]] = endtTextSplit[i];
            }
            endt.updateDate = this.ns.toDateTimeString(0);
            endt.createDate = this.ns.toDateTimeString(endt.createDate);
            endt.updateUser = this.ns.getCurrentUser();
            params.saveEndorsement.push(endt);
      }

      // if(!endt.deleted){
      //   let endtTextSplit = endt.text.match(/(.|[\r\n]){1,2000}/g);
    //         if(endtTextSplit!== null)
    //             for (var i = 0; i < endtTextSplit.length; ++i) {
    //                 endt[this.endtTextKeys[i]] = endtTextSplit[i];
    //         }
    //         endt.updateDate = this.ns.toDateTimeString(0);
    //         endt.createDate = this.ns.toDateTimeString(endt.createDate);
    //         endt.updateUser = this.ns.getCurrentUser();
    //         params.saveEndorsement.push(endt);
      // }

      for(let ded of endt.deductibles){
        if(ded.edited && !ded.deleted){
          ded.updateDate = this.ns.toDateTimeString(0);
              ded.createDate = this.ns.toDateTimeString(ded.createDate);
              ded.updateUser = this.ns.getCurrentUser();
              ded.endtCd = endt.endtCd;
              params.saveDeductibles.push(ded);
        }else if(ded.deleted){
          params.deleteDeductibles.push(ded);
        }
      }

    }
    params.delEndorsement = this.passEndtTable.tableData.filter(a=>a.deleted);


    this.ms.saveMtnEndt(params).subscribe(a=>{
      if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            this.getMtnEndorsements();
            this.endtTable.markAsPristine();
            this.dedTable.markAsPristine();
            if(this.fromChng){
              this.checkCode(this.newLineEv,'force')
            }
        }else{
            this.cancelFlag = false;
            this.dialogIcon = "error";
            this.successDialog.open();
            this.fromChng = false;
            this.line.lineCd = this.line.lineCd.trim();
            this.line.lineCd = this.line.lineCd.toString()+' '
        }
    })

  }

  onClickSave(){

    let endtCds:string[] = this.passEndtTable.tableData.filter(a=>!a.deleted).map(a=>String(a.endtCd).padStart(3,'0'));

    if(endtCds.some((a,i)=>{
      if(endtCds.indexOf(a) != i)
      return endtCds.indexOf(a) != i;
    })){
      this.dialogMessage = 'Unable to save the record. Endt Code must be unique per Line';
      this.dialogIcon = 'error-message';
      this.successDialog.open();
      return;
    }
    let dedCds : string[];
    for(let endt of this.passEndtTable.tableData){
      dedCds = endt.deductibles.filter(a=>!a.deleted).map(a=>a.deductibleCd);
    // if(endt.deductibles.some(ded=>(ded.deductibleType == 'F' && !(parseFloat(ded.deductibleAmt)>0))|| ded.deductibleType != 'F' && !(parseFloat(ded.deductibleRate)>0))){
    //     this.dialogIcon = "error";
    //     this.successDialog.open();
    //     return;
    // }

      if(dedCds.some((a,i)=>dedCds.indexOf(a) != i)){
        this.dialogMessage = 'Unable to save the record. Deductible Code must be unique per Endorsement';
        this.dialogIcon = 'error-message';
        this.successDialog.open();
        this.endtTable.markAsPristine();
        this.dedTable.markAsPristine();
        return;
      }
    }
    this.conSave.confirmModal();
  }

  onClickCancel(){
    this.cnclBtn.clickCancel();
  }

  showLineLOV(){
    $('#lineLOV #modalBtn').trigger('click');
  }

  dedClick(data){
    this.passDedTable.disableGeneric = data==null;
  }

}
