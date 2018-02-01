import React from 'react'
import {mount} from 'react-mounter'
import {Wrapper} from './layouts/Wrapper.jsx'

import Splash from './splash/Splash.jsx'
import Upload from './upload/Upload.jsx'

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

FlowRouter.route('/prices',{
  action(){
    mount (Wrapper,{
      page: 'prices',
      content: <div>Prices Page</div>
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
