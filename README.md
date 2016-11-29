# mobx-form-store

[![Build Status](https://travis-ci.org/DarkoKukovec/mobx-form-store.svg?branch=master)](https://travis-ci.org/DarkoKukovec/mobx-form-store)
[![Dependency Status](https://david-dm.org/DarkoKukovec/mobx-form-store.svg)](https://david-dm.org/DarkoKukovec/mobx-form-store)
[![devDependency Status](https://david-dm.org/DarkoKukovec/mobx-form-store/dev-status.svg)](https://david-dm.org/DarkoKukovec/mobx-form-store#info=devDependencies)

This is an opnionated way to simplify working with froms and Mobx. 
It provides a straight forward API for keeping states, 
validating user inputs, and handeling API errors. It's important to note
this can be used with React but also anywhere else wher you can use Mobx.

## Example

Here is how you would create a simple registration form that has:

* a submit action that sends the data to an API endpoint
* has a username field that has to be filled in and needs to be an email
* a password that isn't like the username, has a minimum length of 6, and is required

```JavaScript
import {FormStore} from 'mobx-form-store';

const store = new FormStore({
  submitAction(formData) {
    return fetch('https://example.org/api/register', {
      data: JSON.stringify(formData)
    }).then((data) => data.json());
  },
  fields: {
    username: {
      validators: {
        required: true,
        email: true
      }
    },
    password: {
      validators: {
        required: true,
        minLength: 6,
        notEquals: 'username'
      }
    }
  },
  validators: {
    notEquals(field, targetField) {
      const targetValue = this.fields[targetField].value;
      return field.value !== targetValue;
    }
  }
});

const {username, password} = store.fields;
username.value = 'test@example.org';
password.value = 'Pa$$w0rd';

store.submit().then((response) => {
  // e.g. response.token
});
```

## License

The MIT License

![](https://assets.DarkoKukovec.co/assets/brand-logo-9e079bfa1875e17c8c1f71d1fee49cf0.svg) © 2016 DarkoKukovec Inc.
