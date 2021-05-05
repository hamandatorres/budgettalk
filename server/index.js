const express = require('express')
const app = express()
const cp = require('./controllers/controllers.js')


// const councilPerson = require('./controllers/councilPerson')
// const controllers = require('./controllers/controllers.js')
app.use(express.json())


app.get('/api/councilperson', cp.getCp)
app.post('/api/councilperson', cp.createCp)
app.put('/api/councilperson/:id', cp.updateCp )
app.delete('/api/councilperson/:id', cp.deleteCp)
// app.get('https://randomuser.me/api/', (req, res) => {
//   // axios.get('https://randomuser.me/api/')
//   .then(response => {
//     cp.push(response.data);
//     res.status(200).send(cp);
//   })
//   .catch(error => {
//   res.status(500).send(error))}
// })


// // app.post('https://randomuser.me/api/?inc=name,dob', )
// // app.put('https://randomuser.me/api/?inc=name,dob', )
// // app.delete('https://randomuser.me/api/?inc=name,dob', )


const port = 4000
app.listen(port, () => console.log(`Server running on ${port}`));
