# watchlog-metric

A Node.js client for [watchlog](https://watchlog.io/) server.

🔗 **Website**: [https://watchlog.io](https://watchlog.io)

## Installation

```bash
npm install watchlog-metric
# or
yarn add watchlog-metric
```

## Basic Usage

```javascript
const { default: watchlogMetric } = require("watchlog-metric")

// Send Metric: Increments a stat by a value (default is 1)
watchlogMetric.increment("Your_metric")
watchlogMetric.increment("Your_metric", 75)

// Send Metric: Decrements a stat by a value (default is 1)
watchlogMetric.decrement("Your_metric")
watchlogMetric.decrement("Your_metric", 25)

// Send Metric: Percentage a stat by a value (value is required. min is 0 and max is 100)
watchlogMetric.percentage("Your_metric", 12.23)

// Send Metric: To measure a specific metric (value is required)
watchlogMetric.gauge("Your_metric", 12.23)

// Send Metric: To send byte of a metric (value is required)
watchlogMetric.systembyte("Your_metric", 1024000000) // for example: 1024000000 is 1 GB
```

## TypeScript

```typescript
import watchlogMetric from 'watchlog-metric';

watchlogMetric.increment("Your_metric");
```

## Docker Setup

When running your Node.js app in Docker, you can specify the agent URL explicitly:

```javascript
const { SocketCli } = require("watchlog-metric");

// Create client with explicit agent URL for Docker
const watchlogMetric = new SocketCli('http://watchlog-agent:3774');

watchlogMetric.increment("Your_metric", 1);
```

**Docker Compose Example:**
```yaml
version: '3.8'

services:
  watchlog-agent:
    image: watchlog/agent:latest
    container_name: watchlog-agent
    ports:
      - "3774:3774"
    environment:
      - WATCHLOG_APIKEY=your-api-key
      - WATCHLOG_SERVER=https://log.watchlog.ir
    networks:
      - app-network

  node-app:
    build: .
    container_name: node-app
    ports:
      - "3000:3000"
    depends_on:
      - watchlog-agent
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**Docker Run Example:**
```bash
# 1. Create network
docker network create app-network

# 2. Run Watchlog Agent
docker run -d \
  --name watchlog-agent \
  --network app-network \
  -p 3774:3774 \
  -e WATCHLOG_APIKEY="your-api-key" \
  -e WATCHLOG_SERVER="https://log.watchlog.ir" \
  watchlog/agent:latest

# 3. Run Node.js app (make sure your code uses new SocketCli('http://watchlog-agent:3774'))
docker run -d \
  --name node-app \
  --network app-network \
  -p 3000:3000 \
  my-node-app
```

## Environment Detection

The package automatically detects the runtime environment:

* **Local / non-K8s**: `http://127.0.0.1:3774`
* **Kubernetes**: `http://watchlog-node-agent.monitoring.svc.cluster.local:3774`

**Manual Override:** You can override the endpoint by passing `agentUrl` parameter to `SocketCli` constructor:

```javascript
const { SocketCli } = require("watchlog-metric");
const client = new SocketCli('http://watchlog-agent:3774'); // Custom agent URL
```

**Important Notes:**
- When using Docker, use the container name as the hostname (e.g., `watchlog-agent`)
- Both containers must be on the same Docker network
- The agent must be running before your app starts
- If `agentUrl` is not provided, auto-detection will be used (local or Kubernetes)

## License

MIT © Watchlog
