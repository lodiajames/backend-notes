const mongoose = require('mongoose')


if (process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://lodiajames:${password}@cluster0.wfz8kei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
   name: String,
   number:Number
})

const Person = mongoose.model("Person", personSchema)

if(!name || !number){
    Person.find({}).then(result=>{
        result.forEach(person=>{
         console.log(person)
        })
       mongoose.connection.close()
    })
}else {

    const person= new Person({
          name: name,
          number:number
    })
    person.save().then(result=>{
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    }).catch(error =>{
        console.log('Error while adding person to the database:', error)
    })

}



