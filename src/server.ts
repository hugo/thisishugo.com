import {URL} from 'url'
import * as express from 'express'
import * as morgan from 'morgan'
import * as helmet from 'helmet'
import {createRequestHandler} from '@remix-run/express'

const app = express()

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
      hsts: {
        maxAge: 63072000,
        preload: true,
      },
    })
  )
} else {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", 'http://localhost:8002'],
        scriptSrcElem: [
          "'self'",
          "https: 'unsafe-inline'",
          'http://localhost:8002',
        ],
        imgSrc: ["'self'", 'data:'],
        styleSrc: ["'self'", 'http://localhost:8002'],
        styleSrcElem: ["'self'", 'http://localhost:8002'],
      },
    })
  )
}

app.use(express.static('public'))

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
    getLoadContext() {
      return {}
    },
  })
)

const {PORT: port = 3000} = process.env

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
