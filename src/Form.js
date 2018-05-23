import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

function Form(props) {
  const {
    claimResults,
    formData,
    onChange,
    onSubmit,
  } = props;

  return (
    <form
      action="#"
      className="pure-form pure-form-aligned"
      onSubmit={onSubmit}
    >
      <h3>Fill out the form to verify your information</h3>
      <fieldset>
          <div className="pure-control-group">
              <label htmlFor="givenname">First name</label>
              <input
                id="givenname"
                type="text"
                placeholder="First name"
                value={formData.givenname}
                onChange={(e) => onChange('givenname', e.target.value)}
              />
              <Icon value={claimResults.givenname} />
          </div>
          <div className="pure-control-group">
              <label htmlFor="lastname">Last name</label>
              <input
                id="lastname"
                placeholder="Last name"
                value={formData.lastname}
                onChange={(e) => onChange('lastname', e.target.value)}
              />
              <Icon value={claimResults.lastname} />
          </div>
          <div className="pure-control-group">
              <label htmlFor="dob">Date of birth</label>
              <input
                id="dob"
                placeholder="yyyy-mm-dd"
                value={formData.dob}
                onChange={(e) => onChange('dob', e.target.value)}
              />
              <Icon value={claimResults.dob} />
          </div>
          <div className="pure-control-group">
              <label htmlFor="nationality">Nationality</label>
              <input
                id="nationality"
                placeholder="Nationality"
                value={formData.nationality}
                onChange={(e) => onChange('nationality', e.target.value)}
              />
              <Icon value={claimResults.nationality} />
          </div>
          <div className="pure-control-group">
              <label htmlFor="passportno">Passport no.</label>
              <input
                id="passportno"
                placeholder="Passport no."
                value={formData.passportno}
                onChange={(e) => onChange('passportno', e.target.value)}
              />
              <Icon value={claimResults.passportno} />
          </div>
          <div className="pure-control-group">
            <input
              disabled
              checked
              id="aml-check"
              type="checkbox"
              onChange={(e) => onChange('amlCheck', e.target.checked)}
            />
            Anti-money laundering (AML) check
          </div>
          <div className="pure-control-group">
            <input
              disabled
              checked
              id="kyc-check"
              type="checkbox"
              onChange={(e) => onChange('kycCheck', e.target.checked)}
            />
            Know your customer (KYC) check
          </div>
          {/* <label htmlFor="aml-check" className="pure-checkbox">
            <input
              id="aml-check"
              type="checkbox"
              onChange={(e) => onChange('amlCheck', e.target.checked)}
            /> Perform Anti-money laundering (AML) check
          </label> */}
          <div className="pure-controls">
              <button type="submit" className="pure-button pure-button-primary">Verify information</button>
          </div>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default Form;
