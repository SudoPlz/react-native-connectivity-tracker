## react-native-connectivity-tracker


### Why?
Because we can no longer trust that react-native connectivity changes are valid, so we have to double check before we trust the result.
Here's the [RN issue](https://github.com/facebook/react-native/issues/8615)

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
    // verifyServersAreUp: store.dispatch(checkOurServersAreUp()),
});
```
    

### Params:

|Key 	| Type 	| Default	| Definition	 |
| ---	| --- 	| ---- 		| ----------- 	 |
| **onConnectivityChange**  	| function(bool, Date, Object)  | -  | This is the main callback you should care about. It get's dispatched whenever there's a connectivity change. |
| **attachConnectionInfo**   	| boolean  			| false | Attaches more details about the connection on the `onConnectivityChange` callback (3rd param) |
| **onError** 			| function  			| - | Pass a function here if you want to log errors.   |
| **verifyServersAreUp**   	| Promise or function 		| - | This overrides the default verification method. Feel free to disregard this, unless  want to use your own verification method, instead of relying to google responces.  |

