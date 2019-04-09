let router = require('express').Router()
let Lists = require('../models/list')

//GET
router.get('/:id', (req, res, next) => {
  Lists.find({ authorId: req.session.uid , boardId: req.params.id})
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})

//GET LISTS BY BOARD ID
router.get('/:boardId', (req, res, next) => {
  Lists.find({ boardId: req.params.boardId })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})

//POST LIST BY BOARD ID

//Might re add the board id to the route

router.post('/', (req, res, next) => {
  req.body.authorId = req.session.uid
  Lists.create(req.body)
    .then(newList => {
      res.send(newList)
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})


//PUT LIST BY BOARD ID LIST ID
router.put('/:id', (req, res, next) => {
  Lists.findById(req.params.id)
    .then(list => {
      if (!list.authorId.equals(req.session.uid)) {
        return res.status(401).send("ACCESS DENIED!")
      }
      list.update(req.body, (err) => {
        if (err) {
          console.log(err)
          next()
          return
        }
        res.send("Successfully Updated")
      });
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})


//DELETE LIST BY BOARD ID AND LIST ID
router.delete('/:id', (req, res, next) => {
  Lists.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
    .then(list => {
      // if (!list.authorId.equals(req.session.uid)) {
      //   return res.status(401).send("ACCESS DENIED!")
      // }
      // list.remove(err => {
      //   if (err) {
      //     console.log(err)
      //     next()
      //     return
      //   }
      res.send("Successfully Deleted")
    })
    .catch(err => {
      res.status(400).send('ACCESS DENIED; Invalid Request')
    })
})




module.exports = router