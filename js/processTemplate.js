define(["jquery"],function($){
	//used for an array callback constructor.  Given an object, creates a function(val) which returns ob[val] if it exists, otherwise it returns val; 

	function repTempl(ob){
	    return function(a,b){
		if (b in ob){return ob[b];}
		//return eval("ob."+b);
		return b;
	    }
	}

	function repMoneyTempl(ob){
	    return function(a,b){
		if (b in ob){return "$"+ob[b].toFixed(2);}
		//return eval("ob."+b);
		return b;
	    }
	}
	
	function processTemplate(templateString,applyObject){
	    if (!templateString) return templateString;

	    var templateMoneyRegEx=/\${{([\w,\[,\]]+)}}/g;

	    var templateRegEx=/{{([\w,\[,\]]+)}}/g;
	    
	    return templateString
                            .replace(templateMoneyRegEx,repMoneyTempl(applyObject))
                            .replace(templateRegEx,repTempl(applyObject));
	}

	return processTemplate;
    });

