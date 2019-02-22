export class AdviceWordings{
	adviceWordId : string
	description : string
	activeTag : string
	wordings: string
	remarks : string

	constructor(adviceWordId : string,description : string,activeTag : string,wordings: string,remarks : string){
		this.adviceWordId = adviceWordId; 
		this.description = description; 
		this.activeTag = activeTag; 
		this.wordings = wordings; 
		this.remarks = remarks; 
	}
}

