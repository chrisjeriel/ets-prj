import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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


    fixedAmount: boolean = true;

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
            sectionCover      : null,
            endorsement       : null,
            activeTag         : 'Y',
            defaultTag        : null,
            remarks           : null
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
        checkFlag           : true,
        addFlag             : true,
        //deleteFlag          : true,
        keys                : ['deductibleCd','deductibleTitle','deductibleType','deductibleAmt','deductibleRate','minAmt','maxAmt','deductibleText','sectionCover','endorsement','activeTag','defaultTag','remarks'],
        uneditable          : [false,false,false,false,false,false,false,false,false,false,false,false,false],
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
    line                :string;
    description         :string;
    mtnDeductiblesReq   :any;
    cancelFlag          :boolean;
    loading             :boolean;
    dialogIcon          :string;
    dialogMessage       :string;
    successMessage      :string  = environment.successMessage;
    counter             :number;
    arrDeductibleCd     :any     = [];

    constructor(config: NgbDropdownConfig,private titleService: Title, private mtnService: MaintenanceService, private ns : NotesService, private modalService: NgbModal ) { }

    ngOnInit() {
        this.titleService.setTitle('Mtn | Deductibles'); 
        this.passData.addFlag = false;
        this.passData.deleteFlag = false;
    }

    getMtnDeductibles(){
        this.table.overlayLoader = true;

        if(this.line === '' || this.line === null){
           this.clearTbl();
        }else{
            this.passData.addFlag = true;
            this.passData.deleteFlag = true;
            this.deductiblesData.createUser = '';
            this.deductiblesData.createDate = '';
            this.deductiblesData.updateDate = '';
            this.deductiblesData.updateUser = '';

            this.passData.opts[0].vals = [];
            this.passData.opts[0].prev = [];

            // 

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


            });

            // 

            // this.mtnService.getRefCode('MTN_DEDUCTIBLES.DEDUCTIBLE_TYPE')
            // .subscribe(data =>{
            //     this.passData.opts[0].vals = [];
            //     this.passData.opts[0].prev = [];
            //     var rec = data['refCodeList'];
            //     for(let i of rec){
            //         this.passData.opts[0].vals.push(i.code);
            //         this.passData.opts[0].prev.push(i.description);
            //     }
            // });

            // this.passData.tableData  = [];
            // this.arrDeductibleCd     = [];
            
            // this.mtnService.getMtnDeductibles(this.line.toUpperCase(),'','','')
            // .subscribe(data =>{
            //     this.passData.tableData = [];
            //     this.arrDeductibleCd = [];
            //     var rec = data['deductibles'];
            //     for(let i of rec){
            //         this.passData.tableData.push({
            //             deductibleCd      : i.deductibleCd,
            //             deductibleTitle   : i.deductibleTitle,
            //             typeDesc          : i.deductibleType,                        
            //             deductibleAmt     : i.deductibleAmt,
            //             deductibleRate    : i.deductibleRate,
            //             minAmt            : i.minAmt,
            //             maxAmt            : i.maxAmt,
            //             deductibleText    : i.deductibleText,
            //             sectionCover      : i.sectionCover,
            //             endorsement       : i.endorsement,
            //             activeTag         : i.activeTag,
            //             defaultTag        : i.defaultTag,
            //             remarks           : i.remarks,

            //             createUser        : i.createUser,
            //             createDate        : this.ns.toDateTimeString(i.createDate),
            //             updateDate        : this.ns.toDateTimeString(i.updateDate),
            //             updateUser        : i.updateUser,

            //             endtCd            : i.endtCd,
            //             coverCd           : i.coverCd
            //         });

            //         this.arrDeductibleCd.push(i.deductibleCd);

            //     }

            //     this.table.refreshTable();
            // });
        }
        

    }

    onSaveMtnDeductibles(){

        for(let record of this.passData.tableData){
            console.log(record);
            
        }
    }

    onSaveDeductibles(cancelFlag?){
        this.counter = 0;
        this.dialogIcon = '';
        this.dialogMessage = '';
        this.cancelFlag = cancelFlag !== undefined;

        for(var i=0;i<this.passData.tableData.length;i++){
            var rec = this.passData.tableData[i];
            console.log(rec);
            if(rec.deductibleCd === '' || rec.deductibleCd === null || rec.deductibleTitle === '' || rec.deductibleTitle === null ||
                rec.deductibleType === '' || rec.deductibleType === null){
                setTimeout(()=>{
                    $('.globalLoading').css('display','none');
                    this.dialogIcon = 'error';
                    $('app-sucess-dialog #modalBtn').trigger('click');
                },500);

            }else{
                if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
                    for(var k = 0; k < this.arrDeductibleCd.length; k++){
                        if(rec.deductibleCd === this.arrDeductibleCd[k]){
                            rec = this.passData.tableData[k];
                            break;
                        }else{
                            rec = this.passData.tableData[i];
                        }
                    }
                    this.mtnDeductiblesReq = {
                        "deleteDeductibles": [],
                        "saveDeductibles": [
                        {
                            "activeTag":           (rec.activeTag === '' || rec.activeTag === null || rec.activeTag === undefined)?this.cbFunc(rec.activeTag):rec.activeTag,
                            "coverCd":             (rec.coverCd === '' || rec.coverCd === null || rec.coverCd === undefined)?0:rec.coverCd,
                            "createDate":          (rec.createDate === '' || rec.createDate === null || rec.createDate === undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(rec.createDate),
                            "createUser":          (rec.createUser === '' || rec.createUser === null || rec.createUser === undefined)?JSON.parse(window.localStorage.currentUser).username:rec.createUser,
                            "deductibleAmt":       rec.deductibleAmt,
                            "deductibleCd":        rec.deductibleCd,
                            "deductibleRate":      rec.deductibleRate,
                            "deductibleText":      rec.deductibleText,
                            "deductibleTitle":     rec.deductibleTitle,
                            "deductibleType":      rec.deductibleType,
                            "defaultTag":          (rec.defaultTag === '' || rec.defaultTag === null || rec.defaultTag === undefined)?'Y':rec.defaultTag,
                            "endtCd":              (rec.endtCd === '' || rec.endtCd === null || rec.endtCd === undefined)?0:rec.endtCd,
                            "lineCd":              this.line,
                            "maxAmt":              rec.maxAmt,
                            "minAmt":              rec.minAmt,
                            "remarks":             rec.remarks,
                            "updateDate":          this.ns.toDateTimeString(0),
                            "updateUser":          JSON.parse(window.localStorage.currentUser).username
                        }
                        ]
                    }

                    console.log(this.mtnDeductiblesReq);
                    this.mtnService.saveMtnDeductibles(JSON.stringify(this.mtnDeductiblesReq))
                    .subscribe(data => {
                        console.log(data);
                        $('app-sucess-dialog #modalBtn').trigger('click');
                        this.getMtnDeductibles();
                    });           
                }else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
                    this.mtnDeductiblesReq = {
                        "deleteDeductibles": [
                        {
                            "activeTag":           '',
                            "coverCd":             '',
                            "createDate":          '',
                            "createUser":          '',
                            "deductibleAmt":       '',
                            "deductibleCd":        rec.deductibleCd,
                            "deductibleRate":      '',
                            "deductibleText":      '',
                            "deductibleTitle":     '',
                            "deductibleType":      '',
                            "defaultTag":          '',
                            "endtCd":              '',
                            "lineCd":              this.line,
                            "maxAmt":              '',
                            "minAmt":              '',
                            "remarks":             '',
                            "updateDate":          '',
                            "updateUser":          ''
                        }
                        ],
                        "saveDeductibles": []
                    }
                    this.mtnService.saveMtnDeductibles(JSON.stringify(this.mtnDeductiblesReq))
                    .subscribe(data => {
                        console.log(data);
                        $('app-sucess-dialog #modalBtn').trigger('click');
                        this.getMtnDeductibles();
                    }); 
                }else{
                    this.counter++;
                }
        }

    }

    if(this.passData.tableData.length === this.counter){
        setTimeout(()=>{
            $('.globalLoading').css('display','none');
            this.dialogIcon = 'info';
            this.dialogMessage = 'Nothing to save.';
            $('app-sucess-dialog #modalBtn').trigger('click');
        },500);
    }
}

cbFunc(chxbox:boolean){
    return (chxbox === null  || chxbox === false )? 'N' : 'Y';
}

showLineLOV(){
    $('#lineLOV #modalBtn').trigger('click');
}

setLine(data){
    this.line = data.lineCd;
    this.description = data.description;
    this.ns.lovLoader(data.ev, 0);
    this.getMtnDeductibles();
    setTimeout(() => { $(data.ev.target).removeClass('ng-dirty'); }, 0);
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
    }
}

clearTbl(){
    this.passData.addFlag = false;
    this.passData.deleteFlag = false;
    this.passData.tableData = [];
    this.table.refreshTable();
}

cancel(){
    this.cancelBtn.clickCancel();
}

onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
}

FixedAmount(){
    this.fixedAmount = true;
}

NotFixedAmount(){
    this.fixedAmount = false;
}

}
