import { h, Component } from 'preact';
import Sdk from 'sdk';
import styles from './Card.css';

function Card(props) {
    return (
        <div className={styles.card}>
            <h3>{props.title}</h3>
            <p>{props.content + (props.content.length < props.content_length ? '...' : '')}</p>
            <small>{props.author}</small>
        </div>
    );
}

export default Card;
