'use strict';

import { h, render } from 'preact';
import ContextWrapper from './ContextWrapper';

if(module.hot) {
    import('preact/devtools');
    import('source-map-support').then((sourceMapSupport) => sourceMapSupport.install());
}

const context = {
    insertCss: (...styles) => {
        const removeCss = styles.map(x => x._insertCss());
        return () => {
            removeCss.forEach(f => f());
        };
    }
};

render(<ContextWrapper context={context} />, document.getElementById('root'), document.getElementById('root').lastChild);

const node = document.getElementById('ssrStyles');
if(node) {
    node.parentElement.removeChild(node);
}
