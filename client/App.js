import React from 'react';
import Sdk from '../sdk.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
        new Sdk('/api/v1').getPostSummaries().then((summaries) => {
            this.setState({
                posts: summaries.rows
            });
        });
    }

    render() {
        return (
            <p>{JSON.stringify(this.state.posts)}</p>
        );
    }
}

export default App;
