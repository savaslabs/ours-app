import React from 'react'
import Inventory from './components/routes/Inventory'
import ItemDetail from './components/routes/ItemDetail'
import Community from './components/routes/Community'
import GroupDetail from './components/routes/GroupDetail'
import Profile from './components/routes/Profile'

const protectedRoutes = [
  {
    name: 'Inventory',
    exact: true,
    path: '/inventory',
    main: (props) => <Inventory {...props} />,
    public: false,
    inNav: true
  },
  {
    name: 'Community',
    exact: true,
    path: '/community',
    main: (props) => <Community {...props} />,
    public: false,
    inNav: true
  },
  {
    name: 'Profile',
    exact: true,
    path: '/me',
    main: (props) => <Profile {...props} />,
    public: false,
    inNav: true
  },
  {
    name: 'ItemDetail',
    exact: true,
    path: '/inventory/:itemId',
    main: (props) => <ItemDetail {...props} />,
    public: false,
    inNav: false
  },
  {
    name: 'GroupDetail',
    exact: true,
    path: '/community/:groupId',
    main: (props) => <GroupDetail {...props} />,
    public: false,
    inNav: false
  }
]

export default protectedRoutes
