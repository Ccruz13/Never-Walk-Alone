// const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

module.exports = (app) => {

  app.get('/api/posts', (req, res) => {
    console.log('======================');
    Post.findAll({
      // Query configuration
      attributes: ['id',
        'title',
        'post_content',
        'created_at'
      ],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
      .then(dbPostData => res.json(dbPostData.reverse()))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });

  });

  app.get('/api/posts/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id',
        'post_content',
        'title',
        'created_at'
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  app.post('/api/posts', withAuth, (req, res) => {
    Post.create({
      title: req.body.title,
      post_content: req.body.post_content,
      user_id: req.session.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  app.put('/api/posts/:id', withAuth, (req, res) => {
    Post.update({
      title: req.body.title
    },
      {
        where: {
          id: req.params.id
        }
      }).then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  app.delete('/api/posts/:id', withAuth, (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    }).catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });
};