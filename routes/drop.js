import express from 'express';
import DropBoxService from './../services/dropboxAcess';
import FirebaseAcess from '../services/firebaseAcess';
import Crypto from './../services/criptografia/criptografia';

const router = express.Router();
const dropBoxService = new DropBoxService();

// middleware that is specific to this router
/*router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});*/

router.get('/', (req, res, next) => {
  res.status(200).json({
    msg: "home routes"
  })
});

// Cadastrar usuário no sistema.
router.post('/user/register', (req, res, next) => {
  FirebaseAcess.registerUser(req.body).then(snap => {
    res.status(200).json(snap);
  }).catch(err => {
    res.status(501).json(err);
  });
})

// Verifica se um usuário está cadastrado.
router.post("/user/logged", (req, res, next) => {
  FirebaseAcess.isRegister(req.body.name).then(snap => {
    if(snap.msg !== 0) {
      if(req.body.pass === Crypto.descrypt(snap.data.pass).toString())
        res.status(200).json(snap);
      else
        res.status(200).json({msg: 0, data: "Senha inválida"});
    }
    else {
      res.status(200).json({msg: -1, data: snap.data});
    }
  }).catch(err => {
    console.log(err, "ERRO");
    res.status(501).json({msg: 501, data: err.data});
  });
});

router.get('/tudo', (req, res, next) => {

  dropBoxService.getAll().then(snap => {
    res.status(200).json({
      msg: snap
    })
  }).catch(err => {
    res.status(404).json({
      msg: err
    });
  });
});

export default router;