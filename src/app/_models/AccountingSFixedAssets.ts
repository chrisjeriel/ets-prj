export class AccountingSFixedAssets{
	type: string;
	propNo: number;
	description: string;
	location: string;
	user: string;
	acquisitionDate: Date;
	acquisitionCost: number;
	depreciationMethod: string;
	noOfMonth: number;
	monthlyDepreciation: number;
	accumulatedDepreciation: number;
	accumulatedAsOf: Date;
	disposalDate: Date;
	disposalValue: string;

	constructor(
		type: string,
		propNo: number,
		description: string,
		location: string,
		user: string,
		acquisitionDate: Date,
		acquisitionCost: number,
		depreciationMethod: string,
		noOfMonth: number,
		monthlyDepreciation: number,
		accumulatedDepreciation: number,
		accumulatedAsOf: Date,
		disposalDate: Date,
		disposalValue: string

	){
		this.type 						 = type;
		this.propNo				 		 = propNo
		this.description				 = description;
		this.location				 	 = location;
		this.user 						 = user;
		this.acquisitionDate			 = acquisitionDate;
		this.acquisitionCost				 = acquisitionCost;
		this.depreciationMethod			 = depreciationMethod;
		this.noOfMonth				 	 = noOfMonth;
		this.monthlyDepreciation		 = monthlyDepreciation;
		this.accumulatedDepreciation	 = accumulatedDepreciation;
		this.accumulatedAsOf		  	 = accumulatedAsOf;
		this.disposalDate				 = disposalDate;
		this.disposalValue				 = disposalValue;
	}
}