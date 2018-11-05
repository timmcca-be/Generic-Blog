'use strict';

import { h, Component } from 'preact';
import styles from './Loadbar.css';
import withStyles from 'shared/withStyles';

function Loadbar(props) {
    return (
        <div className={styles.bar} style={props.style}>
            <div className={styles.blur} style={props.blurStyle}></div>
        </div>
    );
}

export default withStyles(styles)(Loadbar);
