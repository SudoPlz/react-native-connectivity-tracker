## react-native-connectivity-tracker


### Why?
Because we can no longer trust that react-native connectivity changes are valid, so we have to double check before we trust the result.
Here's the [RN issue](https://github.com/facebook/react-native/issues/8615)


### How?

The only thing this library does is, whenever a network change event get's dispatched by `NetInfo`, we verify that the connection is alive by pinging google.

p.s: On production we verify by checking if our server is up (by overriding `verifyServersAreUp`) but you don't have to do that.

### Usage:

```javascript
import ConnectivityTracker from 'react-native-connectivity-tracker';

const onConnectivityChange = (isConnected, timestamp, connectionInfo) => {
    console.log(`isConnected: ${isConnected}, when: ${timestamp} more info: ${JSON.stringify(connectionInfo)}`)
    // connectionInfo is only available if attachConnectionInfo is set to true
}

ConnectivityTracker.init({
    onConnectivityChange,
    attachConnectionInfo: false,
    onError: msg => console.log(msg),
    // verifyServersAreUp: () => store.dispatch(checkOurServersAreUp()),
});
```
    

### Params:

|Key 	| Type 	| Default	| Definition	 |
| ---	| --- 	| ---- 		| ----------- 	 |
| **onConnectivityChange**  	| function(bool, Date, Object)  | -  | This is the main callback you should care about. It get's dispatched whenever there's a connectivity change. |
| **attachConnectionInfo**   	| boolean  			| false | Attaches more details about the connection on the `onConnectivityChange` callback (3rd param) |
| **alsoVerifyOnlineStatuses**   	| boolean  			| false | By default we only verify the connectivity whenever we receive an offline status. By turning this on we'll also verify online statuses too. |
| **dispatchOldEventsToo**   	| boolean  			| false | By default we only dispatch the latest event we received from NetInfo. By turning this on we'll dispatch EVERYTHING. Caution, the order of events is not guaranteed if this is set to true. |
| **onError** 			| function  			| - | Pass a function here if you want to log errors.   |
| **verifyServersAreUp**   	| function 		| - | This overrides the default verification method. Feel free to disregard this, unless  want to use your own verification method, instead of relying to google responces. This function can return either a result (true or false) or a Promise  |


### Methods:

|Key 	|  Definition	 |
| ---	|  ----------- 	 |
| **tryConnection**   | This is a tottally optional method that you can call when you wish to check for a connectivity status on demand. The response comes through `onConnectivityChange` like it would typically come if the event was coming from the system.|
