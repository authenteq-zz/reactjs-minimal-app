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
      sessionId: null,
      tokenId: null,
      step: 'form',
      formData: {
        givenname: '',
        lastname: '',
        dob: '',
        nationality: '',
        passportno: '',
      },
      claimResults: {},
    };
  }

  componentDidMount() {
    api.connect(this.handleApiConnect, this.handleUserAuthenticate)
  }

  handleApiConnect = (sessionId) => {
    console.log('handleApiConnect::sessionId', sessionId);
    this.setState({
      sessionId,
    });
  }

  handleUserAuthenticate = (tokenId) => {
    console.log('handleUserAuthenticate::tokenId', tokenId);

    this.setState({
      tokenId,
    });

    // Verify data after we recived signal that user have scanned QR code
    this.handleVerifyData(tokenId, this.state.formData);
  }

  handleFormChange = (key, value) => {
    const formData = Object.assign({}, this.state.formData, { [key]: value });
    this.setState({
      formData,
    });
  }

  handleFormSubmit = () => {
    const {
      tokenId,
      formData,
    } = this.state;

    // Switch to QR code screen if user have not scanned QR code yet
    if (!tokenId) {
      this.setState({
        step: 'qr-code',
      });
      return false;
    }

    // This call allows us to verify data again after user scanned QR code
    // and filled form is shown. It gets the user opportunity to correct
    // information
    this.handleVerifyData(tokenId, formData);
    return false;
  }

  handleVerifyData = (tokenId, data) => {
    // Reset the claim results and error message
    this.setState({
      claimResults: {},
      errorMessage: null,
    });

    Promise.all([
      api.verifyClaim(tokenId, 'givenname', data.givenname),
      api.verifyClaim(tokenId, 'lastname', data.lastname),
      api.verifyClaim(tokenId, 'dob', data.dob),
      api.verifyClaim(tokenId, 'nationality', data.nationality),
      api.verifyClaim(tokenId, 'passportno', data.passportno),
    ])
      .then(([givenname, lastname, dob, nationality, passportno]) => {
        console.log('Givenname is valid:', givenname);
        console.log('Lastname is valid:', lastname);
        console.log('Date of birth is valid:', dob);
        console.log('Nationality is valid:', nationality);
        console.log('Passport no. is valid:', passportno);

        this.setState({
          step: 'form',
          claimResults: {
            givenname,
            lastname,
            dob,
            nationality,
            passportno,
          },
        });
      })
      .catch((err) => {
        this.setState({
          step: 'form',
          errorMessage: err,
        });
      })
      ;
  }

  render() {
    const {
      claimResults,
      formData,
      step,
      sessionId,
      errorMessage,
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Authenteq sample app</h1>
        </header>
        { step === 'qr-code' && (
          <div>
            <h3>Scan using Authenteq app</h3>
            <QRCode value={sessionId} />
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
