import { initTracer } from 'jaeger-client'
export { Tags, FORMAT_HTTP_HEADERS } from 'opentracing'

const APP_PORT = Number(process.env.PORT)

// more config options: https://github.com/jaegertracing/jaeger-client-node/blob/master/README.md
const config = {
  serviceName: `tutorial-opentracing-${APP_PORT}`,  // each API has different "name" in Jaeger (why not!)
  sampler: {
    type: 'const',
    param: 1,
  },
}

const options = {}

const tracer = initTracer(config, options)

export default tracer
