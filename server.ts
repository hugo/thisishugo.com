import {URL} from 'url'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import {createRequestHandler} from '@remix-run/express'

const app = express()

app.disable('x-powered-by')

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          scriptSrc: ["'self'", "https: 'unsafe-inline'"],
          scriptSrcElem: ["'self'", "https: 'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          styleSrc: ["'self'"],
          styleSrcElem: ["'self'"],
        },
      },
      hsts: false,
    })
  )
} else {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'http://localhost:3000'],
        scriptSrcElem: [
          "'self'",
          "https: 'unsafe-inline'",
          'http://localhost:3000',
        ],
        imgSrc: ["'self'", 'data:'],
        styleSrc: ["'self'", 'http://localhost:3000'],
        styleSrcElem: ["'self'", 'http://localhost:3000'],
      },
    })
  )
}

app.use(express.static('public'))

const hstsMiddleware = helmet.hsts({
  maxAge: 63072000,
  preload: true,
})

app.use((req, res, next) => {
  if (req.get('X-Forwarded-Proto') == 'https') {
    hstsMiddleware(req, res, next)
  } else {
    next()
  }
})

app.get('*', (req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-ssl'] != 'on'
  ) {
    return res.redirect(
      301,
      new URL(req.originalUrl, 'https://thisishugo.com').toString()
    )
  }

  next()
})

app.get('*', (req, res, next) => {
  if (req.hostname === 'www.thisishugo.com') {
    return res.redirect(
      new URL(req.originalUrl, 'https://thisishugo.com').toString(),
      301
    )
  }

  next()
})

app.get(
  '*',
  createRequestHandler({
    build: require('./build'),
  })
)

const {PORT: port = 3000} = process.env

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
