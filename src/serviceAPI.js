const { default: axios } = require("axios")
const BASE_URL = process.env.npm_package_config_BASE_URL
const ENDPOINT = process.env.npm_package_config_ENDPOINT

const berdiAPI = {
    //base_url: 'http://www.berdiservicos.com',
    base_url: BASE_URL,
    level_endpoint: ENDPOINT,
    send: function(frameJson){
        return axios.post(this.base_url + this.level_endpoint,frameJson)
    }
}


module.exports = berdiAPI