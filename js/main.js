require(["snowball","jquery","functional","angular","angularCookie","angularGrid"],function(snowball,$,f_,ng){


	$(function()
	  {
		$("form").submit(function(){return false;});

		$("body").on("click",".collapseToggle",function(){$(this).parents(".collapsable").toggleClass("collapsed");});

		$("#expandAll").click(function(){
			$(".collapsable").removeClass("collapsed");
		    });

		$("#collapseAll").click(function(){
			$(".collapsable").addClass("collapsed");
		    });

		function viewPane(paneName)
		{
		    $(".pane").removeClass("activePane");
		    return $("#"+paneName).addClass("activePane").length;
		}

		viewPane('creditorsPane');
		
		$(".tabs li").click(function(){
			if (viewPane($(this).attr("rel"))){
				$(".tabs li").removeClass("selectedTab");
				$(this).addClass("selectedTab");
			    }
		    });

		var theApp=angular.module('theApp',['ngCookies','ngGrid'])
		    .controller('CurrentCreditorCtrl',["$scope","$cookies",
		       function CurrentCreditorControl($scope,$cookies){
			   $scope.creditors=[
					     ];
			   if (localStorage && localStorage.creditors)
			       {
				   try{
				       $scope.creditors=JSON.parse(localStorage.creditors);
				   }
				   catch(e){
				   }
			       }
			   $scope.$watch(function(scope){
				   return JSON.stringify(scope.creditors);
			       },function(){
				   if (localStorage && JSON)
				       {
					   localStorage.creditors=JSON.stringify($scope.creditors);
				       }
			       });
			   $scope.snowBall='yes';
			   $scope.NewCreditorName="";
			   $scope.currentMonth=0;
			   $scope.currentYear=(new Date()).getFullYear();
			   $scope.outcome=[];

			   $scope.longDescription=$cookies.IKnowThis;
			   if ($scope.longDescription=="hidden")
			       {
				   $scope.shortDescription="";
			       }
			   else
			       {
				   $scope.shortDescription="hidden";
			       }

			   $scope.gridOptions={data:'creditors',
					       enableCellSelection:true,
					       enableRowSelection:false,
					       enableCellEditOnFocus:true,
					       enableColumnResize:true,
			                       columnDefs:[{cellClass:'deleteMe',field:'',cellTemplate:'<span class="deleteMe" ng-click="delete_me(row)">X</button>',
							    displayName:'Delete',enableCellEdit:false,width:60},
			                                   {field:'Name',displayName:'Name',enableCellEdit:true},
			   {field:'account',displayName:'Current Balance',enableCellEdit:true, cellFilter:"currency", cellClass:"accounts_display"},
			   {field:'minpay',displayName:'Minimum Payment',enableCellEdit:true, cellFilter:"currency", cellClass:"accounts_display", width:150},
			   {field:'monthly_charge',displayName:'Monthly charge',enableCellEdit:true,cellFilter:"currency", cellClass:"accounts_display"}
						   ]};

			   $scope.addNewCreditor=function(){
			       if ($scope.NewCreditorName.length == 0) return;
			       $scope.creditors.push({Name:$scope.NewCreditorName,account:0,minpay:0,monthly_charge:0});
			       $scope.NewCreditorName="";
			   }

			   $scope.delete_me=function(row){
			       $scope.deleteMe($scope.creditors.indexOf(row.entity));
			   }

			   $scope.deleteMe=function(row){
			       $scope.creditors.splice(row,1);
			   }

			   $scope.toggleIKnowThis=function(){
			       if ($scope.longDescription!="hidden")
				   {
				       $scope.longDescription=$cookies.IKnowThis="hidden";
				       $scope.shortDescription="";
				   }
			       else
				   {
				       $scope.longDescription=$cookies.IKnowThis="";
				       $scope.shortDescription="hidden";
				   }
			       //console.log($scope.longDescription);
			   }

			   $scope.runPlan=function(){
			       //console.log($scope.creditors);
			       $scope.months=snowball.doIt(
			                     {
                                              thisMonth:$scope.currentMonth,
			                      CreditorsArray:$scope.creditors,
			                    currentYear:$scope.currentYear,
                                              extraCash:$scope.seedCash,
                                           dontSnowball:($scope.snowBall=="no")	   
					     });
			       $scope.outcome=snowball.breakItDown($scope.months);
			       //console.log($scope.outcome);
			   }
			   
			   
		       }]);
		
		angular.bootstrap(document,['theApp']);

	  });

    });
