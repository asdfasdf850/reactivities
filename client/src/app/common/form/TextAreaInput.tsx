import React, { FC } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'

interface Props extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const TextAreaInput: FC<Props> = ({ input, width, rows, placeholder, meta: { touched, error } }) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <textarea rows={rows} {...input} placeholder={placeholder} />
      {touched && error && (
        <Label basic color='red'>
          {error}
        </Label>
      )}
    </Form.Field>
  )
}

export default TextAreaInput
