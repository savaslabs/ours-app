import React, { useContext } from 'react'
import protectedRoutes from '../ProtectedRoutes'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App'

const Header = () => {
  const { isLoggedIn } = useContext(AuthContext)
  return (
    <ul className='nav'>
      {protectedRoutes.map((route, i) => (
        <li key={i}>
          <Link to={route.path}>{route.name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default Header
