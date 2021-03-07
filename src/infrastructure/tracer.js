import { initTracer } from 'jaeger-client'
export { Tags, FORMAT_HTTP_HEADERS } from 'opentracing'

const APP_PORT = Number(process.env.PORT)

const config = {
  serviceName: `tutorial-opentracing-${APP_PORT}`,
  sampler: {
    type: 'const',
    param: 1,
  },
}

const options = {}

const tracer = initTracer(config, options)

export default tracer
