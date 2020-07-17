var lgreen = "#548235";
var red = "#ffc1c1";
var yellow = "#ffe699";
var green = "#c6e0b4";

function create_players(games) {
  var players = {}
  for (game of games) {
    for (player in game["results"]) {
      if (player in players) {
        console.log(player+" not in list, adding...");
        players[player]={"deaths":0,"survives":0,"draws":0,"wins":0};
      }
    }
  }
  for (game of games) {
    for (player in game["results"]) {
      switch (game["results"][player]) {
        case "death":   verif_players[player]["results"]["deaths"]  -=1;break;
        case "survive": verif_players[player]["results"]["survives"]-=1;break;
        case "draw":    verif_players[player]["results"]["draws"]   -=1;break;
        case "win":     verif_players[player]["results"]["wins"]    -=1;break;
        default:console.log("Error in verift_players");
      }
    }
  }
  for (player in players) {
    for (result in verif_players[player]["results"]) {
      if (verif_players[player]["results"][result] != 0) {
        console.log(player+":"+result+": incorrect! fixing...");
      }
      players[player]["results"][result]
          -=verif_players[player]["results"][result];
    }
  }
  return players;
}




