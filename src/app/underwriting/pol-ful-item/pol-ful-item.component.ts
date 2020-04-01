import { Component, OnInit, ViewChild, Input, ViewChildren, QueryList } from '@angular/core';
import { PolItem_MLP, PolItem_EEI_MBI_CEC, PolItem_BPV, PolGoods_DOS, PolMachinery_DOS, PolItem_CEC } from '@app/_models';
import { UnderwritingService, NotesService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-pol-ful-item',
  templateUrl: './pol-ful-item.component.html',
  styleUrls: ['./pol-ful-item.component.css']
})
export class PolFulItemComponent implements OnInit {
    @ViewChildren(CustEditableNonDatatableComponent) table: QueryList<CustEditableNonDatatableComponent>;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
    

    @Input() policyInfo: any;


    eeiPassData:any={
        tableData:[],
        tHeader: ['Quantity', 'Section','Description of Items', 'Year of Make', 'Deductible', 'Sum Insured'],
        dataTypes:['number', 'select' ,'text-editor', 'string', 'string', 'currency'],
        nData: {
            "quantity": null,
            "itemDesc": null,
            "makeYear": null,
            "deductibleTxt": null,
            "sumInsured": null,
            "createDate": this.ns.toDateTimeString(0),
            "createUser": JSON.parse(window.localStorage.currentUser).username,
            "updateDate": this.ns.toDateTimeString(0),
            "updateUser":JSON.parse(window.localStorage.currentUser).username,
            "stockType" : 'N',
            "section": ''
        },
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        total:[null,null,null,null,'Total','sumInsured'],
        widths: ["1",1,"auto","2","auto","228"],
        searchFlag:true,
        keys:['quantity','section','itemDesc','makeYear','deductibleTxt','sumInsured'],
        uneditable: [false,false,false,false,false,false],
        pageLength:'unli',
        limit: {
            quantity: 3
        },
        opts: [{
            selector: 'section',
            prev: ['I','II','III'],
            vals: ['I','II','III'],
        }],

    }

    bpvPassData: any = {
        tableData:[],
        tHeader: ['Serial No', 'Location', 'Description Maker\'s No. and Maker\'s Name', 'Year of Make', 'Sum Insured'],
        dataTypes:['string', 'string', 'text-editor', 'string', 'currency'],
        nData: {
             "serialNo":null,
             "location": null,
             "itemDesc": null,
             "makeYear": null,
             "sumInsured": null,
             "createDate": this.ns.toDateTimeString(0),
             "createUser": JSON.parse(window.localStorage.currentUser).username,
             "updateDate": this.ns.toDateTimeString(0),
             "updateUser":JSON.parse(window.localStorage.currentUser).username,
             "stockType" : 'N'
        },
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        searchFlag:true,
        widths: ["1","228","auto","1","228"],
        pageLength: 'unli',
        keys:['serialNo','location','itemDesc','makeYear','sumInsured'],
        total:[null,null,null,'Total','sumInsured'],

    }
    
    mlpPassData: any = {
        tableData: [],
        tHeader:  ['Quantity', 'Description of Machinery', 'Indemnity Period(months)', 'Relative Importance(%)', 'Spare Parts in stock standby Units'],
        dataTypes:  [ 'number', 'text-editor', 'number', 'percent', 'number'],
        nData:  {
            "itemNo":null,
            "quantity": null,
            "itemDesc": null,
            "Indem": null,
            "relativeImp": null,
            "standbyUnit": null,
            "createDate": this.ns.toDateTimeString(0),
            "createUser": JSON.parse(window.localStorage.currentUser).username,
            "updateDate": this.ns.toDateTimeString(0),
            "updateUser":JSON.parse(window.localStorage.currentUser).username,
            "stockType" : 'N'
        },
        checkFlag:"true",
        addFlag:"true",
        deleteFlag:"true",
        widths:  ['1','auto','1','1','195'],
        searchFlag : true,
        keys:['quantity','itemDesc','ipl','relativeImp','standbyUnit'],
        pageLength: 'unli',
        limit: {
            quantity: 3,
            ipl: 3
        }
    }
    
