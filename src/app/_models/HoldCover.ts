export class HoldCoverInfo {
	quotationNo: number;
	insured: string;
	risk: string;
	holdCoverNo: number;
	compRefHoldCoverNo: number;
	status: string;
	periodFrom: Date = new Date();
	periodTo: Date = new Date();
	requestedBy: string;
	requestDate: Date = new Date(); 
}