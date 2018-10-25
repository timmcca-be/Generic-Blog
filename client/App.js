import { h, Component } from 'preact';
import Sdk from 'sdk';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
        new Sdk('/api/v1').getPostSummaries({charLimit: 60}).then((summaries) => {
            this.setState({
                posts: summaries.rows
            });
        });
    }

    render() {
        return (
            <div>{
                this.state.posts.map((post, i) => {
                    return (
                        <div key={i}>
                            <h3>{post.title}</h3>
                            <p>{post.content + (post.content.length < post.content_length ? '...' : '')}</p>
                            <small>{post.author}</small>
                        </div>
                    );
                })
            }</div>
        )
    }
}

export default App;
