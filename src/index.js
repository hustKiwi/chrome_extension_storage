const STORAGE_EXPIRES_KEY = '__EXPIRES__';

export class ChromeStorage {
  constructor(area = 'local') {
    if (['local', 'sync'].indexOf(area) < 0) {
      throw new Error(`Area ${area} is not supported.`);
    }
    this._area = chrome.storage[area];
  }

  get(keys) {
    const r = {};
    const now = +new Date();

    return new Promise((resolve) => {
      this._area.get(keys, (obj) => {
        const expiresList = [];

        Object.entries(obj).forEach(([k, item]) => {
          const expires = parseInt(item[STORAGE_EXPIRES_KEY], 10);

          if (expires) {
            if (expires < now) {
              expiresList.push(k);
            } else {
              r[k] = item.value;
            }
          } else {
            r[k] = item;
          }
        });

        if (expiresList.length) {
          this._area.remove(expiresList.join(','), () => {
            resolve(r);
          });
        } else {
          resolve(r);
        }
      });
    });
  }

  set(obj, expires) {
    // if the storage does not have enough space,
    // it will alert a runtime error.
    // refs:
    //   - http://stackoverflow.com/a/23593477
    //   - https://developer.chrome.com/extensions/runtime#property-lastError
    if (chrome.runtime.lastError) {
      /* eslint-disable no-console */
      console.error(chrome.runtime.lastError);
      /* eslint-enable no-console */
      this._area.clear();
    }

    if (expires > 0) {
      expires = +new Date() + expires;
      Object.entries(obj).forEach(([k, item]) => {
        obj[k] = {
          value: item,
          [STORAGE_EXPIRES_KEY]: expires,
        };
      });
    }

    return new Promise((resolve) => {
      this._area.set(obj, resolve);
    });
  }

  remove(keys) {
    return new Promise((resolve) => {
      this._area.remove(keys, resolve);
    });
  }
}

export default new ChromeStorage();
