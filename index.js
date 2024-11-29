const axios = require('axios');

const serverURL = 'http://127.0.0.1:3774/'; // Replace with your server URL

class SocketCli {


    increment(metric = null, count = 1) {
        if (typeof metric === 'string' && typeof count === 'number' && count > 0) {
            try {
                axios({
                    url: serverURL + `?method=${'increment'}&metric=${metric}&count=${count}`
                }).then().catch(err => null)

            } catch (error) { }

        }
    }
    decrement(metric = null, count = 1) {
        if (typeof metric === 'string' && typeof count === 'number' && count > 0) {
            try {
                axios({
                    url: serverURL + `?method=${'decrement'}&metric=${metric}&count=${count}`
                }).then().catch(err => null)
            } catch (error) { }


        }
    }
    distribution(metric = null, count) {
        if (typeof metric === 'string' && typeof count === 'number') {
            try {
                axios({
                    url: serverURL + `?method=${'distribution'}&metric=${metric}&count=${count}`
                }).then().catch(err => null)
            } catch (error) { }

        }
    }
    gauge(metric = null, count) {
        if (typeof metric === 'string' && typeof count === 'number') {
            try {
                axios({
                    url: serverURL + `?method=${'gauge'}&metric=${metric}&count=${count}`
                }).then().catch(err => null)

            } catch (error) { }

        }
    }
    percentage(metric = null, count) {
        if (typeof metric === 'string' && typeof count === 'number' && count > 0 && count <= 100) {
            try {
                axios({
                    url: serverURL + `?method=${'percentage'}&metric=${metric}&count=${count}`
                }).then().catch(err => null)
            } catch (error) { }

        }
    }
    systembyte(metric = null, count) {
        if (typeof metric === 'string' && typeof count === 'number' && count > 0) {
            try {
                axios({
                    url: serverURL + `?method=${'systembyte'}&metric=${metric}&count=${count}`
                }).then().catch(err => null)
            } catch (error) { }

        }
    }

    // successLog(service = null, message) {
    //     if (typeof service === 'string' && typeof message === 'string') {
    //         try {
    //             fetch(serverURL, { method: "POST", body: JSON.stringify({ method: 'log', metric, count }) })
    //         } catch (error) { }

    //     }
    // }
    // errorLog(service = null, message) {
    //     if (typeof service === 'string' && typeof message === 'string') {
    //         if (ws && ws.readyState === WebSocket.OPEN) {
    //             ws.send(JSON.stringify({ method: 'log', service, message, status: -1 }));
    //         } else {
    //             // console.log("Data cannot be sent to the watchlog agent")
    //         }
    //     }
    // }
    // warningLog(service = null, message) {
    //     if (typeof service === 'string' && typeof message === 'string') {
    //         if (ws && ws.readyState === WebSocket.OPEN) {
    //             ws.send(JSON.stringify({ method: 'log', service, message, status: 2 }));
    //         } else {
    //             // console.log("Data cannot be sent to the watchlog agent")
    //         }
    //     }
    // }
    // log(service = null, message) {
    //     if (typeof service === 'string' && typeof message === 'string') {
    //         if (ws && ws.readyState === WebSocket.OPEN) {
    //             ws.send(JSON.stringify({ method: 'log', service, message, status: 0 }));
    //         } else {
    //             // console.log("Data cannot be sent to the watchlog agent")
    //         }
    //     }
    // }

}

module.exports = new SocketCli();
