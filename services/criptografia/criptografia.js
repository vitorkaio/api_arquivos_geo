import crypto from 'crypto';

const DADOS_CRIPTOGRAFAR = {
  algoritmo : "aes256",
  segredo : "vih",
  tipo : "hex"
};

const DADOS_DESCRIPTOGRAFAR = {
  algoritmo : "aes256",
  codificacao : "utf8",
  segredo : "vih",
  tipo : "hex"
};

class Crypto {

  // Criptografa um dado.
  static crypt(snap) {
    const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
    cipher.update(snap);
    return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
  }

  // Descriptografa um dado.
  static descrypt(snap) {
    const decipher = crypto.createDecipher(DADOS_DESCRIPTOGRAFAR.algoritmo, DADOS_DESCRIPTOGRAFAR.segredo);
    decipher.update(snap, DADOS_DESCRIPTOGRAFAR.tipo);
    return decipher.final();
  }

}// Fim da classe.

export default Crypto;