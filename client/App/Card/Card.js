'use strict';

import { h, Component } from 'preact';
import styles from './Card.css';
import withStyles from 'shared/withStyles';

function Card(props) {
    return (
        <div className={styles.card}>
            <p className={styles.title}>{props.title}</p>
            <p className={styles.content}>{props.content}</p>
            <p className={styles.author}>{props.author}</p>
        </div>
    );
}

export default withStyles(styles)(Card);
