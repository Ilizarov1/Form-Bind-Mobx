import { isObservable, makeAutoObservable, observable } from 'mobx'
import { Disposer, Disposers, FieldState } from "./field-state";

export interface States {
  [key: string]: FieldState<any>
}

export class FormState<S extends States> {
  fields: S;
  hasError = false;
  disposers: Disposers = []

  get value() {
    return Object.keys(this.fields).reduce((value, key) => ({
      ...value,
      [key]: this.fields[key].value
    }), {})
  }

  reset() {
    Object.keys(this.fields).forEach(key => {
      this.fields[key].reset();
    })
  }

  validate() {
    Object.keys(this.fields).forEach(key => {
      this.fields[key].doValidation();
      this.hasError ||= this.fields[key].hasError
      if (this.hasError) return;
    })
    this.hasError = false;
  }
  
  addDisposer(disposer: Disposer) {
    this.disposers.push(disposer)
  }

  dispose() {
    Object.keys(this.fields).forEach(key => {
      this.fields[key].dispose()
    })
    this.disposers.forEach(disposer => disposer())
    this.disposers = []
  }

  constructor(states: S) {
    this.fields = states;
    makeAutoObservable(this);
    if (!isObservable(states)) {
      states = observable(states, undefined, { deep: false })
    }
  }
}