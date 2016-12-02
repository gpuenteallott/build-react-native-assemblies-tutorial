import { DEV } from '../config';

export function rowHasChanged(r1, r2){
  return r1 != r2;
}

export function log(){
	if (DEV) { console.log.apply(this, [...arguments]); }
}
export function logerr(){
	if (DEV) { console.err.apply(this, [...arguments]); }
}

export function registerError({ email, password, location, firstName, lastName}){
  let errorMsgs = [];
  if (! /@/.test(email)) { errorMsgs.push('invalid email address'); }
  if (! password.length) { errorMsgs.push('must set a password'); }
  if (! location || typeof location !== "object") { errorMsgs.push("must set a valid location"); }
  if (firstName === '') { errorMsgs.push('must set a first name'); }
  if (lastName === '') { errorMsgs.push('must set a last name'); }

  let errorMsg = errorMsgs.join(', ');
  return errorMsg.length
    ? errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1) + '.'
    : '';
}