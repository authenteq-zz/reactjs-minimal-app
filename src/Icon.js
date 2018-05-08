import React from 'react';
import PropTypes from 'prop-types';

function Icon(props) {
  if (props.value === undefined) {
    return <span />;
  }

  return (
    <span className="Claim-icon">
      { props.value ? '✔' : '✖'}
    </span>
  );
}

Icon.propTypes = {
  value: PropTypes.bool,
};

export default Icon;
