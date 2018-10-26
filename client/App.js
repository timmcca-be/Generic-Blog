import { h, Component } from 'preact';
import Sdk from 'sdk';
import styles from './App.css';
import Card from './Card.js';

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
            <div className={styles.container}>
                {
                    this.state.posts.map((post, i) => <Card {...post} key={i} />)
                }
            </div>
        )
    }
}

export default App;
