function broadSearch(query){
  const request = new XMLHttpRequest();
  request.open("GET", "https://api.lenguapedia.org/broadSearch/?q="+query, false);
  request.send(null);
  return JSON.parse(request.responseText);
}