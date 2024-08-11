$(document).on('click', '.post-header', function(e){
  if ($("#" + e.target.id).hasClass('active')){
    $(".post-header").removeClass('active');
    $("." + e.target.id).addClass('invisible');
  } else {
    $("." + e.target.id).removeClass('invisible');
    $("#" + e.target.id).addClass('active');
  }
});
