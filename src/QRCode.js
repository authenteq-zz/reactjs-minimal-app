import React from 'react';
import PropTypes from 'prop-types';
import qrjs2 from 'qrjs2'; // eslint-disable-line

import './QRCode.css';

function createQRCodeSvg(payload) {
  // eslint-disable-next-line no-undef
  const qrSvg = QRCode.generateSVG(payload, {
    ecclevel: 'M',
    fillcolor: '#FFFFFF',
    textcolor: '#373737',
    margin: 1,
    modulesize: 8,
  });

  const XMLS = new XMLSerializer();
  const serialized = XMLS.serializeToString(qrSvg);

  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(serialized)))}`;
}

class QRCodeComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      value,
      width,
      height,
    } = this.props;

    if (!value) {
      return <div />;
    }

    const imgSrc = createQRCodeSvg(value);

    return (
      <div className="qrcode-wrapper">
        <img src={imgSrc} width={width} height={height} alt="security token" />
      </div>
    );
  }
}

QRCodeComponent.propTypes = {
  value: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

QRCodeComponent.defaultProps = {
  width: 150,
  height: 150,
};

export default QRCodeComponent;
