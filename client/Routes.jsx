import React from 'react'
import {mount} from 'react-mounter'
import {MainLayout} from './layouts/MainLayout.jsx'
import Splash from './splash/Splash.jsx'

FlowRouter.route('/',{
  action(){
    mount (MainLayout,{
      content: <Splash/>
    })
  }
})
