import { Component, OnInit ,ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UnderwritingService, NotesService } from '../../../_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-update-general-info',
  templateUrl: './update-general-info.component.html',
  styleUrls: ['./update-general-info.component.css']
})
export class UpdateGeneralInfoComponent implements OnInit {
  @ViewChild('polLov') quListTable : CustNonDatatableComponent;
  typeOfCession:string='';
  searchParams: any[] = [];
  fetchedData: any;
  selectedPolicy: any = {};
  disabledBool: boolean = true;
  disabledOldBool: boolean;
  chosenPolicy: any = [];

  passDataLOV: any = {
      tableData: [],
      tHeader:["Policy No","Type of Cession","Ceding Company", "Insured", "Risk"],  
      dataTypes: ["text","text","text","text","text"],
      pageLength: 10,
      resizable: [false,false,false,false,false],
      tableOnly: false,
      keys: ['policyNo','cessionDesc','cedingName','insuredDesc','riskName'],
      pageStatus: true,
      pagination: true,
      filters: [
      /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
      {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
      {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
      {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
      pageID: 'lov1'
    }

  policyInfo:any = {
    policyId: null,
    policyNo: null,
    lineCd: null,
    lineCdDesc: null,
    polYear: null,
    polSeqNo: null,
    cedingId: null,
    cedingName: null,
    coSeriesNo: null,
    altNo: null,
    cessionId: null,
    cessionDesc: null,
    lineClassCd: null,
    lineClassDesc: null,
    quoteId: null,
    quotationNo: null,
    holdCoverNo: null,
    status: null,
    statusDesc: null,
    coRefNo: null,
    reinsurerId: null,
    reinsurerName: null,
    riBinderNo: null,
    mbiRefNo: null,
    policyIdOc: null,
    openPolicyNo: null,
    refOpenPolNo: null,
    intmId: null,
    intmName: null,
    principalId: null,
    principalName: null,
    contractorId: null,
    contractorName: null,
    insuredDesc: null,
    inceptDate: null,
    expiryDate: null,
    lapseFrom: null,
    lapseTo: null,
    maintenanceFrom: null,
    maintenanceTo: null,
    issueDate: null,
    effDate: null,
    distDate: null,
    acctDate: null,
    currencyCd: null,
    currencyRt: null,
    bookedTag: null,
    govtTag: null,
    openCoverTag: null,
    holdCoverTag: null,
    declarationTag: null,
    minDepTag: null,
    altTag: null,
    specialPolicyTag: null,
    instTag: null,
    extensionTag: null,
    excludeDistTag: null,
    wordings: null,
    createUser: null,
    createDate: null,
    updateUser: null,
    updateDate: null,
    showPolAlop: false,
    projDesc: null,
    project: {
      projId: null,
      riskId: null,
      riskName: null,
      regionCd: null,
      regionDesc: null,
      provinceCd: null,
      provinceDesc: null,
      cityCd: null,
      cityDesc: null,
      districtCd: null,
      districtDesc: null,
      blockCd: null,
      blockDesc: null,
      latitude: null,
      longitude: null,
      totalSi: null,
      objectId: null,
      objectDesc: null,
      site: null,
      duration: null,
      testing: null,
      ipl: null,
      timeExc: null,
      noClaimPd: null,
      createUser: null,
      createDate: null,
      updateUser: null,
      updateDate: null
    }
  };



  
  constructor(private titleService: Title, private router: Router, private ns: NotesService, 
                private us: UnderwritingService, private modalService: NgbModal) { }

  ngOnInit() {
    this.disabledOldBool = this.disabledBool;
    this.titleService.setTitle("Pol | Update General Info");
  }

  getPolListing() {
      this.quListTable.loadingFlag = true;
        this.us.getParListing(this.searchParams).subscribe(data => {
        var records = data['policyList'];
        this.fetchedData = records;
          for(let rec of records){
              if(rec.altNo === 0){
                if (rec.statusDesc === 'In Force' || rec.statusDesc === 'Distributed') {
                             this.passDataLOV.tableData.push(
                                                        {
                                                            policyId: rec.policyId,
                                                            policyNo: rec.policyNo,
                                                            cessionDesc: rec.cessionDesc,
                                                            quotationNo: rec.quotationNo,
                                                            lineClassDesc: rec.lineClassDesc,
                                                            status: rec.statusDesc,
                                                            cedingName: rec.cedingName, 
                                                            coRefNo: rec.coRefNo,
                                                            intmName: rec.intmName,
                                                            principalName: rec.principalName,
                                                            contractorName: rec.contractorName,
                                                            insuredDesc: rec.insuredDesc,
                                                            riskName: (rec.project == null) ? '' : rec.project.riskName,
                                                            object: (rec.project == null) ? '' : rec.project.objectDesc,
                                                            site: (rec.project == null) ? '' : rec.project.site,
                                                            regionDesc: (rec.project == null) ? '' : rec.project.regionDesc,
                                                            provinceDesc: (rec.project == null) ? '' : rec.project.provinceDesc,
                                                            cityDesc: (rec.project == null) ? '' : rec.project.cityDesc,
                                                            districtDesc: (rec.project == null) ? '' : rec.project.districtDesc,
                                                            blockDesc: (rec.project == null) ? '' : rec.project.blockDesc,
                                                            latitude: (rec.project == null) ? '' : rec.project.latitude,
                                                            longitude: (rec.project == null) ? '' : rec.project.longitude
                                                        }
                                                    );  
                }
              }
          }
          setTimeout(()=>{
            this.quListTable.refreshTable();
            this.quListTable.loadingFlag = false;
        }, 0)

      });

  }
  

  checkRetrocession(){
    if (this.typeOfCession === null){
      return false;
    }else {
          if(this.typeOfCession.toLowerCase() == 'retrocession')
              return true;
          return false;
    }
  }

  clear(){
     if(this.isEmptyObject(this.policyInfo)){
     } else {
        this.policyInfo = {};
        this.policyInfo.project = {};
        this.disabledBool = true;
        this.typeOfCession = null;
     }
   
  }

  showLOV() {
      this.getPolListing();
      $('#polLovMdl > #modalBtn').trigger('click');
  }

   cancel(){
     this.passDataLOV.tableData = [];
     this.quListTable.refreshTable();
  }

  //rowclick for quote listing LOV
    onRowClick(data){
        if(data !== null){
            if(Object.keys(data).length !== 0){
                this.selectedPolicy = data;
            }else{
                this.selectedPolicy = {};
            }
        }else{
            this.selectedPolicy = {};
        }
    }

    setDetails(event){

        if(this.isEmptyObject(this.selectedPolicy)){
        } else {                                                                                                                                                                             
        this.disabledBool = false;
        this.chosenPolicy = [];
        for(let rec of this.fetchedData){
          if (this.policyNo(rec.policyNo) === this.policyNo(this.selectedPolicy.policyNo)) {
            this.chosenPolicy.push(
                                  {
                                    policyid: rec.policyId, 
                                    altNo : parseInt(rec.altNo)
                                    }
                                  );
          }
       }

       console.log(this.chosenPolicy);

       var res = Math.max.apply(Math,this.chosenPolicy.map(function(o){return o.policyid;}))
       console.log(res);

        this.us.getPolGenInfo(res,null).subscribe(data => {
          var records = data['policy'];
          console.log(records);
          this.policyInfo.policyId = records.policyId;
          this.policyInfo.policyNo = records.policyNo;
          this.typeOfCession = records.cessionDesc;
          this.policyInfo.lineClassDesc = records.lineClassDesc;
          this.policyInfo.quotationNo = records.quotationNo;
          this.policyInfo.statusDesc =records.statusDesc;
          this.policyInfo.cedingId = records.cedingId;
          this.policyInfo.cedingName = records.cedingName;
          this.policyInfo.coRefNo = records.coRefNo;
          this.policyInfo.intmId = this.pad(records.intmId,3);
          this.policyInfo.intmName =records.intmName;
          this.policyInfo.reinsurerName = records.reinsurerName;
          this.policyInfo.riBinderNo = records.riBinderNo;
          this.policyInfo.principalId = this.pad(records.principalId,3);
          this.policyInfo.principalName = records.principalName;
          this.policyInfo.contractorId = this.pad(records.contractorId,3);
          this.policyInfo.contractorName = records.contractorName;
          this.policyInfo.insuredDesc = records.insuredDesc;
          this.policyInfo.riskName = records.project.riskName;
          this.policyInfo.projDesc = records.project.projDesc;
          this.policyInfo.project.object = records.project.objectDesc;
          this.policyInfo.project.objectId = records.project.objectId;
          this.policyInfo.project.site = records.project.site;
          this.policyInfo.project.regionDesc =records.project.regionDesc;
          this.policyInfo.project.projDesc = records.project.projectDesc;
          this.policyInfo.project.provinceDesc = records.project.provinceDesc;
          this.policyInfo.project.cityDesc = records.project.cityDesc;
          this.policyInfo.project.districtDesc = records.project.districtDesc;
          this.policyInfo.project.blockDesc = records.project.blockDesc;
          this.policyInfo.project.latitude = records.project.latitude;
          this.policyInfo.project.longitude = records.project.longitude;
        });
        

        }

        this.passDataLOV.tableData = [];
        this.quListTable.refreshTable();

       
    }


    isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

    policyNo(data: string){
        var arr = data.split('-');
        return arr[0]+ '-' +arr[1] + '-' + arr[2] + '-' + arr[3] + '-' + arr[4];
    }

    pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
    }

}
