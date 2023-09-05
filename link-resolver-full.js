void async function LinkResolverModule(){
  globalThis.replaceHost=new URL(document.querySelector('meta[property="og:url"]').getAttribute('content')).host;

  await import('https://files-servleteer.vercel.app/x.js');

void async function HTMLLinkResolver() {
if(!globalThis.window){return;}
  

  const hostProxy = window.location.host;
  let hostList = Q(U=>JSON.parse(atob(document.currentScript.getAttribute('host-list'))))||[];
  hostList.push(globalThis.replaceHost);
  let hostListRegex = [];

  const hostList_length = hostList.length;
  let hostListQuery = 'hostListQuery';
    
  for(let i=0;i<hostList_length;i++){
     hostListRegex.push(new RegExp(hostList[i], "gi"));
  }

  setInterval(async function() {

    relativeTagsFix('href');
    relativeTagsFix('src');

    proxyTagsFix('href');
    proxyTagsFix('action');
    //proxyTagsFix('src');
    proxyTagsFix('data-src');
    proxyTagsFix('style');
    //proxyTagsFix('srcset');
    proxyTagsFix('data-srcset');
      

    httpsForce('href');
    httpsForce('src');
    httpsForce('data-src');
    httpsForce('style');
    httpsForce('srcset');
    httpsForce('data-srcset');
      
      styleTagsFix();

      
  }, 100);



function relativeTagsFix(attr){

    let relativeTags = document.querySelectorAll('['+attr+'^="/"],['+attr+'^="./"],['+attr+'^="../"],['+attr+']:not(['+attr+'*=":"])');
    const relativeTags_length = relativeTags.length;
    for (let i = 0; i < relativeTags_length; i++) {
     try {

        relativeTags[i].setAttribute(attr, relativeTags[i][attr]);

     } catch (e) { continue; }
    }

}
    
function proxyTagsFix(attr){

    hostListQuery = 'hostListQuery';
    for (let i = 0; i < hostList_length; i++) {
      hostListQuery = hostListQuery + ',' + `[`+attr+`*="/` + hostList[i] + `" i]:not([`+attr+`^="blob:"])`;
      hostListQuery = hostListQuery + ',' + `[`+attr+`*="/www.` + hostList[i] + `" i]`;
    }
    const attr_list = document.querySelectorAll(hostListQuery);
    const attr_list_length = attr_list.length;

    for (let i = 0; i < hostList_length; i++) {
      for (let x = 0; x < attr_list_length; x++) {
        try {
          attr_list[x].setAttribute(attr, attr_list[x].getAttribute(attr).replace(hostListRegex[i], hostProxy));
        } catch (e) { continue; }
      }
    }

}

function styleTagsFix(){
const styleTags = document.querySelectorAll('style:not([url-rewritten])');
const styleTags_length = styleTags.length;
    for (let i = 0; i < hostList_length; i++) {
      for (let x = 0; x < styleTags_length; x++) {
        try {
          styleTags[x].setAttribute('url-rewritten','false');
          if(styleTags[x].textContent.toLowerCase().includes(hostProxy+'/')){
               styleTags[x].textContent = styleTags[x].textContent.replace(hostListRegex[i], hostProxy);
               styleTags[x].setAttribute('url-rewritten','true');
            }
        } catch (e) { continue; }
      }
    }


}
    
function httpsForce(attr){
      let hrefHttp = document.querySelectorAll('['+attr+'*="http://"]');
    const hrefHttp_length=hrefHttp.length;
    for(let i=0;i<hrefHttp_length;i++){try{
      hrefHttp[i].setAttribute(attr,hrefHttp[i].replace('http://','https://'));
    }catch(e){continue;}}
}


}?.();


void async function fetchResolver(){
if(!globalThis.window){return;}



let replaceHost = globalThis.replaceHost;

globalThis.nativeFetch = globalThis.fetch;

globalThis.customFetch = async function(request, headers) {

  let req;
  let response;
  if (typeof request == 'string') {
    request = request.replaceAll(replaceHost, window.location.host);
    req = new Request(request, headers);
    response = await window.nativeFetch(req);
    response.requestInputObject = req;
  } else {
    response = await window.nativeFetch(request, headers);
  }
  if (typeof request == 'object') {

    response.requestInputObject = request;

  } else {

    response.requestInputURL = request;
    response.requestInputObject = req;

  }

  if (headers) { response.requestInputHeaders = headers; }

  return response;

}
globalThis.fetch = globalThis.customFetch;

  
}?.();


void async function xhrResolver(){
if(!globalThis.window){return;}




let rH = globalThis.replaceHost;
if(!XMLHttpRequest.nativeOpen){
XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.customOpen = function(method, url, asynch, user, password) {
  url = url.replaceAll(rH, window.location.host);

  this.method = method;
  this.requestURL = url;
  this.asynch = asynch;
  if (user) { this.user = user; }
  if (password) { this.password = password; }
  this.requestHeaders = new Map();

  return this.nativeOpen(method, url, asynch, user, password);

}

XMLHttpRequest.prototype.open = XMLHttpRequest.prototype.customOpen;



/*//////////////////////////////////////////////////////////////////////////*/


XMLHttpRequest.nativeOpen = XMLHttpRequest.open;

XMLHttpRequest.customOpen = function(method, url, asynch, user, password) {
  url = url.replaceAll(rH, window.location.host);
  this.method = method;
  this.requestURL = url;
  this.asynch = asynch;
  if (user) { this.user = user; }
  if (password) { this.password = password; }
  this.requestHeaders = new Map();

  return this.nativeOpen(method, url, asynch, user, password);

}

XMLHttpRequest.open = XMLHttpRequest.customOpen;
  
}



  
}?.();

}?.();