    dosGoodsPassData: any = {
        tableData: [],
        tHeader: ["Refrigerating Chamber No", "Type of Goods", "No-Claims Period", "Sum Insured"],
        dataTypes: [ "text", "text-editor", "text", "currency"],
        nData: {
            "itemNo":null,
            "chamberNo": null,
            "itemDesc": null,
            "noClaimPd": null,
            "sumInsured": null,
            "createDate": this.ns.toDateTimeString(0),
            "createUser": JSON.parse(window.localStorage.currentUser).username,
            "updateDate": this.ns.toDateTimeString(0),
            "updateUser":JSON.parse(window.localStorage.currentUser).username,
            "stockType" : 'G'
        },
        widths: ['1','auto','1','228'],
        // pageLength: 5,
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        total:[null,null,'Total','sumInsured'],
        keys:['chamberNo','itemDesc','noClaimPd','sumInsured'],
        pageLength: 5,
        searchFlag:true,
        pageID: 'dosGoods',
        limit: {
            noClaimPd: 3
        }
    }

    dosMachineryPassData: any = {
        tableData: [],
        tHeader: ["Number of Units", "Description of Items (Technical Data including Capacity)", "Year of Make", "Sum Insured"],
        dataTypes: [ "number", "text-editor", "text", "currency"],
        nData: {
            "itemNo":null,
            "quantity": null,
            "itemDesc": null,
            "makeYear": null,
            "sumInsured": null,
            "createDate": this.ns.toDateTimeString(0),
            "createUser": JSON.parse(window.localStorage.currentUser).username,
            "updateDate": this.ns.toDateTimeString(0),
            "updateUser":JSON.parse(window.localStorage.currentUser).username,
            "stockType" : 'M'
        } ,
        widths:  ['1','auto','1','228'],
        pageLength: 5,
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        total:[null,null,'Total','sumInsured'],
        keys:['quantity','itemDesc','makeYear','sumInsured'],
        searchFlag: true,
        pageID: 'dosMachinery'
    }

    cecPassData: any = {
        tableData:[],
        tHeader: [ 'Insured Item and Location', 'Deductible', 'Sum Insured'],
        dataTypes:['text-editor', 'text-editor', 'currency'],
        nData: {
            "itemNo":null,
            "quantity": null,
            "itemDesc": null,
            "deductibleTxt": null,
            "sumInsured": null,
            "createDate": this.ns.toDateTimeString(0),
            "createUser": JSON.parse(window.localStorage.currentUser).username,
            "updateDate": this.ns.toDateTimeString(0),
            "updateUser":JSON.parse(window.localStorage.currentUser).username,
            "stockType" : 'N'
        },
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        total:[null,'Total','sumInsured'],
        widths: ['335','395','394'],
        searchFlag:true,
        keys:['itemDesc','deductibleTxt','sumInsured'],
        pageLength:'unli'
    }

    
    polEEI: boolean = true;
    polBPV: boolean = false;
    polMLP: boolean = false;
    polDOS: boolean = false;

    line: string;
    sub: any;
    policyId: any = 1;
    editedData:any[] = [];
    deletedData:any[] =[];
    dialogMessage:string;
    dialogIcon:string = '';
    cancelFlag:boolean;

    itemDetails: any = {
        policyId: null,
        projId: null,
        itemNo: null,
        quantity: null,
        itemDesc: null,
        makeYear: null,
        deductibleTxt: null,
        sumInsured: null,
        createUser:JSON.parse(window.localStorage.currentUser).username,
        createDate: '',
        updateUser: JSON.parse(window.localStorage.currentUser).username,
        updateDate:''
    }

    constructor(private route: ActivatedRoute, private underwritingService: UnderwritingService, private titleService: Title, private ns: NotesService, private router: Router) { }

