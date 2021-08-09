import React from "react";
import { ColorModeScript } from "@chakra-ui/react"
import Document, { Html, Head, Main, NextScript } from 'next/document'
import theme from "../styles/theme";

class MyDocument extends Document {

    render() {

        return (
            <Html lang="en">
                <Head>
                    <meta name='application-name' content='The Convo Space' />
                    <meta name='apple-mobile-web-app-capable' content='yes' />
                    <meta name='apple-mobile-web-app-status-bar-style' content='default' />
                    <meta name='apple-mobile-web-app-title' content='The Convo Space' />
                    <meta name='description' content='Bridge Web2 Social accounts to Web3.' />
                    <meta name='format-detection' content='telephone=no' />
                    <meta name='mobile-web-app-capable' content='yes' />
                    <meta name='theme-color' content="#000" />
                    <link rel='icon' type='image/svg' sizes='512x512' href='/icons/icon.svg' />
                    <link rel='shortcut icon' href='/icons/icon.svg' />
                    <link rel='apple-touch-icon' sizes='180x180' href='/icons/icon.svg' />
                    <link rel='manifest' href='/manifest.json' />
                    <link rel='mask-icon' href='/icons/icon.svg' color='#5bbad5' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:url' content='https://bridge.theconvo.space' />
                    <meta name='twitter:title' content='The Convo Space' />
                    <meta name='twitter:description' content='Bridge Web2 Social accounts to Web3.' />
                    <meta name='twitter:creator' content='@anuditnagar' />
                    <meta property='og:type' content='website' />
                    <meta property='og:title' content='The Convo Space' />
                    <meta property='og:description' content='Bridge Web2 Social accounts to Web3.' />
                    <meta property='og:site_name' content='The Convo Space' />
                    <meta property='og:url' content='https://bridge.theconvo.space' />
                    <script type='application/ld+json' dangerouslySetInnerHTML={ { __html: `{"@context": "http://www.schema.org","@type": "Corporation","name": "The Convo Space","url": "https://bridge.theconvo.space","logo": "https://bridge.theconvo.space/images/logo.png","image": "https://bridge.theconvo.space/images/poster.webp","description": "Bridge Web2 Social accounts to Web3."}`}} />
                    <script type='application/ld+json' dangerouslySetInnerHTML={ { __html: `{"@context": "https://schema.org","@type": "Organization","url": "https://bridge.theconvo.space","logo": "https://bridge.theconvo.space/images/logo.png"}`}} />
                </Head>
                <body>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
