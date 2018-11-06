'use strict';

import { h, Component } from 'preact';
import styles from './LoadIcon.css';
import withStyles from 'shared/withStyles';


function LoadIcon(props) {
    return (
        <svg className={styles.bar} height="100" width="200">
            <circle className={styles.ball} cx="50" cy="40" r="15" fill="#333c" />
            <circle className={styles.ball} style={{ animationDelay: '0.3s'}} cx="100" cy="40" r="15" fill="#333c" />
            <circle className={styles.ball} style={{ animationDelay: '0.6s'}} cx="150" cy="40" r="15" fill="#333c" />
        </svg> 
    );
}

export default withStyles(styles)(LoadIcon);
