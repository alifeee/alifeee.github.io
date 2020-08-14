function createMosaic(steamID) {
  let id = document.getElementById("steamID").value;
  let link = "https://steamcommunity.com/id/" + id + "/games/?tab=all";
  if (!isNaN(id)) {
    link = "https://steamcommunity.com/profiles/" + id + "/games/?tab=all";
  }
  $.ajax({
    url: link,
    success: function(data) {getGamesList(data);}
  });
}

function getGamesList(htmlStr) {
  console.log(htmlStr);
}
