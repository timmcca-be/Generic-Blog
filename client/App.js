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
        new Sdk('/api/v1').getPostSummaries({}).then(summaries => this.setState({ posts: summaries.rows }));
    }

    render() {
        return (
            <div>
                <div className={styles.top}>
                    <p className={styles.title}>Bloog</p>
                    <input className={styles.search} type="text" placeholder="Search" />
                </div>
                <div className={styles.container}>
                    {
                        this.state.posts.map((post, i) => <Card {...post} key={i} />)
                    }
                </div>
            </div>
        )
    }
}

export default App;
