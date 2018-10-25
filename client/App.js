import React from 'react';
import sdk from 'sdk';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
        sdk.getPostSummaries({charLimit: 60}).then((summaries) => {
            this.setState({
                posts: summaries.rows
            });
        });
    }

    render() {
        return this.state.posts.map((post, i) => {
            return (
                <div key={i}>
                    <h3>{post.title}</h3>
                    <p>{post.content + (post.content.length < post.content_length ? '...' : '')}</p>
                    <small>{post.author}</small>
                </div>
            );
        });
    }
}

export default App;
