import FirebaseService from './firebase-config/firebase';
import Crypto from './criptografia/criptografia';
import filesNear from './funcoes';

const usersFire = FirebaseService.database().ref().child('usuarios');
const filesFire = FirebaseService.database().ref().child('files');

class FirebaseAcess {

  // Cadastra um usuário no sistema.
  static registerUser(user) {
    return new Promise((resolve, reject) => {
      this.isRegister(user.name).then(res => {
        // console.log(res);
        if(res.msg === 0) {
          // Gerar id.
          const _id = '_' + Math.random().toString(36).substr(2, 9);
          const fireUser = {
            id: _id,
            name: user.name,
            pass: Crypto.crypt(user.pass)
          };
          const fire = usersFire.child(`${fireUser.name}`);
          fire.set(fireUser, erro => {
            if(erro)
              reject({msg: 501, data: "Erro interno do servidor"});
            else 
              resolve({msg: 1, data: fireUser});
          });
        }
        else
          reject({msg: 0, data: "Usuário já cadastrado"});
      }).catch(err => {
        reject(err);
      });
    });
  }

  // Verifica se o usuário já está cadastrado no sistema.
  static isRegister(name) {
    return new Promise((resolve, reject) => {
      usersFire.orderByKey().equalTo(name).on('value', snap => {
        if(snap.val() !== null)
          resolve({msg: 1, data: snap.val()[Object.keys(snap.val())[0]]});
        else
          resolve({msg: 0, data: "Usuário não cadastrado"});
      }, (errorObject) => {
        reject({msg: 501, data: "Erro interno do servidor"});
      });
    })
  }

  // Cadastra informações de um arquivo no banco de dados.
  static registerFile(info) {
    return new Promise((resolve, reject) => {
      this.fileIsRegister(info.path_name).then(snap => {
        if(snap === true) {
          filesFire.push(info, erro => {
            if(erro)
              reject({msg: 501, data: "Erro interno do servidor"});
            else 
              resolve({msg: 1, data: "Arquivo salvo"});
         });
        }
        else
          reject({msg: 0, data: "Arquivo já cadastrado"});
      });      
    });
  }

  // Verifica se um arquivo já foi cadastrado.
  static fileIsRegister(path_name) {
    return new Promise((resolve, reject) => {
      filesFire.orderByChild("path_name").equalTo(path_name).on("value", (snap) => {
        if(snap.val() === null)
          resolve(true);
        else
          resolve(false);
      });
    });
  }

  // Retorna todos os arquivos de um usuário.
  static getFilesUser(id_usuario) {
    return new Promise((resolve, reject) => {
      filesFire.orderByChild("id_usuario").equalTo(id_usuario).on("value", (snap) => {
        if(snap.val() === null)
          reject({msg: 0, data: null});
        else {
          const chave = snap.val();
          resolve({msg: 1, data: chave});
        }
      });
    });
  }

  // Retorna todos os arquivos que estão perto de um usuário.
  static getFilesNear(coord) {
    return new Promise((resolve, reject) => {
      filesFire.orderByChild("id_usuario").on("value", (snap) => {
        if(snap.val() === null)
          reject({msg: 0, data: null});
        else {
          const chaves = snap.val();
          const lista = [];
          for(let x = 0; x < Object.keys(chaves).length; x++) {
            const info = chaves[Object.keys(chaves)[x]];
            const near = filesNear(coord, info.coord);
            if(near === true)
              lista.push(info);
          }
          resolve({msg: 1, data: lista});
        }
      });
    });
  }

  // Retorna a chave de um arquivo.
   static getKey(path_name) {
    return new Promise((resolve, reject) => {
       filesFire.orderByChild("path_name").equalTo(path_name).on("value", (snap) => {
        if(snap.val() !== null) {
          const key = Object.keys(snap.val())[0];
          // console.log(key);
          resolve(key);
        }
        else {
          // console.log("ERROOOOOOOOOOOO, ", snap.val());
          reject(0);
        }
      }, (errorObject) => {
        // console.log("ERROROBJETC, ", errorObject);
        reject(0);
      });
    });
  }

  // Deleta info de um arquivo.
   static deleteInfoArquivo(path_name) {
    return new Promise((resolve, reject) => {
      this.getKey(path_name).then(res => {
        // console.log("************ MINHA CHAVE: ", res);
        if(res !== 0) {
          const delFile = filesFire.child(res);
            delFile.remove().then(delsnap => {
              // console.log("res: ", delsnap);
              resolve(1);
            }).catch(err => {
              // console.log("****DELETEINFOARQUIVO, ", err);
              reject(err);
            });
        }
      }).catch(err => {
        // console.log("DELETEINFOARQUIVO, ", err);
        reject(err);
      });
        
    });
  }


}// Fim da classe.

export default FirebaseAcess;