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
        uneditable          : [false,false,false,false,false,false,false,false,true,true,false,false,false],
        pageID              : 'mtn-deductibles',
        mask: {
            deductibleCd    : 'AAAAAAA'
        },
        limit: {
            deductibleTitle : 250,
            deductibleText  : 2000,
            remarks         : 4000
        },
        keys                : ['deductibleCd','deductibleTitle','deductibleType','deductibleAmt','deductibleRate','minAmt','maxAmt','deductibleText','sectionCover','endorsement','activeTag','defaultTag','remarks'],
        widths              : ['100','200','200','100','100','100','100','200','auto','auto','auto','auto','200']

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
    warnMsg             : string  = '';
    firstLoading        : boolean;
    passEvent           : any;
    changeLine          : boolean;
    tempLineCd          : string = '';
    counter             : number = 0;
    exit                : boolean;

    params : any =    {
        saveDeductibles    : [],
        deleteDeductibles  : []
    };

    constructor(config: NgbDropdownConfig,private titleService: Title, private mtnService: MaintenanceService, private ns : NotesService, public modalService: NgbModal ) { }

    ngOnInit() {
        this.titleService.setTitle('Mtn | Deductibles');
        this.firstLoading = true;
    }

    getMtnDeductibles(){ 
        console.log('getMtnDeductibles');
        this.table.overlayLoader = true;
        this.counter = 0;
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
        this.tempLineCd    = this.line.toUpperCase();
    }

    onSaveMtnDeductibles(){
        console.log('onSaveMtnDeductibles');
        if(this.changeLine){
            this.params.saveDeductibles.map(i => i.lineCd = this.tempLineCd );
            this.params.deleteDeductibles.map(i => i.lineCd = this.tempLineCd );
        }
        this.counter++;
        this.mtnService.saveMtnDeductibles(JSON.stringify(this.params))
        .subscribe(data => {
            console.log(data);
            this.getMtnDeductibles();
            $('app-sucess-dialog #modalBtn').trigger('click');
            this.params.saveDeductibles  = [];
            this.params.deleteDeductibles  = [];
            this.passData.disableGeneric = true;
            $('.ng-dirty').removeClass('ng-dirty');
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
    
    setLine(data){
        console.log('setLine');
        console.log(data);
        this.line = data.lineCd;
        this.description = data.description;
        this.ns.lovLoader(data.ev, 0);
        this.firstLoading = false;
        if($('.ng-dirty').length != 0){
            this.counter++;
            this.changeLine = true;
            (this.counter<2)?this.cancelBtn.clickCancel():'';
        }else{
            this.changeLine = false;
            this.getMtnDeductibles();
        }
    }

    checkCode(ev){
        console.log('checkCode');
        this.passEvent = ev;
        console.log(ev);
        if(this.firstLoading == true){
            this.ns.lovLoader(ev, 1);
            this.lineLov.checkCode(this.line.toUpperCase(), ev);
            $('.ng-dirty').removeClass('ng-dirty');   
        }else{
            if($('.ng-dirty').length != 0){
                this.changeLine = true;
                this.cancelBtn.clickCancel();
            }else{
                
                this.changeLine = false;
                this.ns.lovLoader(ev, 1);
                this.lineLov.checkCode(this.line.toUpperCase(), ev);
            }
        }
    }

    onClickSave(cancelFlag?){
        this.cancelFlag = cancelFlag !== undefined;
        this.dialogIcon = '';
        this.dialogMessage = '';

        var isEmpty = 0;
        var isNotUnique : boolean ;
        var saveDed = this.passData.tableData.filter(i => i.isNew == true);
        
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
            this.line = (this.changeLine == true)?this.tempLineCd:this.line;
        }else{
            if(isNotUnique == true){
                this.warnMsg = 'Unable to save the record. Deductible must be unique per Line.';
                this.showWarnLov();
                this.params.saveDeductibles = [];
            }else{
                if(this.params.saveDeductibles.length == 0 && this.params.deleteDeductibles.length == 0){
                    $('.ng-dirty').removeClass('ng-dirty');
                    this.cs.confirmModal();
                    this.params.saveDeductibles  = [];
                    this.passData.tableData = this.passData.tableData.filter(a => a.deductibleCd != '');
                }else{
                    if(this.changeLine == true){
                        this.lineLoading();
                        this.line=this.tempLineCd;
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

    checkCancel(){
        if(this.cancelFlag == true){
            if(this.passData.tableData.some(i => i.fromCancel == false)){
                return;
            }else{
                if(this.changeLine == true){
                    this.changeLine = false;
                    if(this.exit == true){
                        this.cancelBtn.url = '/maintenance-qu-pol';
                        this.cancelBtn.onNo(); 
                    }else{
                        this.modalService.dismissAll();
                        return;
                    }
                }else{
                    this.cancelBtn.onNo();
                }
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

    lineLoading(){
        this.ns.lovLoader(this.passEvent, 1);
        this.lineLov.checkCode(this.line.toUpperCase(), this.passEvent);
    }

    onCancel(){
        this.counter = 0;
        this.line = this.tempLineCd;
        this.modalService.dismissAll();
    }

    onClickNo(){
        if(this.exit == true){
            this.changeLine = false;
            this.cancelBtn.url = '/maintenance-qu-pol';
            this.cancelBtn.onNo(); 
        }else{
            this.lineLoading();
            this.getMtnDeductibles();
            this.table.refreshTable();
        }
    }

    clearTbl(){
        this.passData.disableGeneric = true;
        this.passData.disableAdd     = true;
        this.passData.tableData      = [];
        this.table.refreshTable();
    }

    cancel(){
        this.exit = true;
        this.cancelBtn.clickCancel();
    }

    showWarnLov(){
        $('#warnMdl > #modalBtn').trigger('click');
    }

    showLineLOV(){
        $('#lineLOV #modalBtn').trigger('click');
    }

}
