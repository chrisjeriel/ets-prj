import { Component, OnInit } from '@angular/core';
import { PolItem_MLP, PolGoods_DOS, PolMachinery_DOS } from '@app/_models/PolItem';
import { UnderwritingService } from '@app/_services';


@Component({
  selector: 'app-pol-item',
  templateUrl: './pol-item.component.html',
  styleUrls: ['./pol-item.component.css']
})
export class PolItemComponent implements OnInit {

  constructor(private underwritingService: UnderwritingService) { }
  mlpTableData: PolItem_MLP[];
  mlpTHeader: string[] = ['Item No','Quantity','Description of Machinery','Indemnity Period(months)','Relative Importance(%)','Spare Parts in stock standby Units'];
  mlpDataTypes: string[] = ['text','number','text','number','percent','number'];

  dosGoodsTableData: PolGoods_DOS[];
  dosGoodsTHeader: string[] = ["Item No", "Refrigerating Chamber No", "Type of Goods", "No-Claims Period","Sum Insured"];
  dosGoodsDataTypes:string[] = ["text","text","text","text","currency"];

  dosMachineryTableData: PolMachinery_DOS[];
  dosMachineryTHeader: string[] = ["Item No","Number of Units", "Description of Items (Technical Data including Capacity)", "Year of Make", "Sum Insured"];
  dosMachineryDataTypes:string[] = ["text","number","text","number","currency"];

  ngOnInit() {
  	this.mlpTableData = this.underwritingService.getPolItemMLPData();
  	this.dosGoodsTableData = this.underwritingService.getPolGoodsDOSData();
  	this.dosMachineryTableData = this.underwritingService.getPolMachineryDOSData();
  }

}
