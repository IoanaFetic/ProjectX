import React from 'react'
import {mount} from 'react-mounter'
import {Wrapper} from './layouts/Wrapper.jsx'

import Splash from './splash/Splash.jsx'
import Upload from './upload/Upload.jsx'
import Price from './price/Price.jsx'

FlowRouter.route('/',{
  action(){
    mount (Wrapper,{
      page: 'splash',
      content: <Splash/>
    })
  }
})

FlowRouter.route('/upload',{
  action(){
    mount (Wrapper, {
      page: 'upload',
      content: <Upload/>
    })
  }
})

FlowRouter.route('/price',{
  action(){
    mount (Wrapper,{
      page: 'price',
      content: <Price/>
    })
  }
})

FlowRouter.route('/shelf',{
  action(){
    mount (Wrapper,{
      page: 'shelf',
      content: <div>Shelf Page</div>
    })
  }
})
