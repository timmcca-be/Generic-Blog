'use strict';

import { h, Component } from 'preact';
import styles from './Card.css';
import withStyles from 'shared/withStyles';
import Loadbar from './Loadbar/Loadbar';

function Card(props) {
    return (
        <div className={styles.card}>
            {props.title ? <p className={styles.title}>{props.title}</p> : <Loadbar style={{padding: '0.5rem 0', marginBottom: '1.6rem'}} />}
            {props.content ? <p className={styles.content}>{props.content}</p> : <div style={{marginBottom: '0.5rem'}}><Loadbar /><Loadbar /><Loadbar /></div>}
            {props.author ? <p className={styles.author}>{props.author}</p> : <Loadbar style={{marginLeft: '70%'}} />}
        </div>
    );
}

export default withStyles(styles)(Card);
