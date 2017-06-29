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
  var sim = $("#network-visualisation").clone(true, true);
  sim.attr("id", "timemachine-visualisation");
  sim.appendTo("#visualisation-wrapper");
  Timemachine = new P2Pd3(d3.select("#timemachine-visualisation"));
  var self = Timemachine;
  Timemachine.skipCollectionSetup = true; 
  Timemachine.sidebar = visualisation.sidebar; 
  Timemachine.sidebar.visualisation = self; 
  TimemachineIndex = 0;
  /*
  Timemachine.graphNodes = $.extend(true, [], visualisation.graphNodes);
  Timemachine.graphLinks = $.extend(true, [], visualisation.graphLinks);
  Timemachine.nodesById  = $.extend(true, {}, visualisation.nodesById);
  Timemachine.connsById  = $.extend(true, {}, visualisation.connsById);
  */
  Timemachine.nodeCollection = Timemachine.svg.selectAll("circle").data(self.graphNodes);
  Timemachine.nodeCollection
    .on("click", function(d) {
        //deselect
        Timemachine.nodeCollection.classed("selected", function(p) { if (p) {return p.selected = p.previouslySelected = false;} });
        //select
        d3.select(this).classed("selected",true);
        Timemachine.sidebar.updateSidebarSelectedNode(d);
    }) 
    /*
    .call(d3.drag()
        .on("start", function(d){ self.dragstarted(self.simulation, d); } )
        .on("drag", function(d){ self.dragged(d); } )
        .on("end", function(d){ self.dragended(self.simulation, d); } ));
    */
    ;

  Timemachine.linkCollection = Timemachine.svg.selectAll("line").data(self.graphLinks);

  currHistoryIndex = eventHistory.length -1;
  //$("#timemachine").val(100);
  $("#timemachine").val(0);

  $("#timemachine-visualisation").show();
  $("#network-visualisation").hide();
}

function continueReplay() {
  TimemachineReplay();
}

function pauseReplay() {
  clearInterval(replayInterval);
}

TimemachineReplay = function() {
  if (!TimemachineIndex) {
    d3.select("#timemachine-visualisation").selectAll("*").remove();
    Timemachine.sidebar.resetCounters();
    Timemachine.graphNodes = [];
    Timemachine.graphLinks = [];
    Timemachine.nodesById  = {};
    Timemachine.connsById  = {};
    $("#timemachine").val(0);
  }
  replayInterval = setInterval(function() {TimemachineStep(TimemachineIndex)}, replaySpeed);
}

TimemachineStep = function(idx) {
  TimemachineForward(idx);
  if (idx == eventHistory.length - 1) {
    Timemachine.simulation.stop();
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

  Timemachine.updateVisualisation(content); 
  //Timemachine.sidebar.updateSidebarCounts(newNodes, newLinks, removeNodes, removeLinks);
}


TimemachineBackward = function(idx) {
  var evt         = eventHistory[idx];
  var time        = evt.timestamp;
  var content     = evt.content;
  $("#time-elapsed").text(time);

  Timemachine.updateVisualisation(content); 
  //Timemachine.sidebar.updateSidebarCounts(newNodes, newLinks, removeNodes, removeLinks);
}
