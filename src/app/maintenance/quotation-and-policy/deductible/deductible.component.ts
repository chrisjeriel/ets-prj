import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';
import { NgbModal,NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-deductible',
    templateUrl: './deductible.component.html',
    styleUrls: ['./deductible.component.css'],
    providers: [NgbDropdownConfig]
})
export class DeductibleComponent implements OnInit {
    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    @ViewChild(MtnLineComponent) lineLov : MtnLineComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild(ConfirmSaveComponent) cs : ConfirmSaveComponent;
    @ViewChild('tabset') tabset: any;


    passData: any = {
        tableData            : [],
        tHeader              : ['Deductible', 'Title', 'Deductible Type','Deductible Amount','Rate','Minimum Amount','Maximum Amount','Deductible Text','Section Cover','Endorsement','Active','Default','Remarks'],
        dataTypes            : ['pk-cap','text','select','currency','percent','currency','currency','text','text','text','checkbox','checkbox','text'],
        nData:
        {
            newRec            : 1,
            deductibleCd      : '',
            deductibleTitle   : '',
            deductibleType    : 'F',
            deductibleAmt     : '',
            deductibleRate    : '',
            minAmt            : '',
            maxAmt            : '',
            deductibleText    : '',
            sectionCover      : 'Policy Level',
            endorsement       : 'Policy Level',
            activeTag         : 'Y',
            defaultTag        : 'N',
            remarks           : '',
            isNew             : true,
            lineCd            : '',
            coverCd           : '',
            endtCd            : ''
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
        pageLength          : 10,
        addFlag             : true,
        genericBtn          :'Delete',
        disableGeneric      : true,
        disableAdd          : true,  
        keys                : ['deductibleCd','deductibleTitle','deductibleType','deductibleAmt','deductibleRate','minAmt','maxAmt','deductibleText','sectionCover','endorsement','activeTag','defaultTag','remarks'],
        uneditable          : [false,false,false,false,false,false,false,false,true,true,false,false,false],
        pageID              : 'mtn-deductibles',
        mask: {
            deductibleCd: 'AAAAAAA'
        },
        widths              : ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto']

    };
    data: any;
    deductiblesData : any = {
        updateDate : null,
        updateUser : null,
        createDate : null,
        createUser : null,
    };
    line                : string;
    description         : string;
    cancelFlag          : boolean;
    dialogIcon          : string;
    dialogMessage       : string;
    successMessage      : string  = environment.successMessage;
    warnMsg             : string  = '';
    firstLoading        : boolean;
    passEvent           : any;
    changeLine          : boolean;
    tempLineCd          : string = '';

    params : any =    {
        saveDeductibles    : [],
        deleteDeductibles  : []
    };

    constructor(config: NgbDropdownConfig,private titleService: Title, private mtnService: MaintenanceService, private ns : NotesService, private modalService: NgbModal ) { }

    ngOnInit() {
        this.titleService.setTitle('Mtn | Deductibles');
        this.firstLoading = true;
    }

    getMtnDeductibles(){
        this.table.overlayLoader = true;

        if(this.line === '' || this.line === null){
           this.clearTbl();
        }else{
            this.deductiblesData.createUser = '';
            this.deductiblesData.createDate = '';
            this.deductiblesData.updateDate = '';
            this.deductiblesData.updateUser = '';

            this.passData.opts[0].vals = [];
            this.passData.opts[0].prev = [];

            var subs = forkJoin(this.mtnService.getMtnDeductibles(this.line.toUpperCase(),'','',''),
                                this.mtnService.getRefCode('MTN_DEDUCTIBLES.DEDUCTIBLE_TYPE')).pipe(map(([ded, ref]) => { return { ded, ref }; }));

            subs.subscribe(data => {
                console.log(data);
                this.passData.opts[0].vals = [];
                this.passData.opts[0].prev = [];

                var refRec = data['ref']['refCodeList'];
                this.passData.opts[0].vals = refRec.map(i => i.code);
                this.passData.opts[0].prev = refRec.map(i => i.description);

                this.passData.tableData  = [];

                var dedRec = data['ded']['deductibles'].map(a => { 
                    a.createDate     = this.ns.toDateTimeString(a.createDate); 
                    a.updateDate     = this.ns.toDateTimeString(a.updateDate);
                    a.endorsement    = (a.coverCd != 0 && a.endtCd == 0)?'':a.endorsement;
                    a.sectionCover   = (a.coverCd == 0 && a.endtCd != 0)?'':a.sectionCover;
                    return a;
                });
                this.passData.tableData  = dedRec;
                this.table.refreshTable();
                this.table.onRowClick(null, this.passData.tableData[0]);
                this.passData.disableAdd = false;
                this.dedType();
            });
        }
        this.tempLineCd = this.line.toUpperCase();
    }

    onSaveMtnDeductibles(){

        console.log(this.changeLine);
        console.log(this.tempLineCd + ' tempLineCd');

        if(this.changeLine){
            this.params.saveDeductibles.map(i => i.lineCd = this.tempLineCd );
            this.params.deleteDeductibles.map(i => i.lineCd = this.tempLineCd );
        }

        console.log(JSON.stringify(this.params));

        this.mtnService.saveMtnDeductibles(JSON.stringify(this.params))
        .subscribe(data => {
            console.log(data);
            this.getMtnDeductibles();
            $('app-sucess-dialog #modalBtn').trigger('click');
            this.params.saveDeductibles  = [];
            this.params.deleteDeductibles  = [];
            this.passData.disableGeneric = true;
        });
    }

    onDeleteDeductibles(){
        if(this.table.indvSelect.okDelete == 'N'){
            this.warnMsg = 'You are not allowed to delete a Deductibles that is already used in quotation processing.';
            this.showWarnLov();
        }else{
            this.table.selected  = [this.table.indvSelect];
            this.table.indvSelect.deleted = true;
            var i = this.table.selected[0];
            console.log(i);
            if(i.deductibleCd == '' && i.deductibleTitle == '' && (i.deductibleType == 'F' && (i.deductibleAmt == '' || isNaN(i.deductibleAmt))) &&
               i.deductibleText == '' && i.activeTag == 'Y' && i.defaultTag == 'N' && i.remarks == '' 
            ){
               this.table.onClickDelete('force');
               $('.ng-dirty').removeClass('ng-dirty');
               this.passData.disableGeneric=true;
            }else{
               this.table.confirmDelete();
            }
        }
    }
    

    showWarnLov(){
        $('#warnMdl > #modalBtn').trigger('click');
    }

    showLineLOV(){
        $('#lineLOV #modalBtn').trigger('click');
    }

    setLine(data){
        console.log(data);
        console.log('setLine');
        console.log($('.ng-dirty').length);
        this.line = data.lineCd;
        this.description = data.description;
        this.ns.lovLoader(data.ev, 0);
        this.firstLoading = false;

        // if($('.ng-dirty').length != 0){
        //     this.changeLine = true;
        //     this.cancel();
        // }else{
        //     this.changeLine = false;
            this.getMtnDeductibles();
        //}
    }

    checkCode(ev){
        console.log('checkCode');
        this.passEvent = ev;
        if(this.firstLoading == true){
            this.ns.lovLoader(ev, 1);
            this.lineLov.checkCode(this.line.toUpperCase(), ev);
            $('.ng-dirty').removeClass('ng-dirty');   
        }else{
            console.log('else at checkCode');
            if($('.ng-dirty').length != 0){
                this.changeLine = true;
                this.cancel();
            }else{
                console.log('2nd else at checkCode');
                this.changeLine = false;
                this.ns.lovLoader(ev, 1);
                this.lineLov.checkCode(this.line.toUpperCase(), ev);
            }
        }
    }

    clickRow(event){
        if(event !== null){
            this.deductiblesData.createUser = event.createUser;
            this.deductiblesData.createDate = event.createDate;
            this.deductiblesData.updateDate = event.updateDate;
            this.deductiblesData.updateUser = event.updateUser;
            this.passData.disableGeneric    = false;
            if(event.deductibleType == 'F'){
                event.deductibleRate = '';
                event.minAmt         = '';
                event.maxAmt         = '';
            }else{
                event.deductibleAmt  = '';
            }
        }else{
            this.deductiblesData.createUser = '';
            this.deductiblesData.createDate = '';
            this.deductiblesData.updateDate = '';
            this.deductiblesData.updateUser = '';
            this.passData.disableGeneric    = true;
        }
    }

    clearTbl(){
        this.passData.disableGeneric = true;
        this.passData.disableAdd     = true;
        this.passData.tableData      = [];
        this.table.refreshTable();
    }

    cancel(){
        this.cancelBtn.clickCancel();
    }

    onClickSave(cancelFlag?){
        this.cancelFlag = cancelFlag !== undefined;
        this.dialogIcon = '';
        this.dialogMessage = '';

        var isEmpty = 0;
        var isNotUnique : boolean ;
        var saveDed = this.passData.tableData.filter(i => i.isNew == true);

        console.log(this.changeLine + ' change line');

        for(let record of this.passData.tableData){
            record.lineCd  = this.line.toUpperCase();
            if(record.deductibleCd == '' || record.deductibleCd == null ||  record.deductibleTitle == '' || record.deductibleType == '' || record.deductibleType == null ||
              (record.deductibleType == 'F' && (record.deductibleAmt == '' ||  record.deductibleAmt == null || isNaN(record.deductibleAmt))) || 
              (record.deductibleType != 'F' && (record.deductibleRate == '' || record.deductibleRate == null || isNaN(record.deductibleRate)) )){
                if(!record.deleted){
                    isEmpty = 1;
                    record.fromCancel = false;
                }else{
                    this.params.deleteDeductibles.push(record);
                }
            }else{
                record.fromCancel = true;
                if(record.edited && !record.deleted){
                    record.createUser = (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
                    record.createDate = (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
                    record.updateUser = this.ns.getCurrentUser();
                    record.updateDate = this.ns.toDateTimeString(0);
                    record.coverCd    = (record.coverCd == '')?0:record.coverCd;
                    record.endtCd     = (record.endtCd == '')?0:record.endtCd;
                    this.params.saveDeductibles.push(record);
                }else if(record.edited && record.deleted){
                    this.params.deleteDeductibles.push(record);
                }
            }
        }
        console.log(this.passData.tableData);

        this.passData.tableData.forEach(function(tblData){
            if(tblData.isNew != true){
                saveDed.forEach(function(sdData){
                    if(tblData.deductibleCd.toString().toUpperCase() == sdData.deductibleCd.toString().toUpperCase() && tblData.coverCd == 0 && tblData.endtCd == 0){
                        if(sdData.isNew === true){
                            isNotUnique = true;    
                        }
                    }
                });
            }
        });

        if(isEmpty == 1){
            this.dialogIcon = 'error';
            $('app-sucess-dialog #modalBtn').trigger('click');
            this.params.saveDeductibles = [];
            (this.changeLine == true)?this.line=this.tempLineCd:'';
        }else{
            if(isNotUnique == true){
                this.warnMsg = 'Unable to save the record. Deductible must be unique per Line.';
                this.showWarnLov();
                this.params.saveDeductibles = [];
            }else{
                if(this.params.saveDeductibles.length == 0 && this.params.deleteDeductibles.length == 0){
                    console.log(this.params);
                    $('.ng-dirty').removeClass('ng-dirty');
                    this.cs.confirmModal();
                    this.params.saveDeductibles  = [];
                    this.passData.tableData = this.passData.tableData.filter(a => a.deductibleCd != '');
                }else{
                    if(this.changeLine == true){
                        this.lineLoading();
                        this.line=this.tempLineCd;
                        console.log('pumasok dito');
                    }
                    if(this.cancelFlag == true){
                        this.cs.showLoading(true);
                        setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},500);
                    }else{
                        this.cs.confirmModal();
                    }
                }            
            }
        }
    }

    dedType(){
        var tsThis = this;
        setTimeout(() => {      
            $('#deductibleTbl').find('tbody').children().each(function(a){
                var d = $(this).find('select').val();
                var arrNums =$(this).find('input.number');
                if(d && d == 'F'){
                   $(arrNums[0]).prop('disabled',false);
                   $(arrNums[1]).prop('disabled',true);
                   $(arrNums[2]).prop('disabled',true);
                   $(arrNums[3]).prop('disabled',true);
                }else if(d && d != 'F'){
                   $(arrNums[0]).prop('disabled',true);
                   $(arrNums[1]).prop('disabled',false);
                   $(arrNums[2]).prop('disabled',false);
                   $(arrNums[3]).prop('disabled',false);
                }

             });
        },0);
    }

    onTabChange($event: NgbTabChangeEvent) {
        if($('.ng-dirty').length != 0 ){
            console.log('entered here');
            $event.preventDefault();
            const subject = new Subject<boolean>();
            const modal = this.modalService.open(ConfirmLeaveComponent,{
                    centered: true, 
                    backdrop: 'static', 
                    windowClass : 'modal-size'
            });
            modal.componentInstance.subject = subject;

            subject.subscribe(a=>{
                if(a){
                    $('.ng-dirty').removeClass('ng-dirty');
                    this.tabset.select($event.nextId)
                }
            })
        }        
    }

    checkCancel(){
        console.log(this.cancelFlag + ' this.cancelFlag at checkCancel()');
        if(this.cancelFlag == true){
            if(this.passData.tableData.some(i => i.fromCancel == false)){
                return;
            }else{
                console.log(this.changeLine);
                if(this.changeLine == true){
                    this.modalService.dismissAll();
                    this.changeLine = false;
                    return;
                }else{
                    console.log('entered here at on no change line');
                    this.cancelBtn.onNo();
                }
            }
        }
    }

    lineLoading(){
        this.ns.lovLoader(this.passEvent, 1);
        this.lineLov.checkCode(this.line.toUpperCase(), this.passEvent);
    }

    onCancel(){
        console.log('onCancel');
        this.line = this.tempLineCd;
        this.modalService.dismissAll();
    }

    onClickNo(){
        console.log('onClickNo');
        this.lineLoading();
        this.getMtnDeductibles();
        this.table.refreshTable();
    }
}
