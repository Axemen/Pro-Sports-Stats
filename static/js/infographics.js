function buildFacts(newstate){

    //console.log(newstate);
    var panelnfl = d3.select("#nflcard");
    panelnfl.html("");

    d3.csv("static/data/nfl_fast_factss_data.csv").then((nflplayers) => {
    var filteredDatanfl = nflplayers.filter(nflplayers => nflplayers.state === newstate);

    if (typeof(filteredDatanfl) === 'undefined')
    {
      panelnfl.append("h4").text(`NFL`);
    }
    else
    {
    var sorted_av_nfl = filteredDatanfl.sort(function(first, second) {
      return second.AV - first.AV;
  
     }); 
     panelnfl.append("h6").html(`<hr class="hr_for_cards"><img src="/static/icons/user.png" alt="player" width="auto" height="39">
     <br></br>`+ `${sorted_av_nfl[0].Player}<br></br>`);
     panelnfl.append("h6").html(`<img src="/static/icons/college.png" alt="player" width="auto" height="39"> <br></br>` + `${sorted_av_nfl[0].college}`);
     panelnfl.append("h6").html(`<br></br><strong>Average Value<\strong><br></br>` + `${sorted_av_nfl[0].AV}`);
    
      //  panelnfl.append("h6").text(`Player: ${sorted_av_nfl[0].Player}`);
      //  panelnfl.append("h6").text(`College: ${sorted_av_nfl[0].college}`);
      //  panelnfl.append("h6").text(`Average Value: ${sorted_av_nfl[0].AV}`);
      
    }
  });

     var panelmlb = d3.select("#mlbcard");
     panelmlb.html("");
 
     d3.csv("static/data/mlb_fast_factss_data.csv").then((mlbplayers) => {
     var filteredDatamlb = mlbplayers.filter(mlbplayers => mlbplayers.state === newstate);
     if (typeof(filteredDatamlb) === 'undefined')
     {
      panelmlb.append("h4").text(`MLB`);
     }
     else
     {
     var sorted_av_mlb = filteredDatamlb.sort(function(first, second) {
       return second.WAR - first.WAR;
   
      }); 
  
      panelmlb.append("h6").html(`<hr class="hr_for_cards"><img src="/static/icons/user.png" alt="player" width="auto" height="39">
      <br></br>`+ `${sorted_av_mlb[0].Player}<br></br>`);
      panelmlb.append("h6").html(`<img src="/static/icons/college.png" alt="player" width="auto" height="39"> <br></br>` + `${sorted_av_mlb[0].college}`);
      panelmlb.append("h6").html(`<br></br><strong>Wins Above Replacement<\strong><br></br>` + `${sorted_av_mlb[0].WAR}`);
     }


    //   panelmlb.append("h6").text(`Player: ${sorted_av_mlb[0].Player}`);
    //   panelmlb.append("h6").text(`College: ${sorted_av_mlb[0].college}`);
    //   panelmlb.append("h6").text(`Wins Above Replacement: ${sorted_av_mlb[0].WAR}`);
    // }
    });

    var panelnba = d3.select("#nbacard");
    panelnba.html("");

    d3.csv("static/data/nba_fast_factss_data.csv").then((nbaplayers) => {
    var filteredDatanba = nbaplayers.filter(nbaplayers => nbaplayers.state === newstate);
    if (typeof(filteredDatanba) === 'undefined')
    {
     panelnba.append("h4").text(`NBA`);
    }
    else
    {
    var sorted_av_nba = filteredDatanba.sort(function(first, second) {
      return second.PER - first.PER;
  
     }); 
     panelnba.append("h6").html(`<hr class="hr_for_cards"><img src="/static/icons/user.png" alt="player" width="auto" height="39">
     <br></br>`+ `${sorted_av_nba[0].Player}<br></br>`);
     panelnba.append("h6").html(`<img src="/static/icons/college.png" alt="player" width="auto" height="39"> <br></br>` + `${sorted_av_nba[0].college}`);
     panelnba.append("h6").html(`<br></br><strong>Player Efficiency Rating<\strong><br></br>` + `${sorted_av_nba[0].PER}`);
    }
   });
    
}



function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#sport-picker");
  
    // Use the list of sample names to populate the select options
    d3.csv("static/data/states.csv").then((statenames) => {
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
