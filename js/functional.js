define(["jquery"],function($){
	return {
	      identity:function(o){return o;}
	    ,     copy:function(o){return $.extend(true,{},o);}
	    ,    pluck:function(propName){
		          return function(o){return o[propName]};
	                }
	    ,    by   :function(propName){
	                 var ret=function(a,b){
		             return a[propName]-b[propName];
		             };
		         ret.desc=function(a,b){return ret(b,a);}
		         return ret;
	               }
	    ,      not:function(f){return function(){return !f.apply(this,arguments)}}
	};
    });
