import React, { useContext } from 'react'
import protectedRoutes from '../ProtectedRoutes'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App'

const Header = () => {
  const { isLoggedIn } = useContext(AuthContext)
  return (
    <header className='nav flex justify-end'>
      <nav>
        <ul className='flex flex-row justify-between'>
          {isLoggedIn &&
            protectedRoutes.map((route, i) => (
              route.name === 'ItemDetail' ? null :
              <li key={i} className='flex'>
                <Link to={route.path}>{route.name}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
