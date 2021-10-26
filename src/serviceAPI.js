const { default: axios } = require("axios")

const berdiAPI = {
    //base_url: 'http://www.berdiservicos.com',
    base_url: 'http://berdi.localhost/api',
    level_endpoint: '/save_level',
    send: function(frameJson){
        return axios.post(this.base_url + this.level_endpoint,frameJson)
    }
}


module.exports = berdiAPI