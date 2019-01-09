export function highlight(el: any){
	el.nativeElement.style.boxShadow = '0 0 5px #ff3333';
}

export function unHighlight(el: any){
	el.nativeElement.style.boxShadow = null;
}