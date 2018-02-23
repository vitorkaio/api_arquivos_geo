import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    user_say: "user routes!"
  })
});

router.post('/', (req, res, next) => {
  const user = {
    nome: req.body.nome,
    pass: req.body.pass
  }
  res.status(200).json({
    user: user
  })
});

router.get('/:id', (req, res, next) => {
  res.status(200).json({
    id_user: req.params.id
  })
});

export default router;