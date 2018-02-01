import React from 'react'
import MainLayout from './MainLayout.jsx'

DB = {
  Prices: new Mongo.Collection ('prices')
}

export const Wrapper = ({page, content}) => (
    <MainLayout page={page} content={content}/>
)
