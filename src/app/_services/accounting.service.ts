import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QSOA, AttachmentInfo } from '@app/_models';

@Injectable({
	providedIn: 'root'
})
export class AccountingService {

	qsoaData: QSOA[] = [];
	attachmentInfo: AttachmentInfo[] = [];

	constructor(private http: HttpClient){}

	getQSOAData(){
		this.qsoaData = [
			new QSOA("Q Ending",1341234,3424,42342,141),
			new QSOA("Q Ending",1341234,3424,35223,1231345),
		];
		return this.qsoaData;
	}

	getAttachmentInfo(){
		this.attachmentInfo = [
			new AttachmentInfo("Path","Description"),
		]
		return this.attachmentInfo;

	}

}