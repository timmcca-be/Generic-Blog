/* Code from https://github.com/kriasoft/isomorphic-style-loader, modified by Tim McCabe

Original license:

Isomorphic CSS style loader for Webpack

Copyright © 2015-present Kriasoft, LLC. All rights reserved.

The MIT License

Copyright © 2015-present Kriasoft, LLC. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

const contextTypes = {
    insertCss: PropTypes.func,
};

function withStyles(...styles) {
    return function wrapWithStyles(ComposedComponent) {
        class WithStyles extends Component {
            componentWillMount() {
                this.removeCss = this.context.insertCss(...styles);
            }
            
            componentWillUnmount() {
                if (this.removeCss) {
                    setTimeout(this.removeCss, 0);
                }
            }
            
            render() {
                return <ComposedComponent {...this.props} />;
            }
        }
        
        const displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component';
        
        WithStyles.displayName = `WithStyles(${displayName})`;
        WithStyles.contextTypes = contextTypes;
        WithStyles.ComposedComponent = ComposedComponent;
        
        return hoistStatics(WithStyles, ComposedComponent);
    };
}

export default withStyles;
