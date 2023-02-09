import type {LinksFunction, MetaFunction} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type {PropsWithChildren} from 'react'
import tailwindStyles from './styles/tailwind.css'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'prefetch',
      as: 'image',
      type: 'image/svg+xml',
      href: '/assets/sprite.svg',
    },
    {rel: 'stylesheet', href: tailwindStyles},
  ]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

function Document({children}: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}
