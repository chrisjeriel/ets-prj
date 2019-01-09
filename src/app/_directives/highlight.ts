export function highlight(el: any, ){
	el.nativeElement.style.borderColor = 'red';
}

export function unHighlight(el: any){
	el.nativeElement.style.borderColor = '#ced4da';
}

export function hideTooltip() {
  	$('#cust-tooltip').css({display:'none'});
  }
  
export function showTooltip(target,message) {
  	if(target.nativeElement.style.borderColor == 'red'){
	  	let x = parseInt(target.nativeElement.getBoundingClientRect()['x']);
	  	let y = parseInt(target.nativeElement.getBoundingClientRect()['y']);
	  	let width = parseInt(target.nativeElement.getBoundingClientRect()['width']);
	  	let height = parseInt(target.nativeElement.getBoundingClientRect()['height']);
	  	$('#cust-tooltip').html(message);
	  	$('#cust-tooltip').css({left: x+(width/3)+'px', top: y-height-1+'px'});
	  	$('#cust-tooltip').css({display:'block'});
  	}
  }