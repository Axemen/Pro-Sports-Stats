// $(function() {
//    $(window).scroll(function () {
//       if ($(this).scrollTop() > 500) {
//          $('.section_1').addClass('changeColor')
//       }
//       if ($(this).scrollTop() < 500) {
//          $('section_1').removeClass('changeColor')
//       }
//    });
// });

// $(document).ready(function() {
//     var winHeight = $(window).height(),
//         topLimit = winHeight * .2,
//         bottomLimit = winHeight * .8;

//     $(window).on('scroll', function() {
//         $('.scroll li').each(function() {
//             var thisTop = $(this).offset().top - $(window).scrollTop();
//             if (thisTop >= topLimit && (thisTop + $(this).height()) <= bottomLimit) {
//                 $(this).addClass('highlight')
//             } else{
// 							 $(this).removeClass('highlight')
// 							}
//         });
//     });
// });
console.log('listening');
var tStart = 100 // Start transition 100px from top
  , tEnd = 500   // End at 500px
  , cStart = [250, 195, 56]  // Gold
  , cEnd = [179, 217, 112]   // Lime
  , cDiff = [cEnd[0] - cStart[0], cEnd[1] - cStart[1], cEnd[1] - cStart[0]];

$(document).ready(function(){
    $(document).scroll(function() {
        var p = ($(this).scrollTop() - tStart) / (tEnd - tStart); // % of transition
        p = Math.min(1, Math.max(0, p)); // Clamp to [0, 1]
        var cBg = [Math.round(cStart[0] + cDiff[0] * p), Math.round(cStart[1] + cDiff[1] * p), Math.round(cStart[2] + cDiff[2] * p)];
        $("#section-test").css('background-color', 'rgb(' + cBg.join(',') +')');
    });
});
