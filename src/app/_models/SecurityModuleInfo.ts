export class ModuleInfo {
	moduleId: string
	description: string
	moduleGroup: string
	remarks: string

	constructor(moduleId: string,description: string,moduleGroup: string,remarks: string){
		this.moduleId = moduleId
		this.description = description
		this.moduleGroup = moduleGroup
		this.remarks = remarks
	}
}



