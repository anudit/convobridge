import React from "react";
import { createIcon } from '@chakra-ui/icons';

export const ConvoIcon = createIcon({
    displayName: 'ConvoIcon',
    viewBox: '0 0 1000 1000',
    path: (
        <g>
            <path fill="currentColor" d="M455 500l235 226a326 326 0 11-8-461L455 500z"/>
            <circle fill="currentColor" cx="750" cy="500" r="140"/>
        </g>
    )
});


export const SlackIcon = createIcon({
    displayName: 'SlackIcon',
    viewBox: '0 0 270 270',
    path: (
        <g>
            <path fill="#e01e5a" d="M99 151a13 13 0 01-25 0c0-7 5-13 12-13h13v13zM106 151a13 13 0 0126 0v32a13 13 0 01-26 1v-33z"/>
            <path fill="#36c5f0" d="M119 99a13 13 0 010-25c7 0 13 5 13 12v13h-13zM119 106a13 13 0 010 26H87a13 13 0 010-26h32z"/>
            <path fill="#2eb67d" d="M171 119a13 13 0 0125 0c0 7-5 13-12 13h-13v-13zM164 119a13 13 0 01-26 0V87a13 13 0 0126 0v32z"/>
            <path fill="#ecb22e" d="M151 171a13 13 0 010 25c-7 0-13-5-13-12v-13h13zM151 164a13 13 0 010-26h32a13 13 0 011 26h-33z"/>
        </g>
    )
});

export const DiscordIcon = createIcon({
    displayName: 'DiscordIcon',
    viewBox: '0 0 24 24',
    path: (
        <path fill="currentColor" d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z"/>
    )
});

export const VerifiedIcon = createIcon({
    displayName: 'VerifiedIcon',
    viewBox: '0 0 24 24',
    path: (
        <path fill="currentColor" d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.347-2.026.032-2.642-.776-.44-.576-1.124-.915-1.85-.915-.725 0-1.409.339-1.849.915-.613.809-1.683 1.124-2.639.777-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.061 1.77-.082 1.014-.812 1.857-1.803 2.081-.708.16-1.3.642-1.601 1.302s-.277 1.422.065 2.061c.479.897.32 2.001-.392 2.727-.509.517-.747 1.242-.644 1.96s.536 1.347 1.17 1.7c.888.495 1.352 1.51 1.144 2.505-.147.71.044 1.448.519 1.996.476.549 1.18.844 1.902.798 1.016-.063 1.953.54 2.317 1.489.259.678.82 1.195 1.517 1.399.695.204 1.447.072 2.031-.357.819-.603 1.936-.603 2.754 0 .584.43 1.336.562 2.031.357.697-.204 1.258-.722 1.518-1.399.363-.949 1.301-1.553 2.316-1.489.724.046 1.427-.249 1.902-.798.475-.548.667-1.286.519-1.996-.207-.995.256-2.01 1.145-2.505.633-.354 1.065-.982 1.169-1.7s-.135-1.443-.643-1.96zm-12.584 5.43l-4.5-4.364 1.857-1.857 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.642z"/>
    )
});


export const WalletIcon = createIcon({
    displayName: 'WalletIcon',
    viewBox: '0 0 509.381 509.381',
    path: (
        <path fill="currentColor" d="m462.793 127.236h-6.338v-61.55c0-25.688-20.899-46.588-46.588-46.588h-337.904c-37.288 0-68.032 28.521-71.581 64.892-.542 2.57-.349-20.33-.349 334.363 0 39.662 32.267 71.929 71.929 71.929h390.83c25.689 0 46.588-20.899 46.588-46.588v-269.87c.001-25.688-20.898-46.588-46.587-46.588zm-390.83-76.137h337.904c8.044 0 14.588 6.544 14.588 14.588v61.55h-352.492c-21.393 0-38.906-16.913-39.882-38.069.975-21.157 18.488-38.069 39.882-38.069zm390.83 407.183h-390.83c-22.017 0-39.929-17.912-39.929-39.929v-271.243c11.431 7.657 25.167 12.126 39.929 12.126h390.83c8.044 0 14.588 6.544 14.588 14.588v64.866h-120.408c-41.007 0-74.369 33.361-74.369 74.368s33.362 74.368 74.369 74.368h120.408v56.268c0 8.044-6.544 14.588-14.588 14.588zm14.588-102.855h-120.408c-23.362 0-42.369-19.006-42.369-42.368s19.006-42.368 42.369-42.368h120.408z"/>
    )
});

export const DisconnectIcon = createIcon({
    displayName: 'DisconnectIcon',
    viewBox: '0 0 24 24',
    path: (
        <path fill="currentColor" d="M7.092 5.099l1.439-.205-.439-3.083-1.44.204.44 3.084zm-2.211 3.445l.205-1.44-3.084-.44-.205 1.441 3.084.439zm-.494-5.163l-1.03 1.03 2.203 2.204 1.029-1.03-2.202-2.204zm12.541 15.565l-1.439.205.438 3.083 1.441-.204-.44-3.084zm2.21-3.446l-.206 1.441 3.085.439.205-1.44-3.084-.44zm.495 5.163l1.028-1.029-2.204-2.204-1.027 1.03 2.203 2.203zm2.64-18.904c2.344 2.346 2.344 6.149.001 8.494l-3.896 3.896-1.417-1.417 3.895-3.895c1.562-1.562 1.562-4.101 0-5.662-1.562-1.562-4.101-1.562-5.662 0l-3.894 3.895-1.416-1.416 3.895-3.895c2.344-2.345 6.147-2.345 8.494 0zm-8.138 16.631l-3.852 3.851c-2.344 2.347-6.146 2.345-8.494.001-2.344-2.346-2.345-6.149 0-8.494l3.854-3.851 1.414 1.415-3.851 3.851c-1.562 1.562-1.562 4.102-.001 5.663 1.563 1.561 4.102 1.561 5.664-.001l3.85-3.851 1.416 1.416z"/>
    )
});

export const ZoomIcon = createIcon({
    displayName: 'ZoomIcon',
    viewBox: '0 0 1329.1 1329.1',
    path: (
        <g>
            <path d="M664.5 0a664.5 664.5 0 110 1329 664.5 664.5 0 010-1329z" fill="#e5e5e4" fillRule="nonzero"/>
            <path fill="#fff" d="M664.5 13a651.6 651.6 0 110 1303.1 651.6 651.6 0 010-1303.2z"/>
            <path d="M664.5 65.2a599.3 599.3 0 110 1198.7 599.3 599.3 0 010-1198.7z" fill="#4a8cff" fillRule="nonzero"/>
            <path fill="#fff" d="M273.5 476.8v281.6c.3 63.7 52.3 115 115.7 114.7h410.6a21 21 0 0021-20.8V570.7c-.2-63.7-52.2-115-115.7-114.7H294.6a21 21 0 00-21 20.8zM847 586.6l169.5-123.8c14.7-12.2 26.1-9.1 26.1 13v377.5c0 25.1-14 22.1-26.1 13L847 742.7v-156z"/>
        </g>
    )
});

export const SpotifyIcon = createIcon({
    displayName: 'SpotifyIcon',
    viewBox: '0 0 24 24',
    path: (
        <path fill="currentColor" d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z"/>
    )
});

export const TwitchIcon = createIcon({
    displayName: 'TwitchIcon',
    viewBox: '0 0 24 24',
    path: (
        <path fill="currentColor" d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.343v6.262h-2.149v-6.262h2.149zm-5.731 0v6.262h-2.149v-6.262h2.149z"/>
    )
});
