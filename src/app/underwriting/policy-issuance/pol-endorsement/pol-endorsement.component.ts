import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PolicyEndorsement } from '../../../_models/PolicyEndorsement'
import { UnderwritingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
    selector: 'app-pol-endorsement',
    templateUrl: './pol-endorsement.component.html',
    styleUrls: ['./pol-endorsement.component.css']
})
export class PolEndorsementComponent implements OnInit {

    @ViewChild('dedTable') dedTable : CustEditableNonDatatableComponent;
    @ViewChild('endtTable') endtTable : CustEditableNonDatatableComponent;
    @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
    @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
    @ViewChild(CancelButtonComponent) cancel : CancelButtonComponent;

    passData: any = {
        tableData: [],
        tHeader: ['C', 'Endt Code', 'Endt Title','Endt Wordings', 'Remarks'],
        tooltip:['Change Tag',null,null,null,null],
        magnifyingGlass: ['endtCd'],
        dataTypes: ['checkbox', 'text', 'text','text-editor', 'text'],
        nData: {
            changeTag: 'Y',
            endtCd: '',
            endtTitle: '',
            remarks: '',
            showMG: 1,
            createDate: this.ns.toDateTimeString(0),
            updateDate: this.ns.toDateTimeString(0),
            createUser: JSON.parse(window.localStorage.currentUser).username,
            updateUser: JSON.parse(window.localStorage.currentUser).username,
            deductibles: [],
            deductiblesOc: [],
            endtText:""
        },
        addFlag: true,
        deleteFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageLength: 10,
        pageID: 'endt',
        widths: [1, 'auto', 'auto', 'auto'],
        keys: ['changeTag','endtCd', 'endtTitle','endtText', 'remarks'],
        uneditable: [false, false, true, false,false]
    };

    deductiblesData: any = {
        tableData: [],
        tHeader: ['Deductible Code', 'Deductible Title', 'Deductible Text', 'Deductible Rate (%)', 'Deductible Amount'],
        dataTypes: ['text', 'text', 'text', 'percent', 'currency'],
        nData: {
            coverCd: 0,
            deductibleCd: '',
            deductibleTitle: '',
            deductibleTxt: '',
            deductibleRt: 0,
            deductibleAmt: 0,
            showMG: 1,
            createDate: this.ns.toDateTimeString(0),
            updateDate: this.ns.toDateTimeString(0),
            createUser: JSON.parse(window.localStorage.currentUser).username,
            updateUser: JSON.parse(window.localStorage.currentUser).username,
        },
        addFlag: true,
        disableAdd: true,
        deleteFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageLength: 10,
        pageID: 'deductible',
        widths: [1, 'auto', 'auto', 'auto', 'auto'],
        keys: ['deductibleCd','deductibleTitle', 'deductibleTxt', 'deductibleRt', 'deductibleAmt'],
        uneditable: [false,true,true,true,true]
    }

    passLOVData: any = {
      selector:'',
      data:{}
    }


    @Input() alteration: boolean = false;
    currentLine: string = "CAR";
    currentEndtCd: string = "";
    hideEndt:any = [];

