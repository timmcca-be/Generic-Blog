'use strict';

import { h, Component } from 'preact';
import styles from './Sidebar.css';
import inputStyles from 'shared/input.css';
import withStyles from 'shared/withStyles';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }
    
    render() {
        return (
            <form action="#" onSubmit={() => this.props.login(this.state.username, this.state.password)} className={styles.sidebar}>
                <label className={styles.label}>Username:</label>
                <input type="text" className={inputStyles.text + ' ' + styles.field} placeholder="Username"
                    onChange={(e) => this.setState({ username: e.target.value })} />
                    
                <label className={styles.label}>Password:</label>
                <input type="password" className={inputStyles.text + ' ' + styles.field} placeholder="Password"
                    onChange={(e) => this.setState({ password: e.target.value })} />
                    
                { this.props.badCreds &&
                    <label className={styles.label} style={{ color: 'red', marginBottom: 0 }}>Invalid username or password</label>
                }
                
                <button type="submit" className={inputStyles.button}>Log in</button>
            </form>
        );
    }
}

export default withStyles(styles)(Sidebar);
