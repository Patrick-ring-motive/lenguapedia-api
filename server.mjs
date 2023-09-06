import {fileFromRequest} from './static-files.mjs';
import {normalizeRequest,mapResDTO,applyResponse} from './modules/http-fetch.mjs';
import {addCorsHeaders} from './modules/cors-headers.mjs';
import fetch from 'node-fetch';
await import('./x.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

globalThis.put=$=>{
    let obj=Object.create(null);
    obj.$=$;
    Object.seal(obj);
    return obj;
    };

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
  
if(path.startsWith('/corsFetch/')){

 
 let apiURLString = path
                    .replace('/corsFetch/','')
                    .replace('/','//')
                    .replace('///','//');

 response = await fetch(apiURLString);
   response = new Response(response.body,response);
    response = cleanResponse(response);
}

if(path.startsWith('/corsFetchStyles/')){


    let apiURLString = path
                       .replace('/corsFetchStyles/','')
                       .replace('/','//')
                       .replace('///','//');
    
    let resp = await fetch(apiURLString);
    let body = await resp.text();
    body = body.replace(/http/gi,'https://lenguapedia-api.vercel.app/corsFetch/http');
    let res = new Response(body,resp);
    response = cleanResponse(res);
    response.fullBody = body;
   }
if(path.startsWith('/jsonp/')){


    let apiURLString = path
                       .replace('/jsonp/','')
                       .replace('/','//')
                       .replace('///','//');
    
    let resp = await fetch(apiURLString);
    let body = await resp.text();
  body = 'document.currentScript.setAttribute(`response-body`,`'+encodeURIComponent(body)+'`);'
    let res = new Response(body,resp);
    res.headers.set('content-type','text/javascript');
    response = cleanResponse(res);
    response.fullBody = body;
  }

if(path.startsWith('/broadSearch')){


   response = new Response(await broadSearch(reqDTO),{headers:{"content-type":"application/json"}});

  
}
  
if(!response){ 
  response = new Response();
  
}


      resDTO=mapResDTO(resDTO,response);
      resDTO = cleanResponse(resDTO);
      resDTO.body=Buffer.from(response.fullBody||(await response?.arrayBuffer?.()));
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
    if(!response.headers){response.headers={};}
    let headers=response.headers;
    if(headers.delete){
      headers.delete('Access-Control-Allow-Origin');     
      headers.delete('Access-Control-Allow-Methods');
      headers.delete('Access-Control-Allow-Headers');
      headers.delete('Access-Control-Allow-Credentials');
      headers.delete('Access-Control-Max-Age');
      headers.delete('Referrer-Policy');
      headers.delete('Content-Security-Policy');
      headers.delete('X-Frame-Options');
      headers.delete('Strict-Transport-Security');
      headers.delete('X-Content-Type-Options');
      headers.delete('Cross-Origin-Embedder-Policy');
      headers.delete('Cross-Origin-Resource-Policy');
      headers.delete('Cross-Origin-Opener-Policy');
    }
      delete(headers['Access-Control-Allow-Origin']);     
      delete(headers['Access-Control-Allow-Methods']);
      delete(headers['Access-Control-Allow-Headers']);
      delete(headers['Access-Control-Allow-Credentials']);
      delete(headers['Access-Control-Max-Age']);
      delete(headers['Referrer-Policy']);
      delete(headers['Content-Security-Policy']);
      delete(headers['X-Frame-Options']);
      delete(headers['Strict-Transport-Security']);
      delete(headers['X-Content-Type-Options']);
      delete(headers['Cross-Origin-Embedder-Policy']);
      delete(headers['Cross-Origin-Resource-Policy']);
      delete(headers['Cross-Origin-Opener-Policy']);
  
      if(headers.set){
        headers.set('Access-Control-Allow-Origin',"*");
      }
      headers['Access-Control-Allow-Origin']='*';
return response;
}