import express from 'express'
import { createTerminus } from '@godaddy/terminus'

import tracer, { Tags, FORMAT_HTTP_HEADERS } from './infrastructure/tracer.js'
import { externalAPI } from './infrastructure/externalAPI.js'
import { APP_PORT } from './infrastructure/config.js'

const app = express()

// middleware - catchs all requests
app.use((req, res, next) => {
  const name = `${req.method}:${req.path}`

  console.log('headers', req.headers)

  // start new span
  const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers)
  const span = tracer.startSpan(name, {
    childOf: parentSpanContext,
  })

  console.log('REQUEST START', name, Date.now())
  span.log({ START: Date.now(), 'my-baggage': span.getBaggageItem('baggage') })

  // forward span to request handler
  req.span = span

  // finish request
  res.on('finish', function () {
    span.setTag(Tags.HTTP_STATUS_CODE, res.statusCode)

    if (res.statusCode >= 400) {
      span.setTag(Tags.ERROR, true)
    }

    console.log('REQUEST END', name, Date.now())
    span.log({ END: Date.now() })

    // close span!
    span.finish()
  })

  next()
})

app.get('/success', function (req, res) {
  req.span.setTag('expected-status', 'success')
  res.status(200).send(`Success: ${Date.now()}`)
})

app.get('/error', function (req, res) {
  req.span.setTag('expected-status', 'error')
  res.status(500).send(`Error: ${Date.now()}`)
})

app.get('/success_success', async function (req, res) {
  req.span.setTag('expected-status', 'success_success')

  // pass tracking headers to API endpoint
  const headers = {}
  tracer.inject(req.span, FORMAT_HTTP_HEADERS, headers)

  const externalBody = await externalAPI('/success', {
    headers,
  })

  res.status(200).send(`Success: ${Date.now()} / ${externalBody}`)
})

app.get('/success_error', async function (req, res) {
  req.span.setTag('expected-status', 'success_error')

   // pass tracking headers to API endpoint
   const headers = {}
  tracer.inject(req.span, FORMAT_HTTP_HEADERS, headers)

  const externalBody = await externalAPI('/error', {
    headers,
  })

  res.status(200).send(`Success: ${Date.now()} / ${externalBody}`)
})

app.get('/success_success_success', async function (req, res) {
  req.span.setTag('expected-status', 'success_success_success')
  req.span.setBaggageItem('baggage', Date.now())
  req.span.setBaggageItem('baggage2', Date.now())

  // pass tracking headers to API endpoint
  const headers = {}
  tracer.inject(req.span, FORMAT_HTTP_HEADERS, headers)

  const externalBody = await externalAPI('/success_success', {
    headers,
  })

  res.status(200).send(`Success: ${Date.now()} / ${externalBody}`)
})

// create server
const server = app.listen(APP_PORT, function () {
  const host = server.address().address
  const port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

// graceful shutdown
function beforeShutdown() {
  // flush all data!
  tracer.close(() => console.log('> Flush the spans to Jaeger backend.'))

  // https://github.com/godaddy/terminus#how-to-set-terminus-up-with-kubernetes
  return new Promise(resolve => {
    setTimeout(resolve, 2000)
  })
}

function onSignal() {
  console.log('> Server is starting cleanup.')
  return Promise.resolve()
}

function onShutdown() {
  console.log('> Cleanup finished, server is shutting down.')
  return Promise.resolve()
}

createTerminus(server, {
  signals: ['SIGINT', 'SIGTERM', 'SIGQUIT'],
  beforeShutdown,
  onSignal,
  onShutdown,
  timeout: 2000,
})
