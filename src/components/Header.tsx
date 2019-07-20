import React, {
  useState,
  ChangeEventHandler,
  KeyboardEventHandler,
} from 'react'
import { connect } from 'react-redux'
import {
  compose,
  Dispatch,
  ActionCreator,
  Action,
  bindActionCreators,
} from 'redux'
import { getNewId } from '../utils'
import { get } from 'lodash'
import { Todos, RootState, AuthUser } from '../Types'
import { withFirebase } from './firebase'
import { todosActions } from '../store/todos'
import { withAuthUser } from './session'

const { addTodo } = todosActions

interface Props {
  todos: Todos
  addTodo: ActionCreator<Action>
  authUser: AuthUser
}

const HeaderComponent: React.FC<Props> = props => {
  const { todos, addTodo, authUser } = props
  const [value, setValue] = useState('')

  const handleChange: ChangeEventHandler<HTMLInputElement> = e =>
    setValue(get(e, ['target', 'value'], ''))

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter' && value) {
      addTodo({
        todo: {
          id: getNewId(todos),
          text: value,
          completed: false,
          serverId: '',
        },
        userId: authUser.uid,
      })

      setValue('')
    }
  }

  return (
    <header>
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        value={value}
      />
    </header>
  )
}

export default compose(
  withFirebase,
  withAuthUser,
  connect(
    ({ todos: { todos } }: RootState) => ({ todos }),
    (dispatch: Dispatch) => bindActionCreators({ addTodo }, dispatch)
  )
)(HeaderComponent) as React.ComponentType
