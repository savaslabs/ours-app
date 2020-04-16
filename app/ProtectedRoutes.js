import React from 'react'
import Inventory from './components/routes/Inventory'
import ItemDetail from './components/routes/ItemDetail'
import Community from './components/routes/Community'
import Profile from './components/routes/Profile'

const protectedRoutes = [
  {
    name: 'Inventory',
    exact: true,
    path: '/inventory',
    main: (props) => <Inventory {...props} />,
    public: false
  },
  {
    name: 'Community',
    exact: true,
    path: '/community',
    main: (props) => <Community {...props} />,
    public: false
  },
  {
    name: 'Profile',
    exact: true,
    path: '/me',
    main: (props) => <Profile {...props} />,
    public: false
  },
  {
    name: 'ItemDetail',
    exact: true,
    path: '/inventory/:itemId',
    main: (props) => <ItemDetail {...props} />,
    public: false
  }
]

export default protectedRoutes
