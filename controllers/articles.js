const Article = require('../models/article');
const BadRequestError = require('../error/bad-request-err');
const NotFoundError = require('../error/not-found-err');

const getArticles = (req, res, next) => {
  Article.find({})
    .populate(['owner'])
    .then((data) => res.send(data))
    .catch(next);
};

const postArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  const { _id } = req.user;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: _id,
  })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new BadRequestError('Невалидный id');
        next(error);
      } if (err.name === 'ValidationError') {
        const error = new BadRequestError('Ошибка валидации');
        next(error);
      }
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { artId } = req.params;
  const userId = req.user._id;
  Article.findById(artId)
    .populate('owner')
    .orFail(() => {
      throw new NotFoundError('Статья не найдена');
    })
    .then((art) => {
      if (art.owner._id.toString() === userId) {
        Article.findByIdAndRemove(artId).then((newArt) => {
          res.send(newArt);
        });
      } else {
        throw new BadRequestError('Нельзя удалять чужую статью');
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new BadRequestError('Невалидный id');
        next(error);
      } if (err.name === 'ValidationError') {
        const error = new BadRequestError('Ошибка валидации');
        next(error);
      }
      next(err);
    });
};

module.exports = { getArticles, postArticle, deleteArticle };
