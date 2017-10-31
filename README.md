## Introduction
This is a simple encapsulation for manipulating the storage API when develops a
Chrome extension.

The API follows the interfaces of [chrome storage](https://developer.chrome.com/apps/storage),
but provides the feature of setting expires.

## Usage Example
```javascript
import ChromeStorage from 'chrome_extension_storage';


const storage = new ChromeStorage();

storage.set({
  testKey: 'testValue',
  testKey2: 'testValue2',
});

storage.get('testKey').then((value) => {
  assert(value.testKey === 'testValue');
  assert(value.testKey2 === 'testValue2');
});
```
