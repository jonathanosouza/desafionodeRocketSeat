const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers
  const existUser = users.find(user => user.username === username)

  if(!existUser){
    response.status(400).json({error : "User not Exist"})
  }
  request.existUser = existUser
  return next()
}

app.post('/users', (request, response) => {
  const {name, username} = request.body
  users.push({
    id : uuidv4(),
    name,
    username,
    todo: []
  })
  return response.status(201).json(users)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {existUser} = request
  return response.status(200).json(existUser.todo)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {existUser} = request
  const {title, deadline} = request.body

  existUser.todo.push({
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  })
  return response.status(201).json(users)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {existUser} = request
  const {title, deadline} = request.body
  const {id} = request.params

  const todoExist = existUser.todo.find(todo => todo.id === id)
  todoExist.title = title
  todoExist.deadline = deadline



});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {existUser} = request
  
  users.splice(existUser, 1)
  response.status(204).json({message : " Deletado com suceso"})

});

module.exports = app;