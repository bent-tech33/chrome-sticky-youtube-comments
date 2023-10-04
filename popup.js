document.addEventListener('DOMContentLoaded', function() {
	var link = document.getElementById('tfu-always-sticky');
	var is_sticky = false;
	chrome.storage.local.get('sticky', function(data) {
    is_sticky = data.sticky ===true ? true: false;
	toggleState(link, is_sticky);
});
    
    link.addEventListener('click', function(e) {
		e.preventDefault();
		is_sticky = !is_sticky;
		console.log(is_sticky);
		chrome.storage.local.set({ "sticky": is_sticky });
		toggleState(link, is_sticky);
    });
	
	function toggleState(link, is_sticky){
		if(is_sticky){
		link.classList.add('is-sticky');
	}
	else{
		link.classList.remove('is-sticky');
	}
	}
});