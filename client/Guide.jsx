import React from 'react'

export default class Guide extends React.Component {
  render() {
      return (<div style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}>
        <iframe src="https://prezi.com/view/GIjezLPsBm8t0wT0VCFd/embed" style={{
            width: "100%",
            height: "100%",
            border: 0
          }}></iframe>
      </div>)
  }
}
