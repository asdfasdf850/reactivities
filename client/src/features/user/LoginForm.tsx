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
  email: isRequired('email'),
  password: isRequired('password')
})

const LoginForm: FC = () => {
  const rootStore = useContext(RootStoreContext)
  const { login } = rootStore.userStore

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch(error => ({
          [FORM_ERROR]: error
        }))
      }
      validate={validate}
      render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as='h2' content='Login to Reactivitites' color='teal' textAlign='center' />
          <Field name='email' component={TextInput} placeholder='Email' autoComplete='off' />
          <Field name='password' type='password' component={TextInput} placeholder='Password' />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} text='Invalid email or password' />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            content='Login'
            fluid
            color='teal'
          />
        </Form>
      )}
    />
  )
}

export default LoginForm
