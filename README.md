# watchlog

A Node.js client for [watchlog](https://watchlog.io/) server .



## Usage

```javascript

const watchlog = require("watchlog-metric")

// Send Metric: Increments a stat by a value (default is 1)
watchlog.increment("Your_metric")

watchlog.increment("Your_metric" , 75)


// Send Metric: Decrements a stat by a value (default is 1)
watchlog.decrement("Your_metric")

watchlog.decrement("Your_metric" , 25)

// Send Metric: Percentage a stat by a value (value is required. min is 0 and max is 100)
watchlog.percentage("Your_metric" , 12.23)

// Send Metric: To measure a specific metric (value is required)
watchlog.gauge("Your_metric" , 12.23)

// Send Metric: To send byte of a metric (value is required)
watchlog.systembyte("Your_metric" , 1024000000) //for example : 1024000000 is 1 GB


```

