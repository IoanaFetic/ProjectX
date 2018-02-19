import React from 'react'
import MainLayout from './MainLayout.jsx'

DB = {
  Price: new Mongo.Collection ('price'),
  Shelf: new Mongo.Collection ('shelf')
}

export const Wrapper = ({page, content}) => (
    <MainLayout page={page} content={content}/>
)
