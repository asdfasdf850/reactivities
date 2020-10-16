import React, { FC, useContext } from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'
import { Button, Form, Header } from 'semantic-ui-react'
import { combineValidators, isRequired } from 'revalidate'

import TextInput from 'app/common/form/TextInput'
import { RootStoreContext } from 'app/stores/rootStore'
import { IUserFormValues } from 'app/models/user'
import ErrorMessage from 'app/common/form/ErrorMessage'

const validate = combineValidators({
  username: isRequired('username'),
  displayName: isRequired('displayName'),
  email: isRequired('email'),
  password: isRequired('password')
})

const RegisterForm: FC = () => {
  const rootStore = useContext(RootStoreContext)
  const { register } = rootStore.userStore

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch(error => ({
          [FORM_ERROR]: error
        }))
      }
      validate={validate}
      render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as='h2' content='Sign up to Reactivitites' color='teal' textAlign='center' />
          <Field name='username' component={TextInput} placeholder='Username' autoComplete='off' />
          <Field name='displayName' component={TextInput} placeholder='Display Name' autoComplete='off' />
          <Field name='email' component={TextInput} placeholder='Email' autoComplete='off' />
          <Field name='password' type='password' component={TextInput} placeholder='Password' />
          {submitError && !dirtySinceLastSubmit && <ErrorMessage error={submitError} />}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            content='Register'
            fluid
            color='teal'
          />
        </Form>
      )}
    />
  )
}

export default RegisterForm
