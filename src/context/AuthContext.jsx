import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload))
      return { user: action.payload }
    case 'LOGOUT':
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const userFromStorage = JSON.parse(localStorage.getItem('user'))

  const [state, dispatch] = useReducer(authReducer, {
    user: userFromStorage || null, // Use stored user as initial state
  })

  useEffect(() => {
    if (userFromStorage) {
      dispatch({ type: 'LOGIN', payload: userFromStorage })
    }
  }, [])

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