    ngOnInit() {
        // this.titleService.setTitle("Pol | Item");
        this.line = this.policyInfo.policyNo.substr(0,3);

        console.log("policyInfo: " + JSON.stringify(this.policyInfo));
      
        this.getItem();


    }

    getItem(){
        
        this.underwritingService.getFullItemInfoData(null,this.policyInfo.policyId).subscribe((data:any) => {
            console.log(data)
            data.policy.project.items.forEach(a=>{
                a.edited = true;
            })
            if(this.line == 'EEI' || this.line == 'MBI'){
                this.eeiPassData.tableData = [];
                this.itemDetails.policyId = data.policy.policyId;
                this.itemDetails.projId = data.policy.project.projId;
                var tableDatas = data.policy.project.items;

                for(var i = 0 ; i < tableDatas.length; i++ ){
                    this.eeiPassData.tableData.push(tableDatas[i]);
                }
            }

            if(this.line == 'CEC'){
                this.cecPassData.tableData = [];
                this.itemDetails.policyId = data.policy.policyId;
                this.itemDetails.projId = data.policy.project.projId;
                var tableDatas = data.policy.project.items;

                for(var i = 0 ; i < tableDatas.length; i++ ){
                    this.cecPassData.tableData.push(tableDatas[i]);
                }
            }

            if(this.line == 'BPV'){
                this.bpvPassData.tableData = [];
                this.itemDetails.policyId = data.policy.policyId;
                this.itemDetails.projId = data.policy.project.projId;
                var tableDatas = data.policy.project.items;

                for(var i = 0 ; i < tableDatas.length; i++ ){
                    this.bpvPassData.tableData.push(tableDatas[i]);
                }
            }

            if(this.line == 'MLP'){
                this.mlpPassData.tableData = [];
                this.itemDetails.policyId = data.policy.policyId;
                this.itemDetails.projId = data.policy.project.projId;
                var tableDatas = data.policy.project.items;

                for(var i = 0 ; i < tableDatas.length; i++ ){
                    this.mlpPassData.tableData.push(tableDatas[i]);
                }
            }

            if(this.line == 'DOS'){
                this.dosGoodsPassData.tableData = [];
                this.dosMachineryPassData.tableData = [];
                this.itemDetails.policyId = data.policy.policyId;
                this.itemDetails.projId = data.policy.project.projId;
                var tableDatas = data.policy.project.items;

                // for(var i = 0 ; i < tableDatas.length; i++ ){
                //     this.dosGoodsPassData.tableData.push(tableDatas[i]);
                // }

                // for(var j = 0 ; j < tableDatas.length; j++ ){
                //     this.dosMachineryPassData.tableData.push(tableDatas[j]);
                // }

                this.dosGoodsPassData.tableData = tableDatas.filter(a => a.stockType == 'G' );
                this.dosMachineryPassData.tableData = tableDatas.filter(a => a.stockType == 'M' );
            }
            this.table.forEach(a=>a.refreshTable());    
        });
    }

