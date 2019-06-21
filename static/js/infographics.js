function buildFacts(newstate){

    //console.log(newstate);
    var panelnfl = d3.select("#nflcard");
    panelnfl.html("");

    d3.csv("/libs/unclean_data/nfl_fast_facts_data.csv").then((nflplayers) => {
    var filteredDatanfl = nflplayers.filter(nflplayers => nflplayers.state === newstate);

    var sorted_av_nfl = filteredDatanfl.sort(function(first, second) {
      return second.AV - first.AV;
  
     }); 

     Object.entries(sorted_av_nfl[0]).forEach(([key, value])=> {
       panelnfl.append("h6").text(`${key}:${value}`);
     });
    });

     var panelmlb = d3.select("#mlbcard");
     panelmlb.html("");
 
     d3.csv("/libs/unclean_data/mlb_fast_facts_data.csv").then((mlbplayers) => {
     var filteredDatamlb = mlbplayers.filter(mlbplayers => mlbplayers.state === newstate);
 
     var sorted_av_mlb = filteredDatamlb.sort(function(first, second) {
       return second.WAR - first.WAR;
   
      }); 
 
      Object.entries(sorted_av_mlb[0]).forEach(([key, value])=> {
        panelmlb.append("h6").text(`${key}:${value}`);
      });
    });
    
}



function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#sport-picker");
  
    // Use the list of sample names to populate the select options
    d3.csv("../static/data/states.csv").then((statenames) => {
        statenames.forEach((state) => {
          selector
          .append("option")
          .text(state.State)
          .property("value", state.Abbr);
        });
  
      // Use the first sample from the list to build the initial plots
      const firstState = statenames[0]; console.log(firstState);
        buildFacts(firstState.Abbr);
    });
  }
  
  function optionChanged(newState) {
    // Fetch new data each time a new sample is selected
        buildFacts(newState); console.log(newState);
  }
  
  // Initialize the dashboard
  init();