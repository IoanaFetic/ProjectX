export const defaultChartSettings = {
  "price_main": {
    "filter": {
      "product": ["Pepper"]
    },
    "sort": "brand"
  },
  "price_avg_pepper": {
    "filter": {
      "product": [
        "Pepper", "White Pepper"
      ],
      "brand": ["Kamis", "Fuchs", "Kotanyi", "Galeo", "Cosmin"]
    },
    "sort": "brand"
  },
  "price_avg_herbs": {
    "filter": {
      "product": ["General"],
      "brand": ["Kamis", "Fuchs", "Kotanyi", "Galeo", "Cosmin"]
    },
    "sort": "brand"
  },
  "price_product_bar_chart": {
    "filter": {
      "product": [
        "Pepper", "White Pepper"
      ],
      "report_month": ["March"]
    },
    "sort": "brand"
  },
  "price_avg_grinders": {
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
  "shelf_pie_chart": {
    "filter": {
      "value_type": ["shelf"],
      "report_month": ["August"]
    },
    "sort": "brand",
    "sum": true
  },
  "shelf_pie_chart_extra": {
    "filter": {
      "value_type": ["extra"],
      "report_month": ["August"]
    },
    "sort": "brand",
    "sum": true
  },
  "shelf_grouped_bar": {
    "filter": {
      "brand": ["Kamis", "Galeo"]
    },
    "sort": "brand",
    "sum": true
  },
  "shelf_donut_chart": {
    "filter": {
      "report_month": ["August"]
    },
    "sort": "merchandiser",
    "sum": true
  }
}
