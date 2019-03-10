import firebase from 'firebase';
import { helpers } from 'vuelidate/lib/validators';

export const uniqueUsername = value => {
  if (!helpers.req(value)) {
    return true;
  }

  return new Promise(resolve => {
    firebase
      .database()
      .ref('users')
      .orderByChild('usernameLower')
      .equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()));
  });
};

export const uniqueEmail = value => {
  if (!helpers.req(value)) {
    return true;
  }

  return new Promise(resolve => {
    firebase
      .database()
      .ref('users')
      .orderByChild('email')
      .equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()));
  });
};

export const supportedImageFile = value => {
  const supported = ['jpg', 'jpeg', 'gif', 'pmg', 'svg'];
  const suffix = value.split('.').pop();

  return supported.includes(suffix);
};

export const responseOk = value => {
  if (!helpers.req(value)) {
    return true;
  }

  return new Promise(resolve => {
    fetch(value)
      .then(response => resolve(response.ok))
      .catch(() => resolve(false));
  });
};
