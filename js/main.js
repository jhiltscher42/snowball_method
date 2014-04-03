require(["snowball","jquery","functional","angular"],function(snowball,$,f_){


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

		var theApp=angular.module('theApp',[])
		    .controller('CurrentCreditorCtrl',["$scope",
		       function CurrentCreditorControl($scope){
			   $scope.creditors=[
					     ];
			   $scope.snowBall='yes';
			   $scope.NewCreditorName="";
			   $scope.currentMonth=0;
			   $scope.currentYear=(new Date()).getFullYear();
			   $scope.outcome=[];

			   $scope.addNewCreditor=function(){
			       if ($scope.NewCreditorName.length == 0) return;
			       $scope.creditors.push({Name:$scope.NewCreditorName,account:0,minpay:0,monthly_charge:0});
			       $scope.NewCreditorName="";
			   }
			   
			   $scope.deleteMe=function(row){
			       $scope.creditors.splice(row,1);
			   }
			   
			   $scope.runPlan=function(){
			       console.log($scope.creditors);
			       $scope.months=snowball.doIt(
			                     {
                                              thisMonth:$scope.currentMonth,
			                      CreditorsArray:$scope.creditors,
			                    currentYear:$scope.currentYear,
                                              extraCash:$scope.seedCash,
                                           dontSnowball:($scope.snowBall=="no")	   
					     });
			       $scope.outcome=snowball.breakItDown($scope.months);
			       console.log($scope.outcome);
			   }
			   
			   
		       }]);
		
		angular.bootstrap(document,['theApp']);

	  });

    });
