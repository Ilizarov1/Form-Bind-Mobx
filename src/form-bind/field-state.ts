import { makeAutoObservable } from 'mobx'

export type Disposer = () => void
export type Disposers = Disposer[]
type Validators<T> = ((val: T | null) => string | undefined)[]

export class FieldState<T> {
  value: T | null = null;
  error: string | null = null;
  hasError = false;
  initValue: T | null = null;
  disposers: Disposers = []
  validators: Validators<T> = [];

  addDisposer(dispose: Disposer) {
    this.disposers.push(dispose);
  }
  
  dispose() {
    this.disposers.forEach(disposer => disposer())
    this.disposers = []
  }

  withValidators(validator: (val: T | null) => string | undefined) {
    this.validators.push(validator);
    return this;
  }

  doValidation() {
    this.validators.forEach(validator => {
      const result = validator(this.value);
      if (typeof result === 'string') {
        this.error = result;
        this.hasError = true;
      } else {
        this.error = '';
        this.hasError = false;
      }
    })
  }

  onChange(val: T | null) {
    console.log(val)
    this.value = val;
  }

  reset() {
    this.value = this.initValue
  }
  
  constructor(value?: T) {
    this.value = value ?? null;
    this.initValue = value ?? null;
    makeAutoObservable(this);

  }
}