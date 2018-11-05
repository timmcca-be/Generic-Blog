import { h, Component } from 'preact';
import App from './App/App';

class ContextWrapper extends Component {
    getChildContext() {
        return this.props.context;
    }
    
    render () {
        return <App {...this.props}/>;
    }
}

export default ContextWrapper;