    dialogIcon:string;
    dialogMsg: string = "";
    cancelFlag : boolean = false;
    @Input() policyInfo: any;
    @Input() ocFlag: false;
    endtTextKeys:string[] = ['endtText01','endtText02','endtText03','endtText04','endtText05','endtText06','endtText07','endtText08','endtText09','endtText10','endtText11','endtText12','endtText13','endtText14','endtText15','endtText16','endtText17'];

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title, private ns: NotesService
    ) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Endorsement");
        if(this.policyInfo.fromInq!='true'){
            //do something
            this.passData.magnifyingGlass = ['endtCd'];
            this.passData.checkFlag = true;
            this.deductiblesData.checkFlag = true;
            this.deductiblesData.magnifyingGlass = ['deductibleCd'];
            this.passData.uneditable = [true,true,true,false];
            this.deductiblesData.uneditable = [true,true,false,false,false];
        }else{
            this.passData.dataTypes[0] = 'checkbox';
            this.passData.uneditable = [true,true,true,true,true,true,true];
            this.passData.addFlag = false;
            this.passData.deleteFlag = false;

            this.deductiblesData.uneditable = [true,true,true,true,true];
            this.deductiblesData.addFlag = false;
            this.deductiblesData.deleteFlag = false;
        }
        this.currentLine = this.ocFlag ? this.policyInfo.policyNo.substring(3,6) : this.policyInfo.policyNo.substring(0,3);
        if(this.ocFlag){
            this.passData.tHeader =  ['C', 'Endt Code', 'Endt Title', 'Remarks'];
            this.passData.dataTypes =  ['checkbox', 'text', 'text', 'text'];
            this.passData.keys =  ['changeTag','endtCd', 'endtTitle', 'remarks'];
            this.retrieveEndtOC();
        }
        else 
            this.retrieveEndt();
    }

    //retrieve Endorsement
    retrieveEndt(){
        this.underwritingService.getPolicyEndorsement(this.policyInfo.policyId, '').subscribe((data: any) =>{
            console.log(data)
            if(data.endtList !== null){
                this.passData.tableData = data.endtList.endorsements
                this.passData.tableData.forEach(a=>{
                    if(a.endtText!=null){
                        a.endtText =  (a.endtText.endtText01 === null ? '' :a.endtText.endtText01) + 
                                     (a.endtText.endtText02 === null ? '' :a.endtText.endtText02) + 
                                     (a.endtText.endtText03 === null ? '' :a.endtText.endtText03) + 
                                     (a.endtText.endtText04 === null ? '' :a.endtText.endtText04) + 
                                     (a.endtText.endtText05 === null ? '' :a.endtText.endtText05) + 
                                     (a.endtText.endtText06 === null ? '' :a.endtText.endtText06) + 
                                     (a.endtText.endtText07 === null ? '' :a.endtText.endtText07) + 
                                     (a.endtText.endtText08 === null ? '' :a.endtText.endtText08) + 
                                     (a.endtText.endtText09 === null ? '' :a.endtText.endtText09) + 
                                     (a.endtText.endtText10 === null ? '' :a.endtText.endtText10) + 
                                     (a.endtText.endtText11 === null ? '' :a.endtText.endtText11) + 
                                     (a.endtText.endtText12 === null ? '' :a.endtText.endtText12) + 
                                     (a.endtText.endtText13 === null ? '' :a.endtText.endtText13) + 
                                     (a.endtText.endtText14 === null ? '' :a.endtText.endtText14) + 
                                     (a.endtText.endtText15 === null ? '' :a.endtText.endtText15) + 
                                     (a.endtText.endtText16 === null ? '' :a.endtText.endtText16) + 
                                     (a.endtText.endtText17 === null ? '' :a.endtText.endtText17) ;
                    }else{    
                       a.endtText = ""
                    }
                });
                
            } 
            this.endtTable.onRowClick(null,this.passData.tableData[0]);
            this.endtTable.refreshTable();
        });
    }

    retrieveEndtOC(){
        this.underwritingService.getPolicyEndorsementOC(this.policyInfo.policyIdOc, '').subscribe((data: any) =>{
            console.log(data)
            if(data.endtList !== null){
                this.passData.tableData = data.endtOcList.endorsementsOc;
            } 
            this.endtTable.onRowClick(null,this.passData.tableData[0]);
            this.endtTable.refreshTable();
        });
    }



    //retrieve deductibles
    retrieveDeductibles(data){
        if(data !== null && data.deductibles !== undefined){
            this.deductiblesData.nData.endtCd = data.endtCd;
            this.deductiblesData.tableData = data.deductibles
        }else{
            this.deductiblesData.tableData = [];
        }
        this.dedTable.refreshTable();
    }

    retrieveDeductiblesOc(data){
        if(data !== null && data.deductiblesOc !== undefined){
            this.deductiblesData.nData.endtCd = data.endtCd;
            this.deductiblesData.tableData = data.deductiblesOc
        }else{
            this.deductiblesData.tableData = [];
        }
        this.dedTable.refreshTable();
    }

    onClickCancel(){
        this.cancel.clickCancel();
      }

    onClickSave() {
        this.confirmSave.confirmModal();
    }

    rowClick(data){
        if(data === null){
            this.deductiblesData.disableAdd = true;
        }else{
            this.deductiblesData.disableAdd = false;
            this.currentEndtCd = data.endtCd;
        }

        //retrieve Deductibles when selecting an endorsement
        if(this.ocFlag)
            this.retrieveDeductiblesOc(data);
        else
           this.retrieveDeductibles(data);
    }

    clickEndtLov(data){
        this.hideEndt = this.passData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.endtCd);
        $('#endtLov #modalBtn').trigger('click');
    }

    clickDedLov(data){
        this.passLOVData.selector = 'deductibles';
        this.passLOVData.lineCd = this.currentLine;
        this.passLOVData.endtCd = this.endtTable.indvSelect.endtCd;
        this.passLOVData.hide = this.deductiblesData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
        this.passLOVData.params = {
          coverCd: '0',
          activeTag:'Y'
        };
        $('#lov #modalBtn2').trigger('click');
    }

    //set endorsement
    setEndt(data){
        //delete blank
        this.passData.tableData = this.passData.tableData.filter((f)=>{return f.showMG !== 1});
        //add selected
        for(var k = 0; k < data.length; k++){
           this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
           this.passData.tableData[this.passData.tableData.length - 1].endtCd = data[k].endtCd;
           this.passData.tableData[this.passData.tableData.length - 1].endtTitle = data[k].endtTitle;
           this.passData.tableData[this.passData.tableData.length - 1].remarks = data[k].remarks === null ? '' : data[k].remarks;
           this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
           this.passData.tableData[this.passData.tableData.length - 1].edited = true;
           this.passData.tableData[this.passData.tableData.length - 1].add = true;
        }
        this.endtTable.refreshTable();
    }

    //set deductibles
    setSelected(data){
        console.log(data);
        //delete blank
        this.deductiblesData.tableData = this.deductiblesData.tableData.filter((f)=>{return f.showMG !== 1});
        //add selected
        for(var k = 0; k < data.data.length; k++){
           this.deductiblesData.tableData.push(JSON.parse(JSON.stringify(this.deductiblesData.nData)));
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleCd = data.data[k].deductibleCd;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleTitle = data.data[k].deductibleTitle;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleTxt = data.data[k].deductibleTxt;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleRt = data.data[k].deductibleRt;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleAmt = data.data[k].deductibleAmt;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].showMG = 0;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleTxt = data.data[k].deductibleText;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleRt = data.data[k].deductibleRate;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].add = true;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].edited = true;
        }
        this.endtTable.indvSelect.deductibles = this.deductiblesData.tableData;
        this.dedTable.tableDataChange.emit(this.dedTable.passData.tableData);
        this.dedTable.refreshTable();
    }

    save(can?){
        this.cancelFlag = can !== undefined;
        let params : any = {
            policyId : this.policyInfo.policyId,
            saveEndorsements: [],
            deleteEndorsements: [],
            saveDeductibleList: [],
            deleteDeductibleList: []
        }
        for(let endt of this.passData.tableData){
            if(!this.ocFlag){
                let endtTextSplit = endt.endtText.match(/(.|[\r\n]){1,2000}/g);
                endt.endtText = new Object();
                if(endtTextSplit!== null)
                    for (var i = 0; i < endtTextSplit.length; ++i) {
                        endt.endtText[this.endtTextKeys[i]] = endtTextSplit[i];
                    }
            }
            if(endt.edited && !endt.deleted){
                endt.createDate = this.ns.toDateTimeString(endt.createDate);
                endt.updateDate = this.ns.toDateTimeString(endt.updateDate);
                endt.updateUser = JSON.parse(window.localStorage.currentUser).username
                params.saveEndorsements.push(endt);
            }else if(endt.deleted){
                params.deleteEndorsements.push(endt);
            }
            if(!this.ocFlag)
                for(let ded of endt.deductibles){
                    if(ded.edited && !ded.deleted){
                        ded.createDate = this.ns.toDateTimeString(ded.createDate);
                        ded.updateDate = this.ns.toDateTimeString(ded.updateDate);
                        ded.updateUser = JSON.parse(window.localStorage.currentUser).username
                        params.saveDeductibleList.push(ded);
                    }else if(ded.deleted){
                        params.deleteDeductibleList.push(ded);
                    }
                }
            else{
                for(let ded of endt.deductiblesOc){
                    if(ded.edited && !ded.deleted){
                        ded.createDate = this.ns.toDateTimeString(ded.createDate);
                        ded.updateDate = this.ns.toDateTimeString(ded.updateDate);
                        ded.updateUser = JSON.parse(window.localStorage.currentUser).username
                        params.saveDeductibleList.push(ded);
                    }else if(ded.deleted){
                        params.deleteDeductibleList.push(ded);
                    }
                }
            }
        }
        for(let ded of params.saveDeductibleList){
          if((isNaN(ded.deductibleRt) || ded.deductibleRt=="" || ded.deductibleRt==null) && (isNaN(ded.deductibleAmt) || ded.deductibleAmt=="" || ded.deductibleAmt==null)){
            this.dialogIcon = "error";
            setTimeout(a=>this.successDiag.open(),0);
            return null;
          }
        }
        if(this.ocFlag){
            params.policyId = this.policyInfo.policyIdOc;
            this.underwritingService.savePolEndtOc(params).subscribe(data=>{
                if(data['returnCode'] == -1){
                    this.dialogIcon = "success";
                    this.successDiag.open();
                    this.retrieveEndt();
                }else{
                    this.dialogIcon = "error";
                    this.successDiag.open();
                }
            })
        }
        else
            this.underwritingService.savePolEndt(params).subscribe(data=>{
                if(data['returnCode'] == -1){
                    this.dialogIcon = "success";
                    this.successDiag.open();
                    this.retrieveEndt();
                }else{
                    this.dialogIcon = "error";
                    this.successDiag.open();
                    this.passData.tableData.forEach(a=>{
                        if(a.endtText!=null){
                            a.endtText =  (a.endtText.endtText01 === null ? '' :a.endtText.endtText01) + 
                                         (a.endtText.endtText02 === null ? '' :a.endtText.endtText02) + 
                                         (a.endtText.endtText03 === null ? '' :a.endtText.endtText03) + 
                                         (a.endtText.endtText04 === null ? '' :a.endtText.endtText04) + 
                                         (a.endtText.endtText05 === null ? '' :a.endtText.endtText05) + 
                                         (a.endtText.endtText06 === null ? '' :a.endtText.endtText06) + 
                                         (a.endtText.endtText07 === null ? '' :a.endtText.endtText07) + 
                                         (a.endtText.endtText08 === null ? '' :a.endtText.endtText08) + 
                                         (a.endtText.endtText09 === null ? '' :a.endtText.endtText09) + 
                                         (a.endtText.endtText10 === null ? '' :a.endtText.endtText10) + 
                                         (a.endtText.endtText11 === null ? '' :a.endtText.endtText11) + 
                                         (a.endtText.endtText12 === null ? '' :a.endtText.endtText12) + 
                                         (a.endtText.endtText13 === null ? '' :a.endtText.endtText13) + 
                                         (a.endtText.endtText14 === null ? '' :a.endtText.endtText14) + 
                                         (a.endtText.endtText15 === null ? '' :a.endtText.endtText15) + 
                                         (a.endtText.endtText16 === null ? '' :a.endtText.endtText16) + 
                                         (a.endtText.endtText17 === null ? '' :a.endtText.endtText17) ;
                        }else{    
                           a.endtText = ""
                        }
                    })
            }
        })
    }

}
