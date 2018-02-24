import express from 'express';
import DropBoxService from './../services/dropboxAcess';
import FirebaseAcess from '../services/firebaseAcess';
import Crypto from './../services/criptografia/criptografia';
import formidable from 'formidable';
import multer from 'multer';

let upload = multer();

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

// ************************************ Cadastra um usuário ************************************
// Cadastrar usuário no sistema.
router.post('/user/register', (req, res, next) => {
  FirebaseAcess.registerUser(req.body).then(snap => {
    res.status(200).json(snap);
  }).catch(err => {
    res.status(501).json(err);
  });
})

// ************************************ Se está cadastrado ************************************
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


// ************************************ Upload arquivo ************************************
// Upload de arquivo.
router.post("/files/upload", upload.single('arqs'), async (req, res, next) => {

  // console.log(req.file);
  const info = JSON.parse(req.body.info);
  FirebaseAcess.registerFile(info).then(snap => {
    if(snap.msg === 1) {
      dropBoxService.uploadArquivo(req.file.buffer, info.path_name).then(snap => {
        console.log(snap);
        res.status(200).json({msg: 1, data: snap});
      }).catch(err => {
        console.log(err);
        res.status(200).json({msg: 0, data: err});
      });
    }
  }).catch(err => {
    res.status(200).json(err);
  });
  
});

// ************************************ Retorna arquivos de um usuário ************************************
router.get('/user/files/:id_usuario', (req, res, next) => {
  const id_usuario = req.params.id_usuario;
  FirebaseAcess.getFilesUser(id_usuario).then(snap => {
    res.status(200).json(snap);
  }).catch(err => {
    res.status(200).json(err);
  });
});

// ***************************** Retorna todos os arquivos perto do usuário. *****************************
router.get('/files/near', (req, res, next) => {
  const coord = {lat: req.query.lat, lon: req.query.lon};
  FirebaseAcess.getFilesNear(coord).then(snap => {
    res.status(200).json(snap);
  }).catch(err => {
    res.status(200).json(err);
  });
});

// ***************************** Baixa um arquivo *****************************
router.get('/files/download', (req, res, next) => {
  const path_name = req.query.path_name;
  dropBoxService.downloadArquivo(path_name).then(snap => {
    res.status(200).json({msg: 1, data: snap});
  }).catch(err => {
    res.status(200).json({msg: 0, data: err});
  });
});

export default router;