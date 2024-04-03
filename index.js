require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
const { default: mongoose } = require('mongoose')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const errorHandler= (error, request, response, next)=>{
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  next(error)
}




app.get('/', (request, response)=>{
    response.send('<h1>Hello world!</h1>')
})

app.get('/info', async (request, response)=>{
  try {
     const NumPersons= await Person.countDocuments({})
    const title = `Phonebook has info for ${NumPersons} people`
    const date = new Date(Date.now())
    response.send(`<p>${title} <br/><br/> ${date} </p>`)
  } catch(error){
    console.error('Error counting number of persons:', err)
    response.status(500).send('Internal server error')
  }
    
})
app.get('/api/persons',(request, response)=>{
     Person.find({}).then(people=>{
       response.json(people)
       
     })
   
})

app.get('/api/persons/:id', (request, response)=>{
  
    Person.findById(request.params.id).then(person =>{
      response.json(person)
    })
})


app.put('/api/persons/:id',errorHandler, (request, response)=>{
   const body = request.body

  const updateData = {};
  if(body.name) {
    updateData.name = body.name
  }
   if(body.number){
    updateData.number = body.number
   }


   Person.findByIdAndUpdate(request.params.id, updateData, {new:true})
     .then(updatedPerson=>{
      response.json(updatedPerson)
     })
     .catch(error=>{

       response.status(500).json({error:error})
     })
     
})



app.post('/api/persons', (request, response)=>{
    const body = request.body
    if(!body){
        return response.status(400).json({
            error: 'content missing'
        })
    }
        const person = new Person({
            name : body.name,
            number: body.number
        
        })
       person.save().then(savedPerson=>{
        
         response.json(savedPerson)
       }).catch(error=>{
        console.error('Error saving person to database', error)
        response.status(500).json({
          error: "Internal server error"
        })
      })
    
   
})





app.delete('/api/persons/:id', errorHandler, (request, response ,next)=>{
    Person.findByIdAndDelete(request.params.id)
      .then(result =>{
        response.status(204).end()
      })
      .catch(error=> next(error))
})





const PORT = process.env.PORT



app.listen(PORT)
console.log(`app listening to ${PORT}`)