//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

var fieldsetn = 1;

$(".next").click(function(){
  var error = 0;

  //step 1
  if(fieldsetn == 1){
    var emailVal = $('#email').val();
    var emailReg = /^([\w-\.]+@utah.edu)?$/;

     // Email check
     if(emailVal == ""){
        $('#email').addClass('warning');
        $('#email').attr("placeholder", "Empty, type your Umail address");
        error = 1;
     }else if(!emailReg.test(emailVal)){
        $('#email').addClass('warning');
        $('#email').attr("placeholder", "Type your correct @utah.edu");
        error = 1;
     }else{
      $('#email').removeClass('warning');
     }

    // password check
    var passVal1 = $('#pass').val();
    var passVal2 = $('#pass-check').val();

    if(passVal1 == "" && passVal2 == ""){
      $('#pass').addClass('warning');
      $('#pass-check').addClass('warning');
      $('#pass').attr("placeholder", "Empty, type your password");
      $('#pass-check').attr("placeholder", "Empty, type your password");
      error = 1;
    }else if(passVal1 != passVal2){
      $('#pass').addClass('warning');
      $('#pass-check').addClass('warning');
      $('#pass').attr("placeholder", "Password does not match");
      $('#pass-check').attr("placeholder", "Password does not match");
      error = 1;
    }else if(passVal1.length < 5){
      $('#pass').addClass('warning');
      $('#pass-check').addClass('warning');
      $('#pass').attr("placeholder", "Password has to be at least 6 character");
      $('#pass-check').attr("placeholder", "Password has to be at least 6 character");
      error = 1;
    }else{
      $('#pass').removeClass('warning');
      $('#pass-check').removeClass('warning');
    }

  }
  //step 2
  else if(fieldsetn == 2){
    var picVal = $('#upload').val();
    alert(picVal);

    var uidVal = $('#uofuid').val();
    var uidReg = /^u[0-9]{7}$/;
     // uid check
     if(uidVal == ""){
        $('#uofuid').addClass('warning');
        $('#uofuid').attr("placeholder", "Empty, type your Uid");
        error = 1;
     }else if(!uidReg.test(uidVal)){
        $('#uofuid').addClass('warning');
        $('#uofuid').attr("placeholder", "Type correctly (ex. u0xxxxxx)");
        error = 1;
     }else{
        $('#uofuid').removeClass('warning');
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
     alert(usertypeVal);

     if(usertypeVal == null){
        $('#usertype').addClass('warning');
        alert("hello");
        error = 1;
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
