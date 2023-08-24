import { useEffect, useRef, useState } from 'react'
import { FormState } from "./form-state";

export function useFormState<D extends any[], Fn extends (...arg: D) => FormState<any>>(createFn: Fn, params: D) {
  const [state, setState] = useState(() => createFn.apply(null, params));
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current){
      isFirst.current = false;
      return;
    }
    console.log('params', params)
    setState(() => createFn.apply(null, params))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, params)

  useEffect(() => {
    return state.dispose;
  }, [state])

  return state;
}