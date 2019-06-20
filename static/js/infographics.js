function buildFacts(newstate){

    console.log(newstate);
    var panelnfl = d3.select("#nflcard");
    panelnfl.html("");

    d3.csv("../static/data/nfl_player_av_state.csv").then((nflplayers) => {
    var filteredData = nflplayers.filter(nflplayers => nflplayers.state === newstate.Abbr);
   
    //panelnfl.append("h6").text(filteredData.Player);
    // filteredData.forEach((statedata) => {

    //     Object.values(statedata).forEach((value) => {

    //         row.append("td").text(value);
            
    //     })
    // }); 
        // var myKeys = Object.keys(nflplayers).filter(state => state == newstate);
        // console.log(myKeys);
        // let result = myKeys.reduce((r, k) => r.concat(data[k]), []);
        // console.log(result);
        // console.log(nflplayers);
        // console.log(newstate.Abbr);
        // var filtered = nflplayers.filter(function(d) {
        //     if( d["state"] == newstate.Abbr) 
        //     { 
        //         return d;
        //     } 
        //   });
        // console.log(filtered);
        // // nflplayers.filter(function(d) {
        // //     return d["state"] === newstate;
        // // });
        // console.log(newstate.Abbr);
        // filtered.forEach((players) => {
            
        //     // if( players["state"] == newstate.Abbr) 
        //     // {
        //         panelnfl.append("h6").text(players.Player);
        //     // }
           
        // });
        // console.log('Not filtered', Object.entries(nflplayers));
        // var myresult = Object.entries(nflplayers).filter((item) => (item.indexOf('state')> -1))
        // console.log(myresult);
        // .forEach(([key, value]) => {
        //     console.log(`${key}:${value}`);
        //     panelnfl.append("h6").text(`${key}:${value}`);
        // });
    });
    
//     var url = `metadata/${sample}`;
//     // Use `d3.json` to fetch the metadata for a sample
//   d3.json(url).then(function (metadata) {
//     console.log(metadata);
//  // Use d3 to select the panel with id of `#sample-metadata`
//     var panel = d3.select("#sample-metadata");
//  // Use `.html("") to clear any existing metadata
//     panel.html("");
//   // Use `Object.entries` to add each key and value pair to the panel
//     Object.entries(metadata).forEach(([key, value]) => {
//     // Hint: Inside the loop, you will need to use d3 to append new
//     // tags for each key-value in the metadata.
//       panel.append("h6").text(`${key}:${value}`);
//     });
// });
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
      const firstState = statenames[0];
      console.log(firstState);
        buildFacts(firstState);
    });
  }
  
  function optionChanged(newState) {
    // Fetch new data each time a new sample is selected
        buildFacts(newState);
  }
  
  // Initialize the dashboard
  init();