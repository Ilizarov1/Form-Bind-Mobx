'use client';
import { observer } from 'mobx-react-lite'
import { Input, Button } from 'antd'
import { FieldState } from '@/form-bind/field-state'
import { FormState } from '@/form-bind/form-state';
import { reaction } from 'mobx';
import { useFormState } from '@/form-bind/hooks';

function createForm(val1: string, val2: string) {
  const field1 = new FieldState('')
    .withValidators((val) => {
      if (val && val.length <= 3) return '长度必须大于3'
    }).withValidators((val) => {
      if (val && val.length >= 10) return '长度必须小于10'
    });
  const field2 = new FieldState('');
  const form = new FormState({
    field1,
    field2
  })

  form.addDisposer(reaction(
    () => form.fields['field1'].value,
    (val) => {
      form.fields['field2'].onChange(val)
    }
  ))
  
  return form;
}

export default observer(function BindTest() {
  const form = useFormState(createForm, ['1', ''])

  const handleSubmit = () => {
    form.validate()
    console.log('form.hasError', form.hasError);
    console.log('form.value', form.value)
  }


  return (
    <>
      <Input
        onChange={(val) => form.fields['field1'].onChange(val.target.value)}
        value={form.fields['field1'].value ?? ''}
        status={form.fields['field1'].hasError ? 'error' : ''}
      />
      <Input
        onChange={(val) => form.fields['field2'].onChange(val.target.value)}
        value={form.fields['field2'].value ?? ''}
        status={form.fields['field2'].hasError ? 'error' : ''}
      />
      <Button onClick={handleSubmit}>submit</Button>
    </>

  )


})