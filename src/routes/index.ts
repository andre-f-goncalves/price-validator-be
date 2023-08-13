import express from 'express'
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/teste', (req, res, next) => {
  res.status(200).send({teste: `${process.env.TESTE_ENV}`})
})

export default router;
