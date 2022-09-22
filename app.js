require("dotenv").config()
const express = require("express")
const { Sequelize } = require("sequelize")
const Queue = require("bull")
const REDIS_URL = process.env.REDIS_URL
let workQueue= new Queue("queueEcheanceTodos",REDIS_URL)
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

app.get("/", function (req, res) {
  res.send(`Hello World! Environnement de ${process.env.ENV}`)
});


app.post('/todos', async function(req, res, next){
  console.log(req.body);
  const todos= await sequelize.query(
      `INSERT INTO todos (description,date_echeance) VALUES (?,?) RETURNING id`,
      {
        replacements:[req.body.description, req.body.date]
      })
    await workQueue.add(
        {idTodo: todos[0][0].id, date_echeance: req.body.date},
    {delay: new Date(req.body.date).getTime()-Date.now()}
    )
    res.send("ok")
});

app.get("/todos", async function (req, res){
  const todos= (await sequelize.query(`SELECT * FROM todos`))[0]
  res.send(todos )
});

const port = process.env.PORT
app.listen(port, function () {
  console.log(`ToDo API listening on port ${port}`)
})
