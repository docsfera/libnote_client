import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'
import "typeface-roboto"
import {BrowserRouter} from "react-router-dom"
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from "@apollo/client"

import './fonts/RFDewiExtended/RFDewiExtended-Bold.woff2';

const client = new ApolloClient({
    uri: 'https://linote-server-2.onrender.com/graphql',
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>,
  document.getElementById('root')
);

