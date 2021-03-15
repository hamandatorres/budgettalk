import React, { Component } from 'react';
import axios from 'axios'

class Arena extends Component {
  constructor() {
    super();
    this.state = {
      arenaCp: []
    }
  } 
  // this.setState = ({ this.arenaCp: this.props.moveCP})
  componentDidMount() {
        this.getCp();
        console.log(this.state.cp)
      }
      getCp = () => {
        axios.get('/api/councilperson')
      .then(response => {
          this.setState({ arenaCp: response.data })
      })
      .catch(error => console.log(error))
    }
      moveCp(cp){
          axios.post(`http://localhost:3001/api/councilperson`, {cp: cp})
        .then(response => {
          this.setState({ arenaCp: response.data})
        })
        .catch(error => console.log(error))
      }
  render() {
    return
  }
}

export default Arena;