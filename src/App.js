import React, { Component } from 'react';
import * as api from './api';
import logo from './logo.png';
import './App.css';
import Form from './Form';
import QRCode from './QRCode';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tokenId: null,
      userTokenId: null,
      step: 'loading',
      step: 'form',
      formData: {
        givenname: '',
        lastname: '',
        dob: '',
        nationality: '',
        idnumber: '',
      },
      claimResults: {},
    };
  }

  componentDidMount() {
    api.connect(this.handleApiConnect, this.handleUserAuthenticate)
  }

  handleApiConnect = (data) => {
    console.log('tokenId', data.id);
    this.setState({
      tokenId: data.id,
      step: 'qr-code',
    });
  }

  handleUserAuthenticate = (userTokenId) => {
    console.log('userTokenId', userTokenId);
  handleFormChange = (key, value) => {
    const formData = Object.assign({}, this.state.formData, { [key]: value });
    this.setState({
      formData,
    });
  }

  handleFormSubmit = () => {
    const { userTokenId } = this.state;
    const givenname = document.getElementById('givenname').value;
    const lastname = document.getElementById('lastname').value;
    const dob = document.getElementById('dob').value;
    const nationality = document.getElementById('nationality').value;
    const idnumber = document.getElementById('idnumber').value;

    Promise.all([
      api.verifyClaim(userTokenId, 'givenname', givenname),
      api.verifyClaim(userTokenId, 'lastname', lastname),
      api.verifyClaim(userTokenId, 'dob', dob),
      api.verifyClaim(userTokenId, 'nationality', nationality),
      api.verifyClaim(userTokenId, 'idnumber', idnumber),
    ])
      .then(([givenname, lastname, dob, nationality, idnumber]) => {
        console.log('givenname', givenname);
        console.log('lastname', lastname);
        console.log('dob', dob);
        console.log('nationality', nationality);
        console.log('passport no.', idnumber);

        this.setState({
          claimResults: {
            givenname,
            lastname,
            dob,
            nationality,
            idnumber,
          },
        });
      });

    return false;
  }

  render() {
    const {
      claimResults,
      formData,
      step,
      tokenId,
      errorMessage,
    } = this.state;
    console.log(claimResults);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Authenteq sample app</h1>
        </header>
        { step === 'qr-code' && (
          <div>
            <h3>Scan using Authenteq app</h3>
            <QRCode value={tokenId} />
          </div>
        )}
        { step === 'form' && (
          <div>
            <Form
              claimResults={claimResults}
              formData={formData}
              onChange={this.handleFormChange}
              onSubmit={this.handleFormSubmit}
            />
            { errorMessage && (
              <span className="Form-error">{errorMessage}</span>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
