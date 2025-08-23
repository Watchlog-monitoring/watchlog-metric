# watchlog

A Node.js client for [watchlog](https://watchlog.io/) server .

## Usage

```javascript
const { default: watchlogMetric } = require("watchlog-metric")

// Send Metric: Increments a stat by a value (default is 1)
watchlogMetric.increment("Your_metric")

watchlogMetric.increment("Your_metric" , 75)

// Send Metric: Decrements a stat by a value (default is 1)
watchlogMetric.decrement("Your_metric")

watchlogMetric.decrement("Your_metric" , 25)

// Send Metric: Percentage a stat by a value (value is required. min is 0 and max is 100)
watchlogMetric.percentage("Your_metric" , 12.23)

// Send Metric: To measure a specific metric (value is required)
watchlogMetric.gauge("Your_metric" , 12.23)

// Send Metric: To send byte of a metric (value is required)
watchlogMetric.systembyte("Your_metric" , 1024000000) //for example : 1024000000 is 1 GB
```

## TypeScript

```typescript
import watchlog from "watchlog-metric";

watchlog.increment("Your_metric");
```
