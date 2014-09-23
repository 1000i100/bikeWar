onmessage = function () {
	var message = 'Bonjour et adieu !';
	for( var i=1 ; i<=message.length ; i++ ){
		(function(){
			var partieAffichée = message.substr(0,i);
			if (partieAffichée.length<message.length) partieAffichée+='...';
			//postMessage({'orders':[],'consoleMessage':partieAffichée,'error':''});
			setTimeout(function(){
				postMessage({'orders':[],'consoleMessage':partieAffichée,'error':''});
			},i);
		})();
	}
};
