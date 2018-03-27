color = {
  green: '#00a850',
  text1: '#3c3c3c',
  content: '#E0FDE0',
  border: '#cccccc'
}

ref = {
  months: [
    'January',
    'Feburary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
}

palette = [
  "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"
]

refColor = {
  "Kamis": "#00a850",
}

  globalChartOptions = {
    layout: {
        padding: {
            left: 5,
            right: 0,
            top: 0,
            bottom: 0
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0
      }
    },
    bezierCurve: false,


  }

  Style = {
    dashStyle: {
      cell: {
        display: 'flex',
        flexGrow: 1,
        position: 'relative',
        flexShrink: 0
      },
      column: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        flexGrow: 1,
        flexShrink: 0
      },
      upperContainer: {
        display: 'flex',
        flexGrow: 1,
        flexBasis: 1,
        position: 'relative'
      },
      lowerContainer: {
        display: 'flex',
        flexGrow: 1.5,
        flexBasis: 1,
        position: 'relative'
      }
    }
  }
