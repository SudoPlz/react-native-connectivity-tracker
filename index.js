/* eslint-disable react/no-this-in-sfc */
import { NetInfo } from 'react-native';
import _ from 'underscore';

module.exports = {  // cached singleton instance
  mOpts: null,
  lastChangeAt: null,
  init(options) {
    this.mOpts = options;
    NetInfo.isConnected.addEventListener('connectionChange', _.throttle(this.handleConnectivityChange.bind(this), 1000));
    this.tryConnection();
  },

  tryConnection() {
    return NetInfo.isConnected.fetch()
      .then(this.handleConnectivityChange.bind(this))
  },

  // Connectivity handling
  // This will get called whenever our connectivity status changes
  handleConnectivityChange(isConnected) {
    const timestampOfChange = new Date(); // keep a timestamp of the change
    this.lastChangeAt = timestampOfChange; // add it to a global var
    if (!isConnected  // if rn says we're not connected
      || // OR
      (
        this.mOpts // if we want to double check online statuses too
        && this.mOpts.alsoVerifyOnlineStatuses === true)
    ) {
      return this.verifyServersAreUp().then((areUp) => {
        // now that we've verified wether we're up or not
        if (this.shouldDispatchEvent(timestampOfChange)) {
          // also check if the value was null (in case of errors)
          const newValue = (areUp == null) ? isConnected : areUp;

          // and dispatch the event
          this.dispatchConnectivityChanged(newValue, timestampOfChange);
          return newValue;
        }
      });
    } else if (this.shouldDispatchEvent(timestampOfChange)) {
      // make sure we ONLY dispatch if there hasn't been any more recent con change event
      this.dispatchConnectivityChanged(isConnected, timestampOfChange);
    }
    return isConnected;
  },

  shouldDispatchEvent(timestampOfChange) {
    // only dispatch an event if
    return (
      // if there hasn't been any more recent con change event
      this.lastChangeAt === timestampOfChange
      || // OR
      // if we wish to dispatch old events as well
      (this.mOpts && this.mOpts.dispatchOldEventsToo === true)
    );
  },

  verifyServersAreUp() {
    if (this.mOpts) { // if we have options
      if (this.mOpts.verifyServersAreUp) {  // and we have a verification callback/promise
        const verification = this.mOpts.verifyServersAreUp();
        if (typeof(verification) === 'boolean') {
          return verification
        } else if (verification.then != null) { // else if it's a promise
          // verify servers are up
          return verification
            .then(res => res)
            .catch((e) => {
              if (this.mOpts.onError) {
                this.mOpts.onError(e);
              }
              return null;
            });
        }

        if (this.mOpts.onError) {
          this.mOpts.onError(
            'Check the value you\'re passing to verifyServersAreUp. We support functions or promises only.',
          );
        }
      }
    }
    return this.defaultVerifyServersAreUp();
  },

  dispatchConnectivityChanged(isConnected, timestamp) {
    // finally dispatch a callback if we have one
    if (this.mOpts.onConnectivityChange) {
      if (this.mOpts.attachConnectionInfo) {
        NetInfo.getConnectionInfo().then((conInfo) => {
          this.mOpts.onConnectivityChange(isConnected, timestamp, conInfo);
        });
      } else {
        this.mOpts.onConnectivityChange(isConnected, timestamp);
      }
    }
  },

  defaultVerifyServersAreUp() {
    // eslint-disable-next-line
    return fetch(
      'https://www.google.com', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        },
      },
    ).then(googleResult => (googleResult.status >= 200 && googleResult.status < 400),
    ).catch((e) => {
      if (e
        && e.message
        && e.message.indexOf
        && e.message.indexOf('Network request failed') !== -1) {
        return false;
      }
      if (this.mOpts.onError) {
        this.mOpts.onError(e);
      }
      return null;
    });
  },

};
