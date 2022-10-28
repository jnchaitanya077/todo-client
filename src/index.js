import React from 'react';
import ReactDOM from 'react-dom/client';

import AppRouter from './App';

const HOST = "http://localhost:4000";

const container = document.getElementById('root') || document.createElement('div')
const root = ReactDOM.createRoot(container);
root.render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>
);

export default HOST