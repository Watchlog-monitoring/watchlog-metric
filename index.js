// watchlog.js
const fs = require('fs');
const dns = require('dns');
const { promisify } = require('util');
const axios = require('axios');

const lookup = promisify(dns.lookup);

// ---- تشخیص اجرای داخل Kubernetes ----
async function isRunningInK8s() {
  // روش 1: ServiceAccount Token
  const tokenPath = '/var/run/secrets/kubernetes.io/serviceaccount/token';
  if (fs.existsSync(tokenPath)) {
    // console.debug(`Found Kubernetes serviceaccount token at ${tokenPath}`);
    return true;
  }

  // روش 2: بررسی cgroup
  try {
    const content = fs.readFileSync('/proc/1/cgroup', 'utf8');
    if (content.includes('kubepods')) {
    //   console.debug(`Found 'kubepods' in /proc/1/cgroup`);
      return true;
    }
  } catch (err) {
    // console.warn(`Error reading /proc/1/cgroup: ${err.message}`);
  }

  // روش 3: DNS lookup
  try {
    await lookup('kubernetes.default.svc.cluster.local');
    // console.debug('DNS lookup for kubernetes.default.svc.cluster.local succeeded');
    return true;
  } catch {
    // console.debug('DNS lookup failed, not in k8s');
    return false;
  }
}

// ---- کش کردن و تشخیص URL پیش‌فرض ----
let cachedServerURL = null;
async function getServerURL() {
  if (cachedServerURL) return cachedServerURL;

  if (await isRunningInK8s()) {
    cachedServerURL = 'http://watchlog-node-agent.monitoring.svc.cluster.local:3774';
    // console.info(`Detected Kubernetes environment, using URL ${cachedServerURL}`);
  } else {
    cachedServerURL = 'http://127.0.0.1:3774';
    // console.info(`Non-Kubernetes environment, using URL ${cachedServerURL}`);
  }

  return cachedServerURL;
}

// ---- کلاس اصلی برای ارسال متریک ----
class SocketCli {
  async #sendMetric(method, metric, value = 1) {
    if (typeof metric !== 'string' || typeof value !== 'number') {
    //   console.error(`Invalid metric or value: metric=${metric}, value=${value}`);
      return;
    }

    const baseURL = await getServerURL();
    const url = `${baseURL}?method=${method}&metric=${encodeURIComponent(metric)}&value=${value}`;
    // console.debug(`Sending metric to ${url}`);

    axios.get(url).catch(err => {
      // Fail silently
    //   console.error(`Failed to send metric: ${err.message}`);
    });
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
    if (value >= 0 && value <= 100) {
      this.#sendMetric('percentage', metric, value);
    } else {
      console.error(`Percentage out of range [0–100]: ${value}`);
    }
  }

  systembyte(metric, value) {
    if (value > 0) this.#sendMetric('systembyte', metric, value);
  }
}

module.exports = new SocketCli();
