var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React, { Component } from 'react';
import Expo from 'expo';
import { Auth, Logger } from 'aws-amplify';
import AmplifyTheme from '../../AmplifyTheme';
import { SignInButton } from '../../AmplifyUI';

const logger = new Logger('withGoogle');

export default function withGoogle(Comp) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.signIn = this.signIn.bind(this);
            this.federatedSignIn = this.federatedSignIn.bind(this);

            this.state = {};
        }

        async signIn() {
            const { google_android_client_id, google_ios_client_id } = this.props;
            try {
                const result = await Expo.Google.logInAsync({
                    androidClientId: google_android_client_id,
                    iosClientId: google_ios_client_id,
                    scopes: ['profile', 'email']
                });

                if (result.type === 'success') {
                    this.federatedSignIn(result);
                } else {
                    return { cancelled: true };
                }
            } catch (e) {
                return e;
            }
        }

        federatedSignIn(googleUser) {
            const accessToken = googleUser.accessToken;
            const date = new Date();
            const expires_at = date.getTime() + 3600;
            const profile = googleUser.user;
            const user = {
                email: profile.email,
                name: profile.name
            };
            const { onStateChange } = this.props;

            return Auth.federatedSignIn('google', { token: accessToken, expires_at }, user).then(credentials => {
                if (onStateChange) {
                    onStateChange('signedIn');
                }
            });
        }

        render() {
            return React.createElement(Comp, _extends({}, this.props, { googleSignIn: this.signIn }));
        }
    };
}

const Button = props => React.createElement(SignInButton, {
    id: 'google_signin_btn',
    onPress: props.googleSignIn,
    theme: props.theme || AmplifyTheme,
    title: 'Sign In with Google'
});

export const GoogleButton = withGoogle(Button);