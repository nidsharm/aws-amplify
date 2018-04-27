import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  DeviceEventEmitter,
  NativeModules,
  requireNativeComponent,
  ViewPropTypes,
} from 'react-native';

const { RNAmplifyGoogleSignIn } = NativeModules;

class GoogleSigninError extends Error {
  constructor(error, code) {
    super(error);
    this.name = 'GoogleSigninError';
    this.code  = code;
  }
} 

class GoogleSignin {

    constructor() {
      this._user = null;
    }
  
    hasPlayServices(params = { autoResolve: true }) {
      return RNAmplifyGoogleSignIn.playServicesAvailable(params.autoResolve);
    }
  
    configure(params = {}) {
      params = [
        params.scopes || [],
        params.webClientId || null,
        params.offlineAccess || false,
        params.forceConsentPrompt || false,
        params.accountName || null,
        params.hostedDomain || null,
      ];
  
      return RNAmplifyGoogleSignIn.configure(...params);
    }
  
    currentUserAsync() {
      return new Promise((resolve, reject) => {
        const sucessCb = DeviceEventEmitter.addListener('RNGoogleSignInSilentSuccess', (user) => {
          this._user = {...user};
  
          RNAmplifyGoogleSignIn.getAccessToken(user).then((token) => {
            this._user.accessToken = token;
            this._removeListeners(sucessCb, errorCb);
            resolve(this._user);
          })
          .catch(err => {
            this._removeListeners(sucessCb, errorCb);
            resolve(this._user);
          });
        });
  
        const errorCb = DeviceEventEmitter.addListener('RNGoogleSignInSilentError', (err) => {
          this._removeListeners(sucessCb, errorCb);
          resolve(null);
        });
  
        RNAmplifyGoogleSignIn.currentUserAsync();
      });
    }
  
    currentUser() {
      return {...this._user};
    }
  
    signIn() {
      return new Promise((resolve, reject) => {
        const sucessCb = DeviceEventEmitter.addListener('RNGoogleSignInSuccess', (user) => {
          this._user = {...user};
          RNAmplifyGoogleSignIn.getAccessToken(user).then((token) => {
            this._user.accessToken = token;
            this._removeListeners(sucessCb, errorCb);
            resolve(this._user);
          })
          .catch(err => {
            this._removeListeners(sucessCb, errorCb);
            resolve(this._user);
          });
        });
  
        const errorCb = DeviceEventEmitter.addListener('RNGoogleSignInError', (err) => {
          this._removeListeners(sucessCb, errorCb);
          reject(new GoogleSigninError(err.error, err.code));
        });
  
        RNAmplifyGoogleSignIn.signIn();
      });
    }
  
    signOut() {
      return new Promise((resolve, reject) => {
        const sucessCb = DeviceEventEmitter.addListener('RNGoogleSignOutSuccess', () => {
          this._removeListeners(sucessCb, errorCb);
          resolve();
        });
  
        const errorCb = DeviceEventEmitter.addListener('RNGoogleSignOutError', (err) => {
          this._removeListeners(sucessCb, errorCb);
          reject(new GoogleSigninError(err.error, err.code));
        });
  
        this._user = null;
        RNAmplifyGoogleSignIn.signOut();
      });
    }
  
    revokeAccess() {
      return new Promise((resolve, reject) => {
        const sucessCb = DeviceEventEmitter.addListener('RNGoogleRevokeSuccess', () => {
          this._removeListeners(sucessCb, errorCb);
          resolve();
        });
  
        const errorCb = DeviceEventEmitter.addListener('RNGoogleRevokeError', (err) => {
          this._removeListeners(sucessCb, errorCb);
          reject(new GoogleSigninError(err.error, err.code));
        });
  
        RNAmplifyGoogleSignIn.revokeAccess();
      });
    }
  
    _removeListeners(...listeners) {
      listeners.forEach(lt => lt.remove());
    }
  }
  
  const GoogleSignInSingleton = new GoogleSignin();
     export default GoogleSignInSingleton;