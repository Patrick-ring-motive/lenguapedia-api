//for cloudflare

function getType(obj) {
  return obj.constructor.toString().split(' ')[1].split('(')[0];
}

function isCloudflareRequest(req) {

  if ((getType(req) == 'Request') && (req.headers?.getAll)) { return true; }

  return false;

}

function isCloudflareResponse(res) {

  if ((getType(res) == 'Response') && (res.headers?.getAll)) { return true; }

  return false;

}

function isNodeHTTPRequest(req) {
  if (getType(req) == 'IncomingMessage') {
    return true
  }
  return false;
}

function isNodeHTTPRequest(res) {
  if (getType(res) == 'ServerResponse') {
    return true
  }
  return false;
}

function isNodeFetchRequest(req) {

  if ((getType(req) == 'Request') && (globalThis.global)) { return true; }

  return false;

}

function isNodeFetchResponse(res) {

  if ((getType(res) == 'Response') && (globalThis.global)) { return true; }

  return false;

}

function isFetchRequest(req) {

  if ((getType(req) == 'Request') && (!globalThis.global)) { return true; }

  return false;

}

function isFetchResponse(res) {

  if ((getType(res) == 'Response') && (!globalThis.global)) { return true; }

  return false;

}

function DTOAssign(obj, target) {

  let keys = Reflect.ownKeys(obj);
  const keys_length = keys.length;
  for (let i = 0; i < keys_length; i++) {
    const val = obj[keys[i]];
    if (val && !target[keys[i]]) {
      target[keys[i]] = val;
    }
  }

  for (const prop in obj) {
    if ((!target[prop]) && (obj[prop])) {
      target[prop] = obj[prop];
    }
  }

  return target;

}

function headerCase(str) {

  let headerTokens = str.split('-');
  const headerTokens_length = headerTokens.length;
  for (let i = 0; i < headerTokens_length; i++) {

    headerTokens[i] = headerTokens[i].split('');
    headerTokens[i][0] = ('' + headerTokens[i][0]).toUpperCase();
    headerTokens[i] = headerTokens[i].join('');
  }
  str = headerTokens.join('-');
  return str;
}

function getCloudflareHeadersDTO(headers) {


  let headersDTO = {};
  let headersMap = new Map(headers);
  for (let [key, value] of headersMap) {
    headersDTO[headerCase(key)] = value;
  }
  if (headers.getAll) {
    let setCookieHeaders = headers.getAll("Set-Cookie");
    if (setCookieHeaders && (setCookieHeaders.length > 0)) {

      headersDTO['Set-Cookie'] = setCookieHeaders;

    }

  }
  return headersDTO;
}

function getRequestDTO(req) {

  if (isCloudflareRequest(req)) {
    return getCloudflareRequestDTO(req);
  }

}

function getCloudflareRequestDTO(req) {

  let reqDTO = {};

  let cons = req.constructor;
  let pro = cons.prototype;

  reqDTO = DTOAssign(req, reqDTO);
  reqDTO = DTOAssign(cons, reqDTO);
  reqDTO = DTOAssign(pro, reqDTO);

  reqDTO.headers = getCloudflareHeadersDTO(req.headers);

  return reqDTO;

}



function getCloudflareRequest(reqDTO) {


  let req = new Request(reqDTO.body, reqDTO);
  req = DTOAssign(reqDTO, req);
  return req;

}

function assignCloudflareRequest(reqDTO, reqObj) {
  let req = new Request(reqObj.body, reqObj);
  let req_headers = req.headers;
  let reqDTO_headers = reqDTO.headers;
  req = DTOAssign(reqDTO, req);
  for (key in reqDTO_headers) {
    if (key.toLowerCase() != 'set-cookie') { req_headers.set(key, reqDTO_headers[key]); } else { req_headers.append(key, reqDTO_headers[key]); }

  }
  req.headers = req_headers;

  return req;

}

function getResponseDTO(res) {

  if (isCloudflareResponse(res)) {
    return getCloudflareResponseDTO(res);
  }

}



function getResponseDTO(res) {

  if (isCloudflareResponse(res)) {
    return getCloudflareResponseDTO(res);
  }

}


function getCloudflareResponseDTO(res) {

  let resDTO = {};

  let cons = res.constructor;
  let pro = cons.prototype;

  resDTO = DTOAssign(res, resDTO);
  resDTO = DTOAssign(cons, resDTO);
  resDTO = DTOAssign(pro, resDTO);

  resDTO.headers = getCloudflareHeadersDTO(res.headers);


  return resDTO;



}

function getCloudflareResponse(resDTO) {

  let res = new Request(resDTO.body, resDTO);
  res = DTOAssign(resDTO, res);

  if (resDTO['Set-Cookie']) {
    let stt = getType(resDTO['Set-Cookie']);
    if (stt == 'String') {

      res.headers.set('Set-Cookie', resDTO['Set-Cookie']);

    }

    if (stt == 'Array') {

      let setCookieHeaders = headers.getAll("Set-Cookie");
      if (setCookieHeaders && (setCookieHeaders.length > 0)) {

        for (let i = 0; i < setCookieHeaders.length; i++) {

          res.headers.append('Set-Cookie', setCookieHeaders[i]);
        }

      }


    }

  }

  return res;

}

function assignCloudflareResponse(resDTO, resObj) {
  let res = new Response(resObj.body, resObj);
  let res_headers = res.headers;
  let resDTO_headers = resDTO.headers;
  res = DTOAssign(resDTO, res);
  for (key in resDTO_headers) {
    if (key.toLowerCase() != 'set-cookie') { res_headers.set(key, resDTO_headers[key]); } else { res_headers.append(key, resDTO_headers[key]); }

  }
  res.headers = res_headers;

  return res;

}

