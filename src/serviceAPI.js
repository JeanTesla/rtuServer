const { default: axios } = require("axios")
const env = require('../env')

const berdiAPI = {
    //base_url: 'http://www.berdiservicos.com',
    base_url: env.BASE_URL,
    level_endpoint: env.ENDPOINT,
    send: function(frameJson){
        return axios.post(this.base_url + this.level_endpoint,frameJson)
    }
}


module.exports = berdiAPI