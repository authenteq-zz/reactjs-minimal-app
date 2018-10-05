import React, { Component } from 'react';
import * as api from './api';
import logo from './logo.png';
import './App.css';
import Form from './Form';

class App extends Component {
  constructor() {
    super();
    this.state = {
      aqrSvg: null,
      sessionId: null,
      tokenId: null,
      step: 'form',
      imgData: null,
      amlData: null,
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
    const scope = 'givenname,surname,dob,nationality,passportno,aml,kyc';
    api.connect(this.handleApiConnect, this.handleUserAuthenticate, scope);
  }

  handleApiConnect = (data) => {
    console.log('handleApiConnect::data', data);
    const aqrSvg = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(data.svg)))}`
    this.setState({
      sessionId: data.id,
      aqrSvg: aqrSvg,
    });
  }

  handleUserAuthenticate = (tokenId) => {
    console.log('handleUserAuthenticate::tokenId', tokenId);

    this.setState({
      tokenId,
    });

    // Verify data after we recived signal that user have scanned AQR code
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

    // Switch to AQR code screen if user have not scanned AQR code yet
    if (!tokenId) {
      this.setState({
        step: 'aqr-code',
      });
      return false;
    }

    // This call allows us to verify data again after user scanned AQR code
    // and filled form is shown. It gets the user opportunity to correct
    // information
    this.handleVerifyData(tokenId, formData);
    return false;
  }

  handleVerifyData = (tokenId, data) => {
    // Reset the claim results and error message
    this.setState({
      imgData: null,
      amlData: null,
      claimResults: {},
      errorMessage: null,
    });

    if ( data.givenname )

    Promise.all([
      api.verifyClaim(tokenId, 'givenname', data.givenname),
      api.verifyClaim(tokenId, 'lastname', data.lastname),
      api.verifyClaim(tokenId, 'dob', data.dob),
      api.verifyClaim(tokenId, 'nationality', data.nationality),
      api.verifyClaim(tokenId, 'passportno', data.passportno),
      api.getAmlCheck(tokenId),
      api.getIdDocument(tokenId),
    ])
      .then(([givenname, lastname, dob, nationality, passportno, amlResult, base64Image]) => {
        this.setState({
          step: 'form',
          imgData: base64Image,
          amlData: amlResult,
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
      aqrSvg,
      amlData,
      imgData,
      step,
      errorMessage,
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Authenteq sample app</h1>
        </header>
        { step === 'aqr-code' && (
          <div>
            <h3>Scan using Authenteq app</h3>
            <img src={aqrSvg} width="330" height="330" alt="AQR code" />
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
            { amlData && (
              <div>
                <h3>Anti-money laundering (AML) check</h3>
                <pre>{amlData}</pre>
              </div>
            )}
            { imgData && (
              <div>
                <h3>Photo of passport</h3>
                <img src={imgData} width="600" height="auto" id="photo" alt="passport"/>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
