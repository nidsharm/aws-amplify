var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React, { Component } from 'react';

import withFacebook from './withFacebook';
import withGoogle from './withGoogle';

export { default as withFacebook, FacebookButton } from './withFacebook';
export { default as withGoogle, GoogleButton } from './withGoogle';

export function withFederated(Comp) {
    const Federated = withGoogle(withFacebook(Comp));

    return class extends Component {
        render() {
            const federated = this.props.federated || {};
            return React.createElement(Federated, _extends({}, this.props, federated));
        }
    };
}