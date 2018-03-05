import React, { Component } from 'react';
import * as FBSDK from 'react-native-fbsdk';
import { Auth, Logger } from 'aws-amplify';
import AmplifyTheme from '../../AmplifyTheme';
import { SignInButton } from '../../AmplifyUI';

const logger = new Logger('withFacebook');
const {
    LoginManager,
  } = FBSDK;

export default function withFacebook(Comp) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.signIn = this.signIn.bind(this);
            this.federatedSignIn = this.federatedSignIn.bind(this);

            this.state = {};
        }

        async signIn() {
            LoginManager.logInWithReadPermissions(['public_profile']).then(
                function(result) {
                  if (result.isCancelled) {
                    alert('Login was cancelled');
                  } else {
                    logger.debug('Facebook success with result ' + result);
                    alert('Login was successful with permissions: '
                      + result);
                  }
                },
                function(error) {
                  alert('Login failed with error: ' + error);
                }
              );

            
            // const {
            //     type,
            //     token,
            //     expires
            //   } = await Expo.Facebook.logInWithReadPermissionsAsync(facebook_app_id, {
            //     permissions: ["public_profile", "email"]
            //   });
              
            //   if (type === "success") {
            //     const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            //     const federatedResponse = {response, token, expires};
            //     this.federatedSignIn(federatedResponse);
            //   } else {
            //       return;
            //   }
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
            }
            Auth.federatedSignIn('facebook', { token: accessToken, expiresIn }, user)
                    .then(credentials => {
                        if (onStateChange) {
                            onStateChange('signedIn');
                        }
                    });
        }

        render() {
            return (
                <Comp {...this.props} facebookSignIn={this.signIn} />
            )
        }
    }
}

const Button = (props) => (
        <SignInButton
            id="facebook_signin_btn"
            onPress={props.facebookSignIn}
            theme={props.theme || AmplifyTheme}
            title="Sign In with Facebook"
        />);
    

export const FacebookButton = withFacebook(Button);
