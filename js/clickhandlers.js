$(document).ready(function() {
  
  //click handlers
  $('#power').on('click',function(){ 
    if ($(this).hasClass("power-off")) {
      if ($("#timemachine").is(":visible")) {
        pauseReplay();
        clearViz();
      } 
      initializeServer(); 
    } else {
      stopNetwork(); 
    }
  });

  $('#stop').on('click',function(){ 
    stopNetwork(); 
    $("#status-messages").hide();
  });

  $('#play').on('click',function(){ 
    if ($(this).hasClass("fa-play-circle")) {
      continueReplay(); 
      $(this).removeClass("fa-play-circle");
      $(this).addClass("fa-pause");
    } else {
      $(this).addClass("fa-play-circle");
      $(this).removeClass("fa-pause");
      pauseReplay(); 
    }
  });

  $("#start").click(function() {
    startSim();
  });

  $("#refresh").click(function() {
    replayViz();
  });

  $("#snapshot").click(function() {
    takeSnapshot();
  });

  $("#upload").click(function() {
    uploadSnapshot();
  });

  $("#rec-messages").change(function() {
    if(this.checked) {
      rec_messages = true;
    } else {
      rec_messages = false;
    }
  });

  $('.menuitem').on('click',function(){ 
    switch ($(this).attr("id")) {
      case "selectmocker": 
              selectMocker();
              $("menu").hide("slow");
              break;
      default: 
              selectMocker();
              break;
    }
  });

  $("#showlogs").change(function() {
    if ($('#showlogs').is(":checked") ) {
      $('#output-window').show("slow"); 
    } else {
      $('#output-window').hide("slow"); 
    }
  });

  $('#output-window').on('click',function(){ 
    $('#output-window').toggleClass("closepane"); 
  });

  $('.menu-circle').on('click',function(){ 
    $('.sidebar').toggleClass("closepane"); 
  });

  $('#selected-simulation').text(selectedSim);

  //pollServer();
  setVisualisationFrame();
});

