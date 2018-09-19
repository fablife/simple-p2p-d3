$(document).ready(function() {
  /*
  timemachine = $("#timemachine").get(0);
  DISABLE MANUALLY MOVING THE SLIDER FOR NOW
  ["input", "change"].forEach(function(evtType) {
    timemachine.addEventListener(evtType,  function() {
      eventLog[evtType] += 1;
      timeStep();
    });
  });

  onRangeChange(timemachine, rangeListener);
  */
  $(".speedDial").on("click", function() {

    if (!TimemachinePlaying) {
      return;
    }
    var $button = $(this);
    var oldValue = $button.parent().find("input").val();
    var newVal = 0;

    if ($button.text() == "+") {
      if (oldValue < 200) {
        newVal = parseFloat(oldValue) + 20;
      } else {
        newVal = parseFloat(oldValue) + 200;
      }
    } else {
     // Don't allow decrementing below 20
      if (oldValue > 200) {
        newVal = parseFloat(oldValue) - 200;
      } else {
        if (oldValue > 20) {
          newVal = parseFloat(oldValue - 20);
        } else {
          newVal = 20;
        }
      }
    }

    $button.parent().find("input").val(newVal);
    replaySpeed = newVal;
    clearInterval(replayInterval);
    replayInterval = setInterval(function() {TimemachineStep(TimemachineIndex)}, replaySpeed);
  });
});

var TimemachineIndex  = 0;
var replayInterval    = false;
var TimemachinePlaying= false;
var replaySpeed       = 200;

function onRangeChange(ranger, listener) {
/* DISABLE FOR NOW
  var inputEvtHasNeverFired = true;
  var rangeValue = {current: undefined, mostRecent: undefined};
  
  ranger.addEventListener("input", function(evt) {
    inputEvtHasNeverFired = false;
    rangeValue.current = evt.target.value;
    if (rangeValue.current !== rangeValue.mostRecent) {
      var forward = true;
      if (rangeValue.current < rangeValue.mostRecent) {
        forward = false;
      }
      listener(evt, forward);
    }
    rangeValue.mostRecent = rangeValue.current;
  });

  ranger.addEventListener("change", function(evt) {
    if (inputEvtHasNeverFired) {
      listener(evt);
    }
  }); 
*/
};

var eventLog = {input: 0, change: 0, custom: 0};
var Timemachine = false;

var timeStep = function() {
};

var rangeListener = function(timeEvent, fwd) {
  eventLog["custom"] += 1;
  
  var eventHistoryIndex = Math.round(timeEvent.target.value*eventHistory.length/100) -1;
  if (eventHistoryIndex > currHistoryIndex ) {
    for (var i=currHistoryIndex; i<=eventHistoryIndex; i++) {
       TimemachineForward(i);
    }
  } else {
    for (var i=currHistoryIndex; i>=eventHistoryIndex; i--) {
      TimemachineBackward(i);
    }
  }

  timeStep();
  currHistoryIndex = eventHistoryIndex;
}

function setupTimemachine() {
  TimemachineIndex = 0;
  currHistoryIndex = eventHistory.length -1;
  //$("#timemachine").val(100);
  $("#timemachine").val(0);
  if (rec_messages && !Timemachine) {
    analyzeMsgs();
  }
  Timemachine = true;
  init3DVisualisation();
}

function continueReplay() {
  TimemachineReplay();
}

function pauseReplay() {
  clearInterval(replayInterval);
}

TimemachineReplay = function() {
  if (!TimemachineIndex) {
    $("#timemachine").val(0);
  }
  replayInterval = setInterval(function() {TimemachineStep(TimemachineIndex)}, replaySpeed);
}

TimemachineStep = function(idx) {
  TimemachineForward(idx);
  if (idx == eventHistory.length - 1) {
    //Timemachine.simulation.stop();
    TimemachinePlaying = false;
    clearInterval(replayInterval);
    $("#power").removeClass("stale");
    $("#play").addClass("fa-play-circle");
    $("#play").removeClass("fa-pause");
    TimemachineIndex = 0;
    return;
  }
  TimemachineIndex++;
  $("#timemachine").val(100*TimemachineIndex / eventHistory.length);
}

TimemachineForward = function(idx) {
  var evt         = eventHistory[idx];
  var time        = evt.timestamp;
  var content     = $.extend(true, {}, evt.content);
  $("#time-elapsed").text(time);

  if (content.code != null) {
    if (!(activeFilters.has(content.code))) {
      return
    }
  }
  handleEvent(content); 
}


TimemachineBackward = function(idx) {
  var evt         = eventHistory[idx];
  var time        = evt.timestamp;
  var content     = evt.content;
  $("#time-elapsed").text(time);

  handleEvent(content); 
}
