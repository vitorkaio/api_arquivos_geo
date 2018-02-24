import { Dropbox } from 'dropbox';
import 'isomorphic-fetch';

let instance = null;

class DropBoxService {

  constructor() {
    if(!instance) {
      this.__dbx = new Dropbox({accessToken: "XWXkPnN5rtAAAAAAAAAAKHpJiCIqnf3tTREHo1BrvgWeSQjWG-jLnotV4DRSOR_N"});
      instance = this;
    }
    return instance;
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.__dbx.filesListFolder({path: ''}).then(res => {
        console.log(res);
        resolve(res);
      }).catch(err => {
        console.log(err);
        reject(err);
      })
    });
  }

  // Faz o upload do arquivo.
  uploadArquivo(file, path_name) {
    return new Promise((resolve, reject) => {
      this.__dbx.filesUpload({path: "/" + path_name, contents: file})
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

}// Fim da classe.

export default DropBoxService;