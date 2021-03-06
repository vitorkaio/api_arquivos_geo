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
        // console.log(res);
        resolve(res);
      }).catch(err => {
        // console.log(err);
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

  // Faz o download do arquivo.
  downloadArquivo(path_name) {
    return new Promise((resolve, reject) => {
      this.__dbx.filesDownload({path: "/" + path_name}).then(snap => {
        // console.log("Donwload feito", snap.fileBinary);
        resolve(snap);
      }).catch(err => {
        // console.log(err);
        reject(null);
      });
    });
  }

  // Deleta um arquivo.
  deletaArquivo(path_name) {
    return new Promise((resolve, reject) => {
      this.__dbx.filesDelete({path: "/" + path_name}).then(snap => {
        resolve(snap);
      }).catch(err => {
        reject(err);
      });
    });
  }
  

}// Fim da classe.

export default DropBoxService;