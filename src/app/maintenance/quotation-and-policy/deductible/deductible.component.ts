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
    @ViewChild('tabset') tabset: any;

    passData: any = {
        tableData            : [],
        tHeader              : ['Deductible', 'Title', 'Deductible Type','Deductible Amount','Rate','Minimum Amount','Maximum Amount','Deductible Text','Section Cover','Endorsement','Active','Default','Remarks'],
        dataTypes            : ['pk-cap','text','select','currency','percent','currency','currency','text','text','text','checkbox','checkbox','text'],
        nData:
        {
            newRec            : 1,
            deductibleCd      : null,
            deductibleTitle   : null,
            deductibleType    : 'F',
            deductibleAmt     : null,
            deductibleRate    : null,
            minAmt            : null,
            maxAmt            : null,
            deductibleText    : null,
            sectionCover      : 'Policy Level',
            endorsement       : 'Policy Level',
            activeTag         : 'Y',
            defaultTag        : 'N',
            remarks           : null,
            isNew             : true,
            lineCd            : null,
            coverCd           : null,
            endtCd            : null
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
    mtnDeductiblesReq   : any;
    cancelFlag          : boolean;
    loading             : boolean;
    dialogIcon          : string;
    dialogMessage       : string;
    successMessage      : string  = environment.successMessage;
    counter             : number;
    arrDeductibleCd     : any     = [];
    warnMsg             : string  = '';
    fromCancel          : boolean;

    params : any =    {
        saveDeductibles    : [],
        deleteDeductibles  : []
    };

    constructor(config: NgbDropdownConfig,private titleService: Title, private mtnService: MaintenanceService, private ns : NotesService, private modalService: NgbModal ) { }

    ngOnInit() {
        this.titleService.setTitle('Mtn | Deductibles');
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
                this.arrDeductibleCd     = [];

                var dedRec = data['ded']['deductibles'].map(a => { a.createDate = this.ns.toDateTimeString(a.createDate); a.updateDate = this.ns.toDateTimeString(a.updateDate); return a;});
                this.passData.tableData  = dedRec;
                this.table.refreshTable();
                this.table.onRowClick(null, this.passData.tableData[0]);
                this.passData.disableAdd = false;
                 this.dedType();
            });
        }
    }

    onSaveMtnDeductibles(cancelFlag?){
        console.log('save');
        this.cancelFlag = cancelFlag !== undefined;
        this.dialogIcon = '';
        this.dialogMessage = '';
        var isNotUnique : boolean ;
        var saveDed = this.params.saveDeductibles;
        var isEmpty = 0;
        console.log(this.passData.tableData);
        for(let record of this.passData.tableData){
            console.log(record);
            record.lineCd  = this.line;
            if(record.deductibleCd == null ||  record.deductibleTitle == null || record.deductibleType == null ||
              (record.deductibleType == 'F' && record.deductibleAmt == null || isNaN(record.deductibleAmt)==true || (record.deductibleType != 'F' && record.deductibleRate == null || isNaN(record.deductibleRate)== true ))){
                if(!record.deleted){
                    isEmpty = 1;
                    this.fromCancel = false;
                }
            }else{
                this.fromCancel = true;
                if(record.edited && !record.deleted){
                    record.createUser = (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
                    record.createDate = (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
                    record.updateUser = this.ns.getCurrentUser();
                    record.updateDate = this.ns.toDateTimeString(0);
                    record.coverCd    = (record.coverCd == null)?0:record.coverCd;
                    record.endtCd     = (record.endtCd == null)?0:record.endtCd;
                    this.params.saveDeductibles.push(record);
                }else if(record.edited && record.deleted){
                    this.params.deleteDeductibles.push(record);
                }
            }
            
        }
        console.log(this.params);

        this.passData.tableData.forEach(function(tblData){
            if(tblData.isNew != true){
                saveDed.forEach(function(sdData){
                    if(tblData.deductibleCd.toString().toUpperCase() == sdData.deductibleCd.toString().toUpperCase()){
                        if(sdData.isNew === true){
                            isNotUnique = true;    
                        }
                    }
                });
            }
        });

        if(isNotUnique == true){
            setTimeout(()=>{
                $('.globalLoading').css('display','none');
                this.warnMsg = 'Unable to save the record. Deductible must be unique per Line.';
                this.showWarnLov();
                this.params.saveDeductibles     = [];
            },500);
        }else{
            if(isEmpty == 1){
                setTimeout(()=>{
                    $('.globalLoading').css('display','none');
                    this.dialogIcon = 'error';
                    $('app-sucess-dialog #modalBtn').trigger('click');
                    this.params.saveDeductibles     = [];
                },500);
            }else{
                if(this.params.saveDeductibles.length == 0 && this.params.deleteDeductibles.length == 0){
                    setTimeout(()=>{
                        $('.globalLoading').css('display','none');
                        this.dialogIcon = 'info';
                        this.dialogMessage = 'Nothing to save.';
                        $('app-sucess-dialog #modalBtn').trigger('click');
                        this.params.saveDeductibles     = [];
                        this.passData.tableData = this.passData.tableData.filter(a => a.deductibleCd != '');
                    },500);
                }else{
                    this.mtnService.saveMtnDeductibles(JSON.stringify(this.params))
                    .subscribe(data => {
                        console.log(data);
                        this.getMtnDeductibles();
                        $('app-sucess-dialog #modalBtn').trigger('click');
                        this.params.saveDeductibles     = [];
                        this.passData.disableGeneric = true;
                    });
                }    
            }
        }

    }

    onDeleteDeductibles(){
        if(this.table.indvSelect.okDelete == 'N'){
              this.warnMsg = 'You are not allowed to delete a Deductibles that is already used in quotation processing.';
            this.showWarnLov();
          }else{
              this.table.indvSelect.deleted = true;
              this.table.selected  = [this.table.indvSelect]
              this.table.confirmDelete();
          }
    }

    cbFunc(chxbox:boolean){
        return (chxbox === null  || chxbox === false )? 'N' : 'Y';
    }

    showWarnLov(){
        $('#warnMdl > #modalBtn').trigger('click');
    }

    showLineLOV(){
        $('#lineLOV #modalBtn').trigger('click');
    }

    setLine(data){
        this.line = data.lineCd;
        this.description = data.description;
        this.ns.lovLoader(data.ev, 0);
        this.getMtnDeductibles();
        setTimeout(() => {try{$(data.ev.target).removeClass('ng-dirty');}catch(e){}}, 0);
    }

    checkCode(ev){
        this.ns.lovLoader(ev, 1);
        this.lineLov.checkCode(this.line.toUpperCase(), ev);
    }

    clickRow(event){
        if(event !== null){
            this.deductiblesData.createUser = event.createUser;
            this.deductiblesData.createDate = event.createDate;
            this.deductiblesData.updateDate = event.updateDate;
            this.deductiblesData.updateUser = event.updateUser;
            this.passData.disableGeneric    = false;
            if(event.deductibleType == 'F'){
                event.deductibleRate = null;
                event.minAmt         = null;
                event.maxAmt         = null;
            }else{
                event.deductibleAmt  = null;
            }
            this.table.refreshTable();
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

    onClickSave(){
        $('#confirm-save #modalBtn2').trigger('click');
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
                   arrNums.removeClass('ng-dirty');

                }else if(d && d != 'F'){
                   $(arrNums[0]).prop('disabled',true);
                   $(arrNums[1]).prop('disabled',false);
                   $(arrNums[2]).prop('disabled',false);
                   $(arrNums[3]).prop('disabled',false);
                   arrNums.removeClass('ng-dirty');

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
        if(this.cancelFlag == true){
            if(this.fromCancel){
                this.cancelBtn.onNo();
            }else{
                return;
            }
        }
    }


}
