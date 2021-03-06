var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import React from 'react';
import { View, Text, TextInput, TouchableHighlight, Button } from 'react-native';

import { I18n, JS } from 'aws-amplify';

export const Username = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(TextInput, _extends({
        style: theme.input,
        placeholder: I18n.get('Username'),
        autoFocus: true,
        autoCapitalize: 'none'
    }, props));
};

export const Password = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(TextInput, _extends({
        style: theme.input,
        placeholder: I18n.get('Password'),
        secureTextEntry: true
    }, props));
};

export const Email = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(TextInput, _extends({
        style: theme.input,
        placeholder: I18n.get('Email'),
        keyboardType: 'email-address',
        autoCapitalize: 'none'
    }, props));
};

export const PhoneNumber = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(TextInput, _extends({
        style: theme.input,
        placeholder: I18n.get('Phone Number'),
        keyboardType: 'phone-pad'
    }, props));
};

export const ConfirmationCode = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(TextInput, _extends({
        style: theme.input,
        placeholder: I18n.get('Code'),
        autoFocus: true
    }, props));
};

export const LinkCell = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(
        View,
        { style: theme.cell },
        React.createElement(
            TouchableHighlight,
            {
                onPress: props.onPress
            },
            React.createElement(
                Text,
                { style: theme.sectionFooterLink },
                props.children
            )
        )
    );
};

export const Header = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(
        View,
        { style: theme.sectionHeader },
        React.createElement(
            Text,
            { style: theme.sectionHeaderText },
            props.children
        )
    );
};

export const ErrorRow = props => {
    const theme = props.theme || AmplifyTheme;
    return React.createElement(
        View,
        { style: theme.errorRow },
        React.createElement(
            Text,
            { style: theme.erroRowText },
            props.children
        )
    );
};

export const ActionRow = props => {
    const theme = props.theme || AmplifyTheme;
    const style = propStyle(props, theme.actionRow);
    const p = JS.objectLessAttributes(props, 'theme');
    return React.createElement(
        View,
        _extends({}, p, { style: style }),
        props.children
    );
};

export const propStyle = (props, themeStyle) => {
    const { id, style } = props;
    const styl = Object.assign({}, style, themeStyle);
    if (!id) {
        return styl;
    }

    const selector = '#' + id;
    Object.assign(styl, styl[selector]);
    return styl;
};

export const beforeAfter = el => {
    const style = el.props.style || {};
    const { before, after } = style;
    if (!before && !after) {
        return el;
    }

    return React.createElement(
        'span',
        { style: { position: 'relative' } },
        before ? React.createElement(
            'span',
            { style: before },
            before.content
        ) : null,
        el,
        after ? React.createElement(
            'span',
            { style: after },
            after.content
        ) : null
    );
};

export const SignInButton = props => {
    const theme = props.theme || AmplifyTheme;
    const style = propStyle(props, theme.signInButton);
    const p = JS.objectLessAttributes(props, 'theme');

    return React.createElement(
        Button,
        _extends({}, p, { style: style }),
        props.children
    );
};