export function hideTooltip() {
  	$('#cust-tooltip').css({display:'none'});
  }
  
export function showTooltip(target,message) {
  	if(target.nativeElement.style.boxShadow == '0 0 5px #ff3333'){
	  	let x = parseInt(target.nativeElement.getBoundingClientRect()['x']);
	  	let y = parseInt(target.nativeElement.getBoundingClientRect()['y']);
	  	let width = parseInt(target.nativeElement.getBoundingClientRect()['width']);
	  	let height = parseInt(target.nativeElement.getBoundingClientRect()['height']);
	  	$('#cust-tooltip').html(message);
	  	$('#cust-tooltip').css({left: x+(width/3)+'px', top: y-height-1+'px'});
	  	$('#cust-tooltip').css({display:'block'});
  	}
  }

export function highlight(el: any){
	el.nativeElement.style.boxShadow = '0 0 5px #ff3333';
}

export function unHighlight(el: any){
	el.nativeElement.style.boxShadow = null;
}

