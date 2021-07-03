import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      mobile: '',
      password: ''
    };
  }

  mySubmitHandler = (event) => {
    event.preventDefault();
    let mobile = this.state.mobile;
    if (!Number(mobile)) {
      alert("Your mobile must be a number");
    }
    alert("Submitted");
    window.location.reload();
  }
  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.mySubmitHandler}>
          <p>Enter Name:</p>
          <input
            type='text'
            name='name'
            onChange={this.myChangeHandler}
          />
          <p>Enter E-Mail:</p>
          <input
            type='text'
            name='email'
            onChange={this.myChangeHandler}
          />
          <p>Enter Mobile:</p>
          <input
            type='text'
            name='mobile'
            onChange={this.myChangeHandler}
          />
          <p>Enter Password:</p>
          <input
            type='password'
            name='password'
            onChange={this.myChangeHandler}
          />
          <br />
          <br />
          <input type='submit' />
          <div>
            <h1>Inserted Values</h1>
            <br /> Name: {this.state.name}
            <br /> Email: {this.state.email}
            <br /> Mobile: {this.state.mobile}
            <br /> Password: {this.state.password}
          </div>
        </form>
      </div>
    );
  }
}

export default App;
