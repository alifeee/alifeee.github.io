var lgreen = "#548235";
var red = "#ffc1c1";
var yellow = "#ffe699";
var green = "#c6e0b4";

function create_players(games) {
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
    console.log(player+": "+alex_scores[player]);
    alex_scores[player] = alex_scores[player] / (players[player]['wins'] 
        + players[player]['draws'] 
        + players[player]['survives'] 
        + players[player]['deaths']);
  }
  console.log(alex_scores);
  console.log(localScore);
  return alex_scores;
}


function table_headers(players) {
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
  var text = "";
  for (game of games) {
    text += "<tr>";
    text += "<td><a style='text-decoration:none' href='https://vdiplomacy.com/variants.php?variantID="
        +game['map']['id']+"'>"
        +game['map']['name']+"</a></td>";
    var site = "v";
    if (game["id"] == 256214) {site = "web";}
    var game_link = "https://"+site+"diplomacy.com/board.php?gameID="
        +game["id"];
    var img_link = "https://alifeee.github.io/diplomacy/vdip.png";
    text += "<td style='text-align:center'><a href="+game_link
        +"'><img src='"+img_link+"'></img></a></td>";
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















