import {fileFromRequest} from './static-files.mjs';
import {normalizeRequest,mapResDTO,applyResponse} from './modules/http-fetch.mjs';
import {addCorsHeaders} from './modules/cors-headers.mjs';
import fetch from 'node-fetch';
await import('./x.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let hostTarget = 'cse.google.com';
let hostList = [];
hostList.push(hostTarget);

export async function serverRequestResponse(reqDTO){
  
  let resDTO={};
  resDTO.headers={};
  let hostProxy = reqDTO.host;
  let path = reqDTO.shortURL.replaceAll('*', '');
  let pat = path.split('?')[0].split('#')[0];

let response;
  
if(path.startsWith('/corsFetch')){

 let apiURL = new URL(request.url);
 let apiURLString = apiURL.pathname
                    .replace('/corsFetch/','')
                    .replace('/','//')
                    .replace('///','//')+
                    apiURL.search;
 
 let resp = await fetch(apiURLString);
 let res = new Response(resp.body,resp);
 response = cleanResponse(res);
}

if(path.startsWith('/corsFetchStyles')){

    let apiURL = new URL(reqDTO.url);
    let apiURLString = apiURL.pathname
                       .replace('/corsFetchStyles/','')
                       .replace('/','//')
                       .replace('///','//')+
                       apiURL.search;
    
    let resp = await fetch(apiURLString);
    let body = await resp.text();
    body = body.replace(/http/gi,'https://lenguapedia-api.vercel.app/corsFetch/http');
    let res = new Response(body,resp);
    response = cleanResponse(res);
   }

if(path.startsWith('/broadSearch')){


   response = new Response(await broadSearch(reqDTO),{headers:{"content-type":"application/json"}});

  
}else{
  
  response = new Response();
  
}






      resDTO.body=Buffer.from(await response?.arrayBuffer?.());
      return resDTO;

    
  


}


globalThis.JSONExtract=function (raw, key) {

    let json_key = '"' + key + '"';
    let json_val = raw.split(json_key)[1].split('"')[1];

    return json_val;


  }


globalThis.LoadCSE = async function (cx) {

    let cxurl = 'https://cse.google.com/cse.js?hpg=1&cx=' + cx;

    let script_raw = await(await fetch(cxurl)).text();

    let cse_tok = JSONExtract(script_raw, "cse_token");

    globalThis.broadSearch.cse_token=cse_tok;
    
    return cse_tok;
};


globalThis.broadSearch=async function(query){
    query=query.url.split('q=')[1];
    let cx = 'c312bbfa96748406f';

    let cse_tok = globalThis.broadSearch.cse_token;
    if(!cse_tok){
        cse_tok=await globalThis.LoadCSE(cx);
    }


    let cse_url = 'https://cse.google.com/cse/element/v1?rsz=filtered_cse&num=10&hl=en&source=gcsc&gss=.com&cx=' + cx + '&q=' + encodeURIComponent(query) + '&safe=off&cse_tok=' + cse_tok + '&lr=&cr=&gl=&filter=1&sort=&as_oq=&as_sitesearch=&exp=csqr,cc&cseclient=hosted-page-client&callback=google.search.cse.api';

  let cse_response = await (await fetch(cse_url)).text();
  cse_response=cse_response.split('google.search.cse.api(')[1].trim();
  cse_response=cse_response.split('');
  cse_response.length=cse_response.length-2;
  cse_response=cse_response.join('');
  cse_response=cse_response.replace(/wikipedia/gi,'lenguapedia');
  return cse_response;
}






function cleanResponse(response){
    response.headers.delete('Access-Control-Allow-Origin');     
    response.headers.set('Access-Control-Allow-Origin',"*");
    response.headers.delete('Access-Control-Allow-Methods');
    response.headers.delete('Access-Control-Allow-Headers');
    response.headers.delete('Access-Control-Allow-Credentials');
    response.headers.delete('Access-Control-Max-Age');
    response.headers.delete('Referrer-Policy');
    response.headers.delete('Content-Security-Policy');
    response.headers.delete('X-Frame-Options');
    response.headers.delete('Strict-Transport-Security');
    response.headers.delete('X-Content-Type-Options');
    response.headers.delete('Cross-Origin-Embedder-Policy');
    response.headers.delete('Cross-Origin-Resource-Policy');
    response.headers.delete('Cross-Origin-Opener-Policy');
return response;
}