export const defaultChartSettings = {
  "price_main": {
    "filter": {
      "product": ["Pepper"]
    },
    "sort": "brand"
  },
  "avg_pepper_price": {
    "filter": {
      "product": [
        "Pepper", "White Pepper"
      ],
      "brand": ["Kamis", "Fuchs", "Kotanyi", "Galeo", "Cosmin"]
    },
    "sort": "brand"
  },
  "avg_herbs_price": {
    "filter": {
      "product": ["General"],
      "brand": ["Kamis", "Fuchs", "Kotanyi", "Galeo", "Cosmin"]
    },
    "sort": "brand"
  },
  "product_price_bar_chart": {
    "filter": {
      "product": [
        "Pepper", "White Pepper"
      ],
      "report_month": ["March"]
    },
    "sort": "brand"
  },
  "avg_grinders_price": {
    "filter": {
      "brand": [
        "Kamis", "Fuchs", "Kotanyi"
      ],
      "package_type": ["Grinders"]
    },
    "sort": "brand"
  },
  "shelf_main": {
    "filter": {
      "brand": ["Kamis", "Fuchs", "Kotanyi"]
    },
    "sort": "brand",
    "sum": true
  },
  "pie_shelf": {
    "filter": {
      "value_type": ["shelf"],
      "report_month": ["August"]
    },
    "sort": "brand",
    "sum": true
  },
  "pie_extra": {
    "filter": {
      "value_type": ["extra"],
      "report_month": ["August"]
    },
    "sort": "brand",
    "sum": true
  },
  "grouped_bar": {
    "filter": {
      "brand": ["Kamis", "Galeo"]
    },
    "sort": "brand",
    "sum": true
  },
  "donut_chart": {
    "filter": {
      "report_month": ["August"]
    },
    "sort": "merchandiser",
    "sum": true
  }
}
