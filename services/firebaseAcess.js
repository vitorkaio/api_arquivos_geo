import FirebaseService from './firebase-config/firebase';
import Crypto from './criptografia/criptografia';

const usersFire = FirebaseService.database().ref().child('usuarios');

class FirebaseAcess {
  static registerUser(user) {
    return new Promise((resolve, reject) => {
      this.isRegister(user.name).then(res => {
        console.log(res);
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


}// Fim da classe.

export default FirebaseAcess;