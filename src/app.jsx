/**
 * Include CSS
 * -----------
 * We do this here so that we can hot-reload it later with webpack-dev-server, and for simplicity in development.
 * In production, however, this needs to be included from the HTML file as a separate css file.
 */
import styles from './styles'; // eslint-disable-line no-unused-vars

// JavaScript dependencies
import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';

render((
    <div className="container">
        <h1>Hello World</h1>
        <p>This is a test to see if this works!?!</p>
        <img src="/images/hero.jpg" width="250" />
    </div>
), document.getElementById('react-wrapper'))
