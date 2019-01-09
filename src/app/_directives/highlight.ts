export function hideTooltip() {
  	$('#cust-tooltip').css({display:'none'});
  }
  
export function showTooltip(target,message) {
  	if(target.nativeElement.style.boxShadow == "rgb(255, 51, 51) 0px 0px 5px"){
	  	let x = parseInt(target.nativeElement.getBoundingClientRect()['right']);
	  	let y = parseInt(target.nativeElement.getBoundingClientRect()['y']);
	  	let theight = $('#cust-tooltip').outerHeight();
	  	let twidth = $('#cust-tooltip').outerWidth()/4;
	  	$('#cust-tooltip').html(message);
	  	$('#cust-tooltip').css({left: x-twidth+'px', top:y-theight+'px'});
	  	$('#cust-tooltip').css({display:'block'});
  	}
  }

export function highlight(el: any){
	el.nativeElement.style.boxShadow = '0 0 5px #ff3333';
}

export function unHighlight(el: any){
	if(el.nativeElement.value != '' && !el.nativeElement.hasAttribute('apprequired'))
		el.nativeElement.style.boxShadow = null;
}

