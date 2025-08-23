import axios from 'axios';

declare function require(name: string): any;
const fs = require('fs');
const dns = require('dns');
const { promisify } = require('util');

const lookup = promisify(dns.lookup);

async function isRunningInK8s(): Promise<boolean> {
  const tokenPath = '/var/run/secrets/kubernetes.io/serviceaccount/token';
  if (fs.existsSync(tokenPath)) {
    return true;
  }

  try {
    const content = fs.readFileSync('/proc/1/cgroup', 'utf8');
    if (content.includes('kubepods')) {
      return true;
    }
  } catch {
    // ignore
  }

  try {
    await lookup('kubernetes.default.svc.cluster.local');
    return true;
  } catch {
    return false;
  }
}

let cachedServerURL: string | null = null;
async function getServerURL(): Promise<string> {
  if (cachedServerURL) return cachedServerURL;

  if (await isRunningInK8s()) {
    cachedServerURL = 'http://watchlog-node-agent.monitoring.svc.cluster.local:3774';
  } else {
    cachedServerURL = 'http://127.0.0.1:3774';
  }

  return cachedServerURL;
}

class SocketCli {
  async #sendMetric(method: string, metric: string, value = 1): Promise<void> {
    if (typeof metric !== 'string' || typeof value !== 'number') {
      return;
    }

    const baseURL = await getServerURL();
    const url = `${baseURL}?method=${method}&metric=${encodeURIComponent(metric)}&value=${value}`;

    axios.get(url).catch(() => {
      // Fail silently
    });
  }

  increment(metric: string, value = 1): void {
    if (value > 0) this.#sendMetric('increment', metric, value);
  }

  decrement(metric: string, value = 1): void {
    if (value > 0) this.#sendMetric('decrement', metric, value);
  }

  distribution(metric: string, value: number): void {
    this.#sendMetric('distribution', metric, value);
  }

  gauge(metric: string, value: number): void {
    this.#sendMetric('gauge', metric, value);
  }

  percentage(metric: string, value: number): void {
    if (value >= 0 && value <= 100) {
      this.#sendMetric('percentage', metric, value);
    } else {
      console.error(`Percentage out of range [0–100]: ${value}`);
    }
  }

  systembyte(metric: string, value: number): void {
    if (value > 0) this.#sendMetric('systembyte', metric, value);
  }
}

export default new SocketCli();
export { SocketCli };
