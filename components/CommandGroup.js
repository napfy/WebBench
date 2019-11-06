
export default {
  components: {
  },
  props: {
    guid: String,
    name: String,
    xcmd: String,
    precmd: String,
    fincmd: String,
    request_times: Number,
    concurrent: Number,
    timeout_seconds: Number,
    useab: Boolean
  },
  data () {
    return {
      name_edit: false,
      url: document.location.hostname || '127.0.0.1/',
      useinit: false,
      usefinish: false,
      keepalive: true,
      global_params: true,
      show_drawer: false,
      params: '',
      contype: 'application/json',
      http_method: 'GET',
      http_protocol: 'http://',
      http_prot_options: [
        {
          value: 'http://',
          label: 'HTTP://'
        },
        {
          value: 'https://',
          label: 'HTTPS://'
        }
      ],
      http_method_options: [
        'GET',
        'POST',
        'PUT',
        'DELETE'
      ],
      content_types: [
        'application/json',
        'multipart/form-data',
        'application/x-www-form-urlencoded',
        'text/xml',
        'text/plain',
        'text/html'
      ]
    }
  },
  methods: {
    editName () {
      this.name_edit = true
    },
    saveName () {
      this.name_edit = false
      this.$emit('changename', { name: this.name, guid: this.guid })
    },
    remove () {
      this.$emit('remove', { 'guid': this.guid })
    },
    buildCmd (httpMethod, httpProtocol, url, contentType, requestTimes, concurrent, timeoutSeconds, keepalive, filename) {
      const cmdArray = ['ab']
      cmdArray.push('-n')
      cmdArray.push(requestTimes.toString())
      if (concurrent > 1) {
        cmdArray.push('-c')
        cmdArray.push(concurrent.toString())
      }
      cmdArray.push('-m')
      cmdArray.push(httpMethod)
      if (timeoutSeconds > 0) {
        cmdArray.push('-s')
        cmdArray.push(timeoutSeconds.toString())
      }
      if (httpMethod === 'POST') {
        cmdArray.push('-p')
        cmdArray.push(filename)
        cmdArray.push('-T')
        cmdArray.push(contentType)
      }
      if (httpMethod === 'PUT') {
        cmdArray.push('-u')
        cmdArray.push(filename)
        cmdArray.push('-T')
        cmdArray.push(contentType)
      }
      if (keepalive) {
        cmdArray.push('-k')
      }
      cmdArray.push(httpProtocol + url)
      return cmdArray.join(' ')
    },
    genXcmd () {
      const cmd = this.buildCmd(this.http_method, this.http_protocol, this.url, this.contype, this.request_times, this.concurrent, this.timeout_seconds, this.keepalive, 'datafile')
      this.$emit('buildcmd', { 'guid': this.guid, cmd, 'precmd': this.precmd, 'fincmd': this.fincmd })
    }
  },
  watch: {
    precmd: 'genXcmd',
    fincmd: 'genXcmd',
    xcmd: 'genXcmd',
    http_protocol: 'genXcmd',
    url: 'genXcmd',
    http_method: 'genXcmd',
    contype: 'genXcmd',
    keepalive: 'genXcmd'
  }
}
