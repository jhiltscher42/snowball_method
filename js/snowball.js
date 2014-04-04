define(["functional"],function(f_){

	var credArray=[];

	var months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep","Oct","Nov","Dec"];

	function getMonths(){return months.slice();}

	function sum(a,b){return a+b;};

	function processMonth(inArray,overage,dontSnowball){

	    /*helper functions, only inscope in processMonth*/

	    function pay(creditor,index,old){
		amount=creditor.minpay;
		if (index==old.length-1 && !dontSnowball) amount=paypool;
		if (creditor.account<amount) amount=creditor.account;
		creditor.pay=amount;
		//console.log("amount",amount);
		var ret=f_.copy(creditor);
		//console.log("pay ",creditor.name,amount);
		//console.log("paypool:",paypool);
		ret.account-=amount;
		paypool-=amount;
		//console.log("paypool:",paypool);

		return ret;
	    }

	    function charge(creditor){
		var ret=f_.copy(creditor);
		if (ret.account) {
		    ret.account+=ret.monthly_charge;
		}
		return ret;
	    }

	    function donePaying(creditor){
		var ret=f_.copy(creditor);
		ret.pay=0;
		return ret;
	    }

	    
	    /* end helper functions */


	    var paypool=inArray.map(f_.pluck("minpay")).reduce(sum)+overage;
	    var outArray=inArray.slice(0).sort(f_.by("account").desc);

	    var doneArray=outArray.filter(f_.not(f_.pluck("account"))).map(donePaying);

	    if (dontSnowball) paypool=inArray.filter(f_.pluck("account")).map(f_.pluck("minpay")).reduce(sum)+overage;

	    outArray=outArray.filter(f_.pluck("account")).map(pay).map(charge).concat(doneArray);


	    return outArray;
	}

	function rotate(ar,num){
	    while (num) {
		ar=ar.slice();
		ar.push(ar.shift());
		num--;
	    }
	    return ar;
	}

	var doIt=function(config){
	    config=config || {};
	    var thisMonth =      ("thisMonth" in config)?config.thisMonth:0;
	    var CreditorsArray = config.CreditorsArray || credArray;
	    var Year=            config.currentYear || 2014;
	    var extraCash =      ("extraCash" in config)?parseFloat(config.extraCash):0;
	    var dontSnowball=    config.dontSnowball;


	    if (isNaN(extraCash)) extraCash=0;

	    var processArray=CreditorsArray.slice(0);
	    var Months=rotate(months,thisMonth);

	    processArray.forEach(function(creditor){
		    ["account","minpay","monthly_charge"].forEach(function(prop){
			    creditor[prop]=parseFloat(creditor[prop]);
			});
		});

	    //console.log(processArray);
	    //console.log(dontSnowball);

	    var output=[];


	    while (processArray.map(f_.pluck("account")).reduce(sum)>0){
		processArray=processMonth(processArray,extraCash,dontSnowball);

		output.push({Name:Months[0]+","+Year,table:processArray});

		Months=rotate(Months,1);
		if (Months[0]=="Jan") Year++;
	    }
	    return output;
	}

	function find(arr,propName,equalToVal){
	    var lastIndex=arr.length;
	    for (var n=0;n<lastIndex;n++){
		if (arr[n][propName] == equalToVal) return n;
	    }
	    return -1;
	}

        var breakItDown=function(plan){
	    return plan.reduce(
			       function(brokenDown,tab){
				   var numAccounts=tab.table.filter(f_.pluck("pay")).length;
				   var workingIndex=find(brokenDown,"numAccounts",numAccounts);
				   if (workingIndex==-1) {
				       workingIndex=brokenDown.push({numAccounts:numAccounts,startingName:tab.Name,table:tab.table,numberOfMonths:0});
				       workingIndex=workingIndex-1;
				   }
				   brokenDown[workingIndex].endingName=tab.Name;
				   brokenDown[workingIndex].numberOfMonths++;
				   return brokenDown;
			       },
			       []);
	}

	return {breakItDown:breakItDown,doIt:doIt,getMonths:getMonths};
    });
