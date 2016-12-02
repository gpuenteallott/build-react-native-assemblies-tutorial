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
