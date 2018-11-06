'use strict';

import { h, Component } from 'preact';
import Sdk from 'sdk';
import styles from './App.css';
import inputStyles from 'shared/input.css';
import Card from './Card/Card';
import Sidebar from './Sidebar/Sidebar';
import LoadIcon from './LoadIcon/LoadIcon';
import jwtDecode from 'jwt-decode';
import withStyles from 'shared/withStyles';

const client = new Sdk('/api/v1');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            bigTopBar: true,
            showSide: false,
            allLoaded: false,
            pending: true,
            initialLoadComplete: false
        };
    }
    
    componentDidMount() {
        this.getSummaries();
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        this.handleScroll();
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    
    handleScroll() {
        this.setState({
            bigTopBar: window.pageYOffset < 100
        });
        if(this.state.pending || this.state.allLoaded || window.pageYOffset + window.innerHeight < document.body.clientHeight - 1000) {
            return;
        }
        this.getSummaries();
    }
    
    getSummaries() {
        this.setState({ pending: true })
        client.getPostSummaries({ start: this.state.posts.length, limit: 20 }).then(
            summaries => this.setState({ posts: this.state.posts.concat(summaries.rows), allLoaded: summaries.rows.length < 20, pending: false })
        );
    }
    
    login(username, password) {
        client.login({
            user: {
                username,
                password
            }
        }).then((token) => {
            if(token.error) {
                this.setState({ badCreds: true });
            }
            console.log(jwtDecode(token.token));
        });
    }

    render() {
        return (
            <div className={styles.app}>
                <div className={styles.top + (this.state.bigTopBar ? ' ' + styles.bigTop : '')}>
                    <button
                        className={styles.menuButton + (this.state.showSide ? ' ' + styles.menuButtonPushedOut : '')}
                        onClick={e => this.setState({ showSide: !this.state.showSide, badCreds: false })}>
                        <p className={styles.menuIcon}>&#9776;</p>
                    </button>
                    <p className={styles.title}>Bloog</p>
                    <input className={styles.search + ' ' + inputStyles.text} type="text" placeholder="Search" />
                </div>
                { this.state.showSide &&
                    <Sidebar login={this.login.bind(this)} badCreds={this.state.badCreds} />
                }
                <div className={styles.container}>
                    {
                        this.state.posts.map((post, i) => <Card {...post} key={i} />)
                    }
                    { this.state.pending &&
                        <LoadIcon />
                    }
                </div>
            </div>
        );
    }
}

export default withStyles(styles, inputStyles)(App);
