import React from 'react'
import {mount} from 'react-mounter'
// import each page's top level component
import Splash from './splash/Splash.jsx'
import Upload from './upload/Upload.jsx'
import Price from './price/Price.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import Shelf from './shelf/Shelf.jsx'
import Guide from './Guide.jsx'

const ReturnMainLayout = ({page, content}) => (
// return MainLayout component with arguments for specific page
<MainLayout page={page} content={content}/>)
FlowRouter.route('/upload', {
  action() { // run this when /upload is requested
    mount(ReturnMainLayout, { // mount result of ReturnMainLayout function to DOM
      page: 'upload', // argument to identify page
      content: <Upload/> // argument to set as content of MainLayout component
    })
  }
})

FlowRouter.route('/', {
  action() {
    mount(ReturnMainLayout, {
      page: 'splash',
      content: <Splash/>
    })
  }
})

FlowRouter.route('/price', {
  action() {
    mount(ReturnMainLayout, {
      page: 'price',
      content: <Price/>
    })
  }
})

FlowRouter.route('/guide', {
  action() {
    mount(ReturnMainLayout, {
      page: 'guide',
      content: <Guide/>
    })
  }
})

FlowRouter.route('/shelf', {
  action() {
    mount(ReturnMainLayout, {
      page: 'shelf',
      content: <Shelf/>
    })
  }
})
