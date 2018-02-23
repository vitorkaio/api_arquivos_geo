import express from 'express';
import DropBoxService from './../services/dropboxAcess';

const router = express.Router();
const dropBoxService = new DropBoxService();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', (req, res, next) => {
  res.status(200).json({
    msg: "home routes"
  })
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