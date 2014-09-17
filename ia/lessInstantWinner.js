onmessage = function (event) {
	setTimeout(function(){postMessage({'orders':[],'consoleMessage':'Combient de temps tiendrez vous ?','error':''});},1);
	setTimeout(function(){postMessage({'orders':[],'consoleMessage':"Encore vivant ?",'error':''});},2);
};
