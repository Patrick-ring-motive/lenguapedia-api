import fetch from 'node-fetch';
import http from 'http';
import { addCorsHeaders } from './modules/cors-headers.mjs';
import { normalizeRequest, mapResHeaders, applyResponse } from './modules/http-fetch.mjs';
import { serverRequestResponse } from './server.mjs';


process.on('uncaughtException',async e=>console.log(e));

http.createServer(onRequest).listen(3000);

async function onRequest(req, res) {
  try{
  req.socket.setNoDelay();
  req.socket.setKeepAlive(true);
  res.socket.setNoDelay();
  res.socket.setKeepAlive(true);
  //console.log(res.constructor.toString());
  let reqDTO = await normalizeRequest(req);

  let resDTO = await serverRequestResponse(reqDTO);
  return await applyResponse(res, resDTO);
  }catch(e){
    res.statusCode=500;
    res.end('500 '+e.message);
  }

}


function getType(obj) {
  return obj.constructor.toString().split(' ')[1].split('(')[0];
}