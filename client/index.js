import { h, render } from 'preact';
import App from './App';

if(module.hot) {
    import('preact/devtools');
}

render(<App />, document.getElementById('root'));