    prepareData(){
        
        /*if(this.cancelFlag === true){
         this.router.navigateByUrl('quotation-processing');
        }*/

        if(this.line=='EEI' || this.line=='MBI'){
            for (var i = 0; i < this.eeiPassData.tableData.length; i++) {
                if(this.eeiPassData.tableData[i].edited && !this.eeiPassData.tableData[i].deleted){
                    this.editedData.push(this.eeiPassData.tableData[i]);
                    this.editedData[this.editedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }

                if(this.eeiPassData.tableData[i].deleted){
                    this.deletedData.push(this.eeiPassData.tableData[i]);
                    this.deletedData[this.deletedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.deletedData[this.deletedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }
            }
        }

        if(this.line=='CEC'){
            for (var i = 0; i < this.cecPassData.tableData.length; i++) {
                if(this.cecPassData.tableData[i].edited && !this.cecPassData.tableData[i].deleted){
                    this.editedData.push(this.cecPassData.tableData[i]);
                    this.editedData[this.editedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }

                if(this.cecPassData.tableData[i].deleted){
                    this.deletedData.push(this.cecPassData.tableData[i]);
                    this.deletedData[this.deletedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.deletedData[this.deletedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }
            }
        }

        if(this.line=='BPV'){
            for (var i = 0; i < this.bpvPassData.tableData.length; i++) {
                if(this.bpvPassData.tableData[i].edited && !this.bpvPassData.tableData[i].deleted){
                    this.editedData.push(this.bpvPassData.tableData[i]);
                    this.editedData[this.editedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }

                if(this.bpvPassData.tableData[i].deleted){
                    this.deletedData.push(this.bpvPassData.tableData[i]);
                    this.deletedData[this.deletedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.deletedData[this.deletedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }
            }
        }

        if(this.line=='MLP'){
            for (var i = 0; i < this.mlpPassData.tableData.length; i++) {
                if(this.mlpPassData.tableData[i].edited && !this.mlpPassData.tableData[i].deleted){
                    this.editedData.push(this.mlpPassData.tableData[i]);
                    this.editedData[this.editedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }

                if(this.mlpPassData.tableData[i].deleted){
                    this.deletedData.push(this.mlpPassData.tableData[i]);
                    this.deletedData[this.deletedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.deletedData[this.deletedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }
            }
        }

        if(this.line=='DOS'){
            for (var i = 0; i < this.dosGoodsPassData.tableData.length; i++) {
                if(this.dosGoodsPassData.tableData[i].edited && !this.dosGoodsPassData.tableData[i].deleted){
                    this.editedData.push(this.dosGoodsPassData.tableData[i]);
                    this.editedData[this.editedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }

                if(this.dosGoodsPassData.tableData[i].deleted){
                    this.deletedData.push(this.dosGoodsPassData.tableData[i]);
                    this.deletedData[this.deletedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.deletedData[this.deletedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }
            }

            for (var i = 0; i < this.dosMachineryPassData.tableData.length; i++) {
                if(this.dosMachineryPassData.tableData[i].edited && !this.dosMachineryPassData.tableData[i].deleted){
                    this.editedData.push(this.dosMachineryPassData.tableData[i]);
                    this.editedData[this.editedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }

                if(this.dosMachineryPassData.tableData[i].deleted){
                    this.deletedData.push(this.dosMachineryPassData.tableData[i]);
                    this.deletedData[this.deletedData.length - 1].createDate = this.ns.toDateTimeString(0);
                    this.deletedData[this.deletedData.length - 1].updateDate = this.ns.toDateTimeString(0);
                }
            }
        }

        this.itemDetails.saveItemLists = this.editedData;
        this.itemDetails.deleteItemLists = this.deletedData;
        //this.saveItem();

    }

    saveItem(cancelFlag?){
        this.cancelFlag = cancelFlag !== undefined;
        this.prepareData();
        this.underwritingService.savePolFullItem(this.itemDetails).subscribe((data:any) => {
            if(data['returnCode'] == 0) {
              console.log('Check error')
              this.dialogMessage = data['errorList'][0].errorMessage;
              this.dialogIcon = "error";
              this.emptyVar();
              this.successDiag.open();
            } else{
              this.dialogMessage = "";
              this.dialogIcon = "success";
              this.successDiag.open();
              console.log('Success')
              this.emptyVar();
              this.getItem();
              this.table.forEach(a=>a.markAsPristine());
              //this.getCoverageInfo();
            }
        })
    }

    emptyVar(){
        this.editedData = [];
        this.deletedData = [];
        this.itemDetails.saveItemLists = [];
        this.itemDetails.deleteItemLists = [];
    }

    onClickSave(){
      $('#confirm-save #modalBtn2').trigger('click');
    }

    cancel(){
      this.cancelBtn.clickCancel();
    }

}