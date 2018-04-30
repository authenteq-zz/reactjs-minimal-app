import React, { Component } from 'react';
import * as api from './api';
import logo from './logo.png';
import './App.css';
import QRCode from './QRCode';

function Icon(props) {
  if (props.value === undefined) {
    return <span />;
  }

  return (
    <span>
      { props.value ? '✔' : '✖'}
    </span>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      tokenId: null,
      userTokenId: null,
      step: 'loading',
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
    this.setState({
      userTokenId,
      step: 'form'
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
      step,
      tokenId,
    } = this.state;
    console.log(claimResults);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Authenteq sample app</h1>
        </header>
        { step === 'loading' && (
          <h3>Loading security token..</h3>
        )}
        { step === 'qr-code' && (
          <div>
            <h3>Scan using Authenteq app</h3>
            <QRCode value={tokenId} />
          </div>
        )}
        { step === 'form' && (
          <form
            action="#"
            className="pure-form pure-form-aligned"
            onSubmit={this.handleFormSubmit}
          >
            <h3>Fill out the form to verify your information</h3>
            <fieldset>
                <div className="pure-control-group">
                    <label htmlFor="givenname">First name</label>
                    <input id="givenname" type="text" placeholder="First name" />
                    <Icon value={claimResults.givenname} />
                </div>
                <div className="pure-control-group">
                    <label htmlFor="lastname">Last name</label>
                    <input id="lastname" placeholder="Last name" />
                    <Icon value={claimResults.lastname} />
                </div>
                <div className="pure-control-group">
                    <label htmlFor="dob">Date of birth</label>
                    <input id="dob" placeholder="yyyy-mm-dd" />
                    <Icon value={claimResults.dob} />
                </div>
                <div className="pure-control-group">
                    <label htmlFor="nationality">Nationality</label>
                    <input id="nationality" placeholder="Nationality" />
                    <Icon value={claimResults.nationality} />
                </div>
                <div className="pure-control-group">
                    <label htmlFor="idnumber">Passport no.</label>
                    <input id="idnumber" placeholder="Passport no." />
                    <Icon value={claimResults.idnumber} />
                </div>
                <div className="pure-controls">
                    <button type="submit" className="pure-button pure-button-primary">Verify information</button>
                </div>
            </fieldset>
        </form>
        )}
      </div>
    );
  }
}

export default App;
