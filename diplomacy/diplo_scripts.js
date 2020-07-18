function create_players(games) {
  /* Create a dictionary of players as keys and values are dictionaries
   * of results */
  var all_names = [];
  for (game of games) {
    for (player in game["results"]) {
      if (all_names.indexOf(player)==-1) {
        all_names.push(player);
      }
    }
  }
  var players = {};
  for (player of all_names.sort()) {
    players[player]={"deaths":0,"survives":0,"draws":0,"wins":0};
  }
  for (game of games) {
    for (player in game["results"]) {
      switch (game["results"][player]) {
        case "death":   players[player]["deaths"]  +=1;break;
        case "survive": players[player]["survives"]+=1;break;
        case "draw":    players[player]["draws"]   +=1;break;
        case "win":     players[player]["wins"]    +=1;break;
        default:console.log("Error in verift_players");
      }
    }
  }
  return players;
}


function create_performance(players) {
  /* Create a dictionary of player keys and performance values */
  var scores = {}
  for (player in players) {
    scores[player] = 0;
    scores[player] += players[player]["wins"]     * 10;
    scores[player] += players[player]["draws"]    * 5;
    scores[player] += players[player]["survives"] * 1;
    scores[player] = scores[player] / (players[player]['wins'] 
        + players[player]['draws'] 
        + players[player]['survives'] 
        + players[player]['deaths']);
  }
  return scores;
}


function create_alex_performance(games, players) {
  /* Create performance values based on Alex's criteria */
  var alex_scores = {};
  for (player in players) {
    alex_scores[player] = 0;
  }
  for (game of games) {
    var localScore = {};
    var result = game["results"];
    var draws = 0;
    var victory = Object.keys(result).length;
    for  (player in result) {
      switch(result[player]) {
        case "death":   localScore[player]=0;       break;
        case "survive": localScore[player]=1;       break;
        case "win":     localScore[player]=victory; break;
        case "draw":    draws += 1;                 break;
        default: console.log("Error in create_alex_performance");
      }
    }
    for (player in result) {
      if (result[player]=="draw") {
        localScore[player] = victory/draws;
      }
    }
    for (player in alex_scores) {
      if (typeof localScore[player]=="number") {
        alex_scores[player] = alex_scores[player] + localScore[player];
      }
    }
  }
  for (player in alex_scores) {
    alex_scores[player] = alex_scores[player] / (players[player]['wins'] 
        + players[player]['draws'] 
        + players[player]['survives'] 
        + players[player]['deaths']);
  }
  return alex_scores;
}


function table_headers(players) {
  /* Create html for the top of the results table */
  var text = "";
  text += "<tr>";
  text += "<th>Map</th>";
  text += "<th>Games</th>";
  for (player in players) {
    text += "<th>" + player + "</th>";
  }
  text += "</tr>";
  return text;
}


function table_data(games, players) {
  /* Create html for the data of the results table, including links
   * to games as well as colouring the cells based on the result */
  var text = "";
  for (game of games) {
    text += "<tr>";
    text += "<td><a target='_blank' style='text-decoration:none' href='https://vdiplomacy.com/variants.php?variantID="
        +game['map']['id']+"'>"
        +game['map']['name']+"</a></td>";
    var site = "v";
    if (game["id"] == 256214) {site = "web";}
    var game_link = "https://"+site+"diplomacy.com/board.php?gameID="
        +game["id"];
    var img_link = "https://alifeee.github.io/diplomacy/vdip.png";
    text += "<td style='text-align:center'><a target='_blank' href="+
        game_link +"'><img src='"+img_link+"'></img></a></td>";
    var color = "";
    for (player in players) {
      if (!(player in game["results"])) {
        text += "<td>-</td>";
        continue;
      }
      var color = "";
      switch(game["results"][player]) {
        case "win":     color="#548235"; break;
        case "death":   color="#ffc1c1"; break;
        case "survive": color="#ffe699"; break;
        case "draw":    color="#c6e0b4"; break;
        default: console.log("Problem in table_data");
      }
      text += "<td style='background-color:"+color+";color:black'>"
          +game['results'][player]+"</td>";
    }
    text += "</tr>";
  }
  return text;
}


function table_performance(players, scores) {
  /* Create the performance row */
  var text = "";
  text += "<tr>";
  text += "<td>Performance</td>";
  text += "<td>-</td>";
  for (player in scores) {
    text += "<td>"+scores[player].toFixed(2)+"</td>";
  }
  text += "</tr>";
  return text;
}


function table_alex_performance(players, alex_scores) {
  /* Create the 'Alex' performance row */
  var text = "";
  text += "<tr>"
  text += "<td>Alex's Performance</td>";
  text += "<td>-</td>";
  for (player in players) {
    text += "<td>"+alex_scores[player].toFixed(2)+"</td>";
  }
  text += "</tr>";
  return text;
}


function bar_graph(x, y, location, y_title) {
  /* Create a bar chart with x as labels, y as heights, location
   * is the id of the canvas container, and y_title is the y-axis
   * title */
  var ctx = document.getElementById(location).getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: x,
          datasets: [{
              label: y_title,
              data: y,
              borderWidth: 1,
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)'
          }]
      },
      options: {
          responsiveness: true,
          maintainAspectRatio: false,
          legend: {
            display:false
          },
          scales: {
              yAxes: [{
                scaleLabel: {
                  display:true,
                  labelString: y_title
                },
                ticks: {
                  beginAtZero: true
                }
              }]
          }
      }
  });
}


function sort_by_second(arr_a, arr_b, direction) {
  /* Input two lists and this function will sort the second
   * list in the direction specified (1 = smallest to largest, -1
   * = largest to smallest), and return that sorted list as well 
   * as a second list in the same order as the sorted first */

  arr1 = JSON.parse(JSON.stringify(arr_a));
  arr2 = JSON.parse(JSON.stringify(arr_b));
  var list = [];
  for (var j = 0; j < arr1.length; j++) {
    list.push({"one":arr1[j], "two":arr2[j]});
  }
  list.sort(function(a, b) {
    return ((a.two < b.two) ? 1 : ((a.two == b.two) ? 0 : -1))
  });
  for (var k = 0; k < list.length; k++) {
    arr1[k] = list[k].one;
    arr2[k] = list[k].two;
  }
  return [arr1, arr2];
}























