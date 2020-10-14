import React, { FC } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label, Select } from 'semantic-ui-react'

interface Props extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const SelectInput: FC<Props> = ({ input, width, options, placeholder, meta: { touched, error } }) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <Select
        value={input.value}
        onChange={(e, data) => input.onChange(data.value)}
        placeholder={placeholder}
        options={options}
      />
      {touched && error && (
        <Label basic color='red'>
          {error}
        </Label>
      )}
    </Form.Field>
  )
}

export default SelectInput
