import { Component, OnInit, Input } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { PolAttachmentInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';

@Component({
  selector: 'app-pol-attachment',
  templateUrl: './pol-attachment.component.html',
  styleUrls: ['./pol-attachment.component.css'],
  providers: [NgbDropdownConfig]
})
export class PolAttachmentComponent implements OnInit {

  @Input() alterationFlag ;

   tableData: any[] = [];
   tHeader: any[] = ["File Path","Description","Table Code","Actions"];
   nData: PolAttachmentInfo = new PolAttachmentInfo(null, null);
   options: any[] = ["","Q - Quotation", "P - Policy", "C - Claim", "A - Accounting"];
 

  constructor(config: NgbDropdownConfig,private underwritingService: UnderwritingService) { 
    config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() {

    this.tableData = this.underwritingService.getPolAttachment();
  }

}
