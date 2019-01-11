import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-clm-claims-inquiry',
	templateUrl: './clm-claims-inquiry.component.html',
	styleUrls: ['./clm-claims-inquiry.component.css']
})
export class ClmClaimsInquiryComponent implements OnInit {
	passData: any = {
		tableData: [
			["CAR-2018-00013", "In Progress", "CAR-2018-00001-099-0001-000", "ASIA INSURANCE (PHILIPPINES) CORP", "Cornerdot Contructions / Solid Builders Corp.", "C-National Steel/Iligan City", "03/09/2018", "Damaged electric cables and supply lines on 2nd", "PHP", "1000000", "330000","TLP Adj. / ACD Co. Inc.","CLETC"],
			["EAR-2018-00044", "Closed", "EAR-2018-00555-067-0003-000", "BANKERS ASSURANCE CORP.", "Solid Square Buildings Corp. / DP Cornerstone Build & Traiding Corp.", "C.Ayala Land, Inc./Rehab of Amara", "08/09/2018", "Damaged electric cables and supply lines on 2nd", "PHP", "4000000", "505189","TLP Adj. / ACD Co. Inc.","CLCCZ"],
			["EEI-2018-00043", "Withdrawn", "EEI-2018-00066-078-0008-000", "CHARTER PING AN INSURANCE CORP.", "A.B. Industries, Inc.", "C.Ayala Land, Inc./Gatewalk Central Estate", "05/09/2018", "Damaged electric cables and supply lines on 2nd", "PHP", "0", "0","TLP Adj. / ACD Co. Inc.","CLETC"],
			["MBI-2018-00087", "In Progress", "MBI-2018-00075-008-0004-000", "Dela Merced Adjustment Corp.", "A.C.G. Construction", "JG Summit Holdings, Inc./Rob Gourmet", "02/09/2018", "Damaged electric cables and supply lines on 2nd", "PHP", "4000000", "0","TLP Adj. / ACD Co. Inc.","CLCCZ"],
			["BPV-2018-00055", "Denied", "BPV-2018-00134-006-0009-000", "DOMESTIC INS. CO. OF THE PHIL.", "A.D. Realty and Contruction Corporation", "Producer's Bank Bldg. - Paseo, Makati", "11/09/2018", "Damaged electric cables and supply lines on 2nd", "PHP", "4000000", "0","TLP Adj. / ACD Co. Inc.","CLCJCZ"],
			["MLP-2018-00043", "In Progress", "MLP-2018-00077-009-0033-000", "EASTERN ASSURANCE AND SURETY CORP.", "A.G.S. Engineering and Management Resources, Inc.", "King's Court (I) Bldg. - Makati", "10/09/2018", "Damaged electric cables and supply lines on 2nd", "PHP", "5000000", "1333898","TLP Adj. / ACD Co. Inc.","CLECOH"],
			["DOS-2018-00009", "Spoiled", "DOS-2018-00001-001-0001-000", "GENERAL ACCIDENT INSURANCE ASIA. LTD", "Aguilar Consolidated Construction Industries Corp.", "LBP Bldg - Makati", "01/03/2019", "Damaged electric cables and supply lines on 2nd", "PHP", "880000", "0","TLP Adj. / ACD Co. Inc.","CLECOH"],
			["CEC-2018-00014", "Denied", "CEC-2018-00117-032-0001-000", "J.G. Bernas Adjusters and Surveyors, Inc.", "Chinmaya Mission Philippines, Inc.", "Crestly Bldg. - Cebu", "10/09/2018", "Damaged electric cables and supply lines on 2nd", "PHP", "990000", "0","TLP Adj. / ACD Co. Inc.","CLCCZ"],
			["EAR-2018-00001", "In Progress", "EAR-2018-00111-034-0010-000", "LIBERTY INSURANCE CORP.", "DP Cornerstone Build & Trading Corp. / Cornerdot Construction", "Manila Pavillion - Ermita", "12/09/2018", "Damaged electric cables and supply lines on 2nd", "PHP", "2000000", "0","TLP Adj. / ACD Co. Inc.","CLETC"],
			["CAR-2018-00115", "In Progress", "CAR-2018-00001-082-0023-000", "MAA GENERAL INSURANCE PHILS., INC.", "Brostek Furniture / Barillo Construction & Enterprises", "Gemini Bldg. - Gil Puyat, Makati", "01/01/2019", "Damaged electric cables and supply lines on 2nd", "PHP", "1200000", "0","TLP Adj. / ACD Co. Inc.","CLETC"],
		],
		tHeader: ["Claim No", "Status", "Policy No", "Ceding Company", "Insured",
		"Risk", "Loss Date", "Loss Details", "Currency", "Total Reserve", "Total Payment", "Adjusters",
		"Processed By"],
		dataTypes: ["text", "text", "text", "text", "text", "text", "date", "text", "text", "currency", "currency", "text", "text"],
		printBtn: true,
		pagination: true,
		pageStatus: true,
		searchFlag: true,
		pageLength: 10,
		resizable: [true, true, true, true, true, true, true, true, true, true, true, true, true],
	};

	constructor() { }

	ngOnInit() {
	}

}
