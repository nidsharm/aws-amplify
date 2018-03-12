import React, { Component } from 'react';

import { Logger, JS } from 'aws-amplify';
import AmplifyTheme from '../AmplifyTheme';
import {
    FormSection,
    SectionBody,
    ActionRow
} from '../AmplifyUI';
import {
    FacebookButton,
    GoogleButton
} from './Provider';

const logger = new Logger('FederatedSignIn');

export class FederatedButtons extends Component {
    
    facebook(facebook) {
        
        const { theme, onStateChange } = this.props;
        
        return <FacebookButton
                theme={theme}
                onStateChange={onStateChange}
                />
    }

    google(google_ios_client_id, google_web_client_id) {
        if ( !google_ios_client_id && !google_web_client_id) {
             return null; 
        }
        const { theme, onStateChange } = this.props;
        
        return <GoogleButton
                google_ios_client_id={google_ios_client_id}
                google_web_client_id={google_web_client_id}
                theme={theme}
                onStateChange={onStateChange}
              />
    }


    render() {
        const { authState } = this.props;
        if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) { return null; }

        const federated = this.props.federated || {};
        if (JS.isEmpty(federated)) { return null; }

        const { facebook, google_ios_client_id,google_web_client_id } = federated;

        const theme = this.props.theme || AmplifyTheme;
        return (
            <ActionRow theme={theme}>
                {this.google(google_ios_client_id, google_web_client_id)}
                {this.facebook(facebook)}
            </ActionRow>
        )
    }
}

export default class FederatedSignIn extends Component {
    render() {
        const { federated, authState, onStateChange } = this.props;
        if (!federated) {
            logger.debug('federated prop is empty. show nothing');
            return null;
        }
        if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) { return null; }
        const theme = this.props.theme || AmplifyTheme;
        
        return (
            <FormSection theme={theme}>
                <SectionBody theme={theme}>
                    <FederatedButtons
                        federated={federated}
                        theme={theme}
                        authState={authState}
                        onStateChange={onStateChange}
                    />
                </SectionBody>
            </FormSection>
        )
    }
}
