var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React, { Component } from 'react';
import Expo from 'expo';
import { Auth, Logger } from 'aws-amplify';
import AmplifyTheme from '../../AmplifyTheme';
import { SignInButton } from '../../AmplifyUI';

const logger = new Logger('withFacebook');

export default function withFacebook(Comp) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.signIn = this.signIn.bind(this);
            this.federatedSignIn = this.federatedSignIn.bind(this);

            this.state = {};
        }

        async signIn() {
            const { facebook_app_id } = this.props;
            const {
                type,
                token,
                expires
            } = await Expo.Facebook.logInWithReadPermissionsAsync(facebook_app_id, {
                permissions: ["public_profile", "email"]
            });

            if (type === "success") {
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                const federatedResponse = { response, token, expires };
                this.federatedSignIn(federatedResponse);
            } else {
                return;
            }
        }

        federatedSignIn(response) {
            logger.debug(response);
            const { onStateChange } = this.props;
            const accessToken = response.token;
            const expiresIn = response.expires;

            if (!accessToken) {
                return;
            }
            const user = {
                name: response.name
            };
            Auth.federatedSignIn('facebook', { token: accessToken, expiresIn }, user).then(credentials => {
                if (onStateChange) {
                    onStateChange('signedIn');
                }
            });
        }

        render() {
            return React.createElement(Comp, _extends({}, this.props, { facebookSignIn: this.signIn }));
        }
    };
}

const Button = props => React.createElement(SignInButton, {
    id: 'facebook_signin_btn',
    onPress: props.facebookSignIn,
    theme: props.theme || AmplifyTheme,
    title: 'Sign In with Facebook'
});

export const FacebookButton = withFacebook(Button);