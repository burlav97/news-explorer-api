const Article = require('../models/article');
const BadRequestError = require('../error/bad-request-err');
const NotFoundError = require('../error/not-found-err');
const ForbiddenError = require('../error/forbidden');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
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
  Article.findById(req.params._id).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError({ message: 'Статья не найдена'});
      }
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'Недостаточно прав'});
      }
      article.remove();
      res.send({ message: 'Удалена' });
    })
    .catch(next);
};

module.exports = { getArticles, postArticle, deleteArticle };
