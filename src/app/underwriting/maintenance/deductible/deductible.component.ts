import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
        tHeader              : ['Deductible', 'Title', 'Deductible Type','Deductible Amount','Rate','Minimum Amount','Maximum Amount','Deductible Text','Active','Remarks'],
        dataTypes            : ['text','text','select','currency','percent','currency','currency','text','checkbox','text'],
        nData:
        {
            deductibleCd      : null,
            deductibleTitle   : null,
            typeDesc          : null,
            deductibleAmt     : null,
            deductibleRate    : null,
            minAmt            : null,
            maxAmt            : null,
            deductibleText    : null,
            activeTag         : null,
            remarks           : null
        }
        ,
        opts: [{
            selector        : 'typeDesc',
            prev            : [],
            vals            : [],
        }],
        paginateFlag        : true,
        infoFlag            : true,
        searchFlag          : true,
        pageLength          : 10,
        checkFlag           : true,
        addFlag             : true,
        deleteFlag          : true,
        keys                : ['deductibleCd','deductibleTitle','typeDesc','deductibleAmt','deductibleRate','minAmt','maxAmt','deductibleText','activeTag','remarks'],
        uneditable          : [false,false,false,false,false,false,false,false,false,false],
        pageID              : 'mtn-deductibles',
        widths              : ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto']

    };
    data: any;
    deductiblesData : any = {
        updateDate : null,
        updateUser : null,
        createDate : null,
        createUser : null,
    }
    line                :string;
    description         :string;
    enableSearch        :boolean =  false;
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
        this.passData.addFlag = true;
        this.passData.deleteFlag = true;
        this.deductiblesData.createUser = '';
        this.deductiblesData.createDate = '';
        this.deductiblesData.updateDate = '';
        this.deductiblesData.updateUser = '';

        this.passData.opts[0].vals = [];
        this.passData.opts[0].prev = [];
        this.mtnService.getRefCode('MTN_DEDUCTIBLES.DEDUCTIBLE_TYPE')
        .subscribe(data =>{
            this.passData.opts[0].vals = [];
            this.passData.opts[0].prev = [];
            var rec = data['refCodeList'];
            for(let i of rec){
                this.passData.opts[0].vals.push(i.code);
                this.passData.opts[0].prev.push(i.description);
            }
        });

        this.passData.tableData  = [];
        this.arrDeductibleCd     = [];
        this.mtnService.getMtnDeductibles(this.line.toUpperCase(),'','','')
        .subscribe(data =>{
            this.passData.tableData = [];
            this.arrDeductibleCd = [];
            var rec = data['deductibles'];
            for(let i of rec){
                this.passData.tableData.push({
                    deductibleCd      : i.deductibleCd,
                    deductibleTitle   : i.deductibleTitle,
                    typeDesc          : i.deductibleType,                        
                    deductibleAmt     : i.deductibleAmt,
                    deductibleRate    : i.deductibleRate,
                    minAmt            : i.minAmt,
                    maxAmt            : i.maxAmt,
                    deductibleText    : i.deductibleText,
                    activeTag         : i.activeTag,
                    remarks           : i.remarks,

                    createUser        : i.createUser,
                    createDate        : this.ns.toDateTimeString(i.createDate),
                    updateDate        : this.ns.toDateTimeString(i.updateDate),
                    updateUser        : i.updateUser,

                    defaultTag        : i.defaultTag,
                    endtCd            : i.endtCd,
                    coverCd           : i.coverCd
                });

                this.arrDeductibleCd.push(i.deductibleCd);

            }

            this.table.refreshTable();
        });

    }


    onSaveDeductibles(cancelFlag?){
        this.counter = 0;
        this.dialogIcon = '';
        this.dialogMessage = '';
        this.cancelFlag = cancelFlag !== undefined;

        for(var i=0;i<this.passData.tableData.length;i++){
            var rec = this.passData.tableData[i];
            if(rec.deductibleCd === '' || rec.deductibleCd === null || rec.deductibleTitle === '' || rec.deductibleTitle === null ||
               rec.typeDesc === '' || rec.typeDesc === null){
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
                            "deductibleType":      rec.typeDesc,
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
        this.clearTbl();
        this.line = data.lineCd;
        this.description = data.description;
        this.ns.lovLoader(data.ev, 0);

        if(this.description === ''){
            this.enableSearch = false;
        }else{
            this.enableSearch = true;
        }
    }

    checkCode(ev){
        this.clearTbl();
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
