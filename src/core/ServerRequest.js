import request from 'request'

const server = 'https://framermodules.herokuapp.com/'

const ServerRequest = {
    // Using function instead of fat arrow for easier 'this' binding
    get:    function(...args) { this.makeRequest('GET',  ...args) },
    post:   function(...args) { this.makeRequest('POST', ...args) },
    put:    function(...args) { this.makeRequest('PUT',  ...args) },

    makeRequest: function(req_method, req, data = null, callback = () => {}) {
        const cb = (typeof data === 'function') ? data : callback

        const requestOptions = {
            uri: req,
            baseUrl: server,
            method: req_method,
            qs: (req_method === 'GET' && Array.isArray(data.modules)) ? data : null,
            form: (req_method === 'POST' && typeof data === 'object') ? data : null,
            headers: {
                'User-Agent': 'Framer Modules'
            }
        }

        request(requestOptions, (err, res, responseData) => {
            if (err) {
                // Mimic response from server (since we're not actually getting one)
                return cb({
                    message: `REQUEST TO SERVER FAILED: ${err.message}`,
                    statusCode: 0,
                    status: 'ERR',
                    data: null
                })
            }

            return cb( JSON.parse(responseData) )
        })
    }
}

export default ServerRequest
