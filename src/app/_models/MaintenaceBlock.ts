export class MtnBlock{
	regionCd: number;
    regionDesc:string;
    provinceCd :number;
    provinceDesc:string;
    cityCd:number;
    cityDesc:string;
    districtCd:string;
    districtDesc:string;
    blockCd:string
    blockDesc: string

	constructor(
		regionCd: number,
		regionDesc:string,
		provinceCd :number,
		provinceDesc:string,
		cityCd:number,
		cityDesc:string,
		districtCd:string,
		districtDesc:string,
		blockCd:string,
   		blockDesc: string
		) {
		this.regionCd = regionCd ;
		this.regionDesc = regionDesc ;
		this.provinceCd = provinceCd ;
		this.provinceDesc = provinceDesc ;
		this.cityCd = cityCd ;
		this.cityDesc = cityDesc ;
		this.districtCd = districtCd ;
		this.districtDesc = districtDesc ;
		this.blockCd = blockCd;
		this.blockDesc = blockDesc;

}
}




