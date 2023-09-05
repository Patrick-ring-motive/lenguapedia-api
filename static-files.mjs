import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




export function fileFromRequest(url) {
  let resDTO={}
  resDTO.url=url;
  let URI = url.replaceAll('*', '');
  let shortURI = URI.split('?')[0].split('#')[0];

  if (shortURI[shortURI.length - 1] == '/') {
    shortURI = shortURI + 'index.html';
  }
  try {
    let fileLocation = path.join(__dirname, shortURI);
    let file = fs.readFileSync(fileLocation);
    let type = 'text/html';
    try {
      type = mime.lookup(fileLocation) || 'text/html';
    } catch (e) {
      type = 'text/html';
    }
    resDTO.contentType = type;
    resDTO.statusCode = 200;
    resDTO.body = file;
    return resDTO;
  } catch (e) {
    console.log(e.message);
    resDTO.statusCode = 404;
    resDTO.body = 'File not found ' + e.message;
    return resDTO;
  }


}


