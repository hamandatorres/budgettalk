// const axios = require('axios')
let cp = [
  {
    id: 0,
    name: 'Tamara',
    age: 40
  }
];
let id = 1
module.exports = {
  getCp: (req, res) => {
    res.status(200).send(cp)
  },
  createCp: (req, res) => {
    const { name, age } = req.body;
    cp.push({ id: id, name: name, age: age 
    });
    id++,
    res.status(200).send(cp)
  },
  updateCp: (req, res) => {
    const {id} = req.params
    const { name, age } = req.body
    let cpIndex = null
    cp.forEach((element, index) => {
      if(element.id === +id){
        cpIndex = index
      }
    })
    const updatedCp = { id, name, age }
    cp.splice(cpIndex, 1, updatedCp)
    res.status(200).send(cp)
  },
  deleteCp: (req, res) => {
    let newCpIndex = null
    cp.forEach((element, i) => {
      if(element.id === +req.params.id){
        newCpIndex = i
      }
    })
    cp.splice(newCpIndex, 1)
    res.status(200).send(cp)
  }

}