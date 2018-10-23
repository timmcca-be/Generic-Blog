import React from 'react';
import apiClient from './apiClient';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
        apiClient.then(async (client) => {
            console.log(client.apis.posts);
            const summaries = await client.apis.posts.getPostSummaries({});
            this.setState({
                posts: summaries.body.rows
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
