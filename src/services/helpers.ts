export const convertNumberToBoolean = (number: number): boolean  => {
  if (number === 1) {
    return true;
  } else if (number === 0) {
    return false;
  } else {
    throw new Error('El número no es 0 ni 1');
  }
}

