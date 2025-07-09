const axios = require('axios');

const isKubernetes = Boolean(process.env.KUBERNETES_SERVICE_HOST);

const serverURL = isKubernetes
  ? 'http://watchlog-node-agent:3774'
  : 'http://127.0.0.1:3774';

class SocketCli {
    #sendMetric(method, metric, value = 1) {
        if (typeof metric !== 'string' || typeof value !== 'number') return;

        const url = `${serverURL}?method=${method}&metric=${encodeURIComponent(metric)}&value=${value}`;

        axios.get(url).catch(() => {}); // Fail silently
    }

    increment(metric, value = 1) {
        if (value > 0) this.#sendMetric('increment', metric, value);
    }

    decrement(metric, value = 1) {
        if (value > 0) this.#sendMetric('decrement', metric, value);
    }

    distribution(metric, value) {
        this.#sendMetric('distribution', metric, value);
    }

    gauge(metric, value) {
        this.#sendMetric('gauge', metric, value);
    }

    percentage(metric, value) {
        if (value >= 0 && value <= 100) this.#sendMetric('percentage', metric, value);
    }

    systembyte(metric, value) {
        if (value > 0) this.#sendMetric('systembyte', metric, value);
    }
}

module.exports = new SocketCli();