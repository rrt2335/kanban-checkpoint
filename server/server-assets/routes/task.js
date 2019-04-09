let router = require('express').Router()
let Tasks = require('../models/task')

//GET
router.get('/:id', (req, res, next) => {
  Tasks.find({ authorId: req.session.uid, listId: req.params.id })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
      next()
    })
})

//POST TASK BY BOARD ID
router.post('/', (req, res, next) => {
  req.body.authorId = req.session.uid
  Tasks.create(req.body)
    .then(newTask => {
      res.send(newTask)
    })
    .catch(err => {
      console.log(err)
      next()
    })
})

//To remove a comment, simply send the task to this route 
//with the array of comments it will need to keep

//PUT TASK BY BOARD ID TASK ID
router.put('/:id', (req, res, next) => {
  Tasks.findOneAndUpdate({_id: req.params.id, authorId: req.session.uid}, req.body, {new: true})
    .then(task => {
      // if (!task.authorId.equals(req.session.uid)) {
      //   return res.status(401).send("ACCESS DENIED!")
      // }
      // task.update(req.body, (err) => {
      //   if (err) {
      //     console.log(err)
      //     next()
      //     return
      //   }
      //   res.send("Successfully Updated")
      // });
      res.send(task)
    })
    .catch(err => {
      console.log(err)
      next()
    })
  })
  

//Adding Comments to Tasks
router.post('/:id/comments', (req, res, next) => {
  Tasks.findById(req.params.id)
    .then(task => {
      if (!task.authorId.equals(req.session.uid)) {
        return res.status(401).send("ACCESS DENIED!")
      }
      //from the body of the put request, pass a comment object only
      task.comments.push(req.body)
      task.save(function (err) {
        if (err) {
          //on fail
          console.log(err)
          next(err)
          return
        }
        //on success
        res.send(task)
      })
    })
    .catch(err => {
      console.log(err)
      next()
    })
})






//DELETE TASK BY BOARD ID AND TASK ID
router.delete('/:id', (req, res, next) => {
  Tasks.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
    .then(task => {
      // if (!task.authorId.equals(req.session.uid)) {
      //   return res.status(401).send("ACCESS DENIED!")
      // }
      // task.remove(err => {
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