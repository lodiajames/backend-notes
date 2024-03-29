const express = require('express')
const app = express()

const persons= [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/', (request, response)=>{
    response.send('<h1>Hello world!</h1>')
})

app.get('/info', (request, response)=>{
    const NumPersons=persons.length
    const title = `Phonebook has info for ${NumPersons} people`
    const date = new Date(Date.now())
  
  response.send(`<p>${title} <br/><br/> ${date} </p>`)
})
app.get('/api/persons',(request, response)=>{
    console.log(persons)
    response.json(persons)
   
})

app.get('/api/persons/:id', (request, response)=>{
    id = Number(request.params.id)
    const person =  persons.find(person=> person.id === id)
    if(person){
        response.json(person)

    }else{
      response.status(404).end()
    }
})

const PORT = 3001



app.listen(PORT)
console.log(`app listening to ${PORT}`)