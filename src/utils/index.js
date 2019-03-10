export const countObjectProperties = obj => {
  if (typeof obj === 'object') {
    return Object.keys(obj).length;
  }

  return 0;
};

export const removeEmptyProperties = obj => {
  const objCopy = { ...obj };

  Object.keys(objCopy).forEach(key => {
    if ([null, undefined].includes(objCopy[key])) {
      delete objCopy[key];
    }
  });

  return objCopy;
};
