const express = require("express");
const app = express();
const councilPerson = require("./controllers/councilPerson");

app.use(express.json());

// Council Person routes
app.get("/api/councilperson", councilPerson.getAllCouncilPersons);
app.get("/api/councilperson/:id", councilPerson.getCouncilPersonById);
app.put("/api/councilperson/:id", councilPerson.updateCouncilPerson);
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

const port = 4000;
app.listen(port, () => console.log(`Server running on ${port}`));
