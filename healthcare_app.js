angular.module('formApp', [
  'ngAnimate'
]).
controller('formCtrl', ['$scope', '$http', function($scope, $http) {
  
  $scope.healthcare = {};
  $scope.stage = "step4";
	$scope.teref=0;
  $scope.acert = {"BLS":"Expires","ACLS" : "Expires" , "PALS":"Expires","NRP":"Expires","NIHSS":"Expires"};
  $scope.certACLS = false;
	$scope.certPALS = false;
	$scope.certNRP = false;
	$scope.certNIHSS = false;
	
  $scope.formValidation = false;
  $scope.toggleJSONView = false;
  $scope.toggleFormErrorsView = false;
	$scope.step3s = ["1","2","3","4","5","6","7","8","9","10"];


 
 $scope.addCert = function () {
	$scope.certACLS = $scope.healthcare.step1.AddmoreCert === 'ACLS' ? true : $scope.certACLS;
	 $scope.certPALS = $scope.healthcare.step1.AddmoreCert === 'PALS' ? true :$scope.certPALS;
	 $scope.certNRP = $scope.healthcare.step1.AddmoreCert === 'NRP' ? true : $scope.certNRP ;
	 $scope.certNIHSS = $scope.healthcare.step1.AddmoreCert === 'NIHSS' ? true: $scope.certNIHSS;
	
   	//alert($scope.healthcare.step1.AddmoreCert); EmpRefDependFields
  };
  
	$scope.EmpRefDependFields = function () {
	$scope.EmpRefDependField = $scope.healthcare.step3.EmployerReference[$scope.teref] == 'Yes' ? true : false;
  };
	
	
  // Navigation functions
  $scope.next = function (stage) {
	  
	  
	  
	  
	  
    //$scope.direction = 1;
    //$scope.stage = stage;
    
    $scope.formValidation = true;
    
    if ($scope.multiStepForm.$valid) {
		
		
		
		  /******
		  *  Handle the Step 3 Request 
		  *
		  ***/
		  if(stage === 'step4'){
			  var keys = Object.keys($scope.healthcare.step3.workingExpAdd);
			  var len = keys.length;
			 var lastkey = len - 1;
			  //console.log(lastkey);
			  if(lastkey < 1 && $scope.healthcare.step3.workingExpAdd[0] === 'No'){
				  // alert(stage+'lastkey less 1 NO');
				  $scope.stage = 'step3';
				  $scope.tereferror = true;
				  return;
			  }
			  if(lastkey < 1 && $scope.healthcare.step3.workingExpAdd[0] === 'Yes'){
				 // alert(stage+'lastkey less 1 YES');
				  $scope.stage = 'step3';
				  $scope.teref++;
				 // $scope.formValidation = false;
				  return;
				  
			  }
			  if(lastkey > 0 && $scope.healthcare.step3.workingExpAdd[lastkey] === 'No'){
				 // alert(stage+'lastkey greater 0 and No');
				  $scope.direction = 1;
				  $scope.stage = stage;
				  $scope.formValidation = false;
				  return;
			  }
			  if(lastkey > 0 && $scope.healthcare.step3.workingExpAdd[lastkey] === 'Yes'){
				  // alert(stage+'lastkey greater 0 YES');
				  $scope.stage = 'step3';
				  $scope.teref++;
				 // $scope.formValidation = false;
				  return;
			  }
			  //EmpRefDependFields();
		  }
		
		
	
		//alert(stage);
      $scope.direction = 1;
      $scope.stage = stage;
      $scope.formValidation = false;
    }
  };

  $scope.back = function (stage) {
    $scope.direction = 0;
    $scope.stage = stage;
  };
  
 
  
  
  // Post to desired exposed web service.
  $scope.submitForm = function () {
    

    // Check form validity and submit data using $http
    if ($scope.multiStepForm.$valid) {
      $scope.formValidation = false;

      $http({
        method: 'POST',
		datatype:'json',
        url: wsUrl,
        data: jQuery.param($scope.healthcare), 
  		headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
 		})
		  .success(function(data) {
		  	alert($scope.healthcare.step1.FirstName+' '+$scope.healthcare.step1.LastName+ '; Your HealthCare Registeration Form Data is submitted.');
    		console.log(data);
		  
		  //jQuery('#ng_multiStepForm').submit();
		  	//window.location.href = '';
	  	}); // success
    } // f ($scope.multiStepForm.$valid)
  }; // $scope.submitForm = function ()
  
}]); // controller



// Handle Resume Upload
jQuery(function(){
    //file input field trigger when the drop box is clicked
    jQuery("#dropBox").click(function(){
        jQuery("#fileInput").click();
    });
    
    //prevent browsers from opening the file when its dragged and dropped
    jQuery(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    //call a function to handle file upload on select file
    jQuery('input[type=file]').on('change', fileUpload);
});

function fileUpload(event){
    //notify user about the file upload status
    jQuery("#dropboxlabel").html(event.target.value+" uploading...");
    
    //get selected file
    files = event.target.files;
    
    //form data check the above bullet for what it is  
    var data = new FormData();                                   

    //file data is presented as an array
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if(!file.type.match('image.*')) {              
            //check file type
            jQuery("#dropboxlabel").html("Please choose an images file.");
        }else if(file.size > 1048576){
            //check file size (in bytes)
            jQuery("#dropboxlabel").html("Sorry, your file is too large (>1 MB)");
        }else{
            //append the uploadable file to FormData object
            data.append('file', file, 'resumefile');
            
            //create a new XMLHttpRequest
            var xhr = new XMLHttpRequest();     
            
            //post file data for upload
            xhr.open('POST', ajaxurl+'?action=mam_healthcare_resume_file', true);  
            xhr.send(data);
            xhr.onload = function () {
            	console.log(xhr.responseText);
                //get response and show the uploading status
                var response = xhr.responseText;
                if(xhr.status === 200 ){
                    jQuery("#dropboxlabel").html("File has been uploaded successfully.");
                    jQuery('#fileUrl').val(xhr.responseText);
                    // ----------------------------------------------------------
					   var sel = 'div[ng-controller="formCtrl"]';
    				   var $scope = angular.element(sel).scope();
    				   $scope.healthcare.resume = xhr.responseText;
					   $scope.$apply();
					// ----------------------------------------------------------
                }else{
                    jQuery("#dropboxlabel").html("Some problem occured, please try again.");
                }
            };
        }
    }
}
