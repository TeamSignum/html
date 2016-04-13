//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

var fieldsetn = 1;

$(".next").click(function(){
  var error = 0;

  //step 100
  if(fieldsetn == 1){
    var emailVal = $('#email').val();
    var emailReg = /[^\s@]+@[^\s@]+\.[^\s@]+/;

     // Email check
     if(emailVal == ""){
        $('#email').addClass('warning');
        $('#email-error').html("Email address is required");
        error = 1;
     }else if(!emailReg.test(emailVal)){
        $('#email').addClass('warning');
        $('#email-error').html("Email format was not recognized");
        error = 1;
     }else{
      $('#email').removeClass('warning');
      $('#email-error').html("");
     }

    // password check
    var passVal1 = $('#pass').val();
    var passVal2 = $('#pass-check').val();

    if(passVal1 == "" && passVal2 == ""){
      $('#pass').addClass('warning');
      $('#pass-check').addClass('warning');
      $('#pass-error').html("Plase enter your password");
      //$('#pass-check').attr("placeholder", "Empty, type your password");
      error = 1;
    }else if(passVal1 != passVal2){
      $('#pass').addClass('warning');
      $('#pass-check').addClass('warning');
      $('#pass-error').html("Passwords do not match");
      //$('#pass').attr("placeholder", "Password does not match");
      //$('#pass-check').attr("placeholder", "Password does not match");
      error = 1;
    }else if(passVal1.length < 6){
      $('#pass').addClass('warning');
      $('#pass-check').addClass('warning');
      $('#pass-error').html("Password must be at least 6 characters");
      //$('#pass').attr("placeholder", "Password must be at least 6 characters");
      //$('#pass-check').attr("placeholder", "Password must be at least 6 characters");
      error = 1;
    }else{
      $('#pass').removeClass('warning');
      $('#pass-check').removeClass('warning');
      $('#pass-error').html('');
    }

  }
  //step 2
  else if(fieldsetn == 2){

    var uidVal = $('#uid').val();
    var uidReg = /^([a-zA-Z0-9_-]){6,}$/;
     // uid check
     if(uidVal == ""){
        $('#uid').addClass('warning');
        $('#uid-error').html('Please enter a User ID');
        //$('#uid').attr("placeholder", "Empty, type your Uid");
        error = 1;
     }else if(!uidReg.test(uidVal)){
        $('#uid').addClass('warning');
        $('#uid-error').html('User ID must be at least 6 characters');
        //$('#uid').attr("placeholder", "User ID must be at least 6 characters");
        error = 1;
     }else{
        $('#uid').removeClass('warning');
        $('#uid-error').html('');
     }

     var firstnameVal = $('#firstname').val();
     var lastnameVal = $('#lastname').val();
      // Name check
     if(firstnameVal == ""){
        $('#firstname').addClass('warning');
        $('#firstname').attr("placeholder", "Type your firstname");
        error = 1;
     }else{
        $('#firstname').removeClass('warning');
     }
     if(lastnameVal == ""){
        $('#lastname').addClass('warning');
        $('#lastname').attr("placeholder", "Type your lastname");
        error = 1;
     }else{
        $('#lastname').removeClass('warning');
     }

     var usertypeVal = $('#usertype').val();
     if(usertypeVal == null){
        $('#usertype').addClass('warning');
        $('#usertype-error').html('Please select a user type');
        error = 1;
     }
     else{
        $('#usertype').removeClass('warning');
        $('#usertype-error').html('');
     }
  }
  

  if(error == 0){
    if(animating) return false;
    animating = true;
    fieldsetn = fieldsetn +1;
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    
    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    
    //show the next fieldset
    next_fs.show(); 
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
      step: function(now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale current_fs down to 80%
        scale = 1 - (1 - now) * 0.2;
        //2. bring next_fs from the right(50%)
        left = (now * 50)+"%";
        //3. increase opacity of next_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({'transform': 'scale('+scale+')'});
        next_fs.css({'left': left, 'opacity': opacity});
      }, 
      duration: 800, 
      complete: function(){
        current_fs.hide();
        animating = false;
      }, 
      //this comes from the custom easing plugin
      easing: 'easeInOutBack'
    });
  }
});

$(".previous").click(function(){
  if(animating) return false;
  animating = true;
  fieldsetn = fieldsetn - 1;
  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();
  
  //de-activate current step on progressbar
  $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
  
  //show the previous fieldset
  previous_fs.show(); 
  //hide the current fieldset with style
  current_fs.animate({opacity: 0}, {
    step: function(now, mx) {
      //as the opacity of current_fs reduces to 0 - stored in "now"
      //1. scale previous_fs from 80% to 100%
      scale = 0.8 + (1 - now) * 0.2;
      //2. take current_fs to the right(50%) - from 0%
      left = ((1-now) * 50)+"%";
      //3. increase opacity of previous_fs to 1 as it moves in
      opacity = 1 - now;
      current_fs.css({'left': left});
      previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
    }, 
    duration: 800, 
    complete: function(){
      current_fs.hide();
      animating = false;
    }, 
    //this comes from the custom easing plugin
    easing: 'easeInOutBack'
  });
});

$(".submit").click(function(){
  return false;
})
