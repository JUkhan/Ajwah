import React, { PureComponent } from 'react';

import Page1Container from './page1Container';

class Page1 extends PureComponent {

    render(props) {
        console.log('page1');
        return <Page1Container />

    }
}

export default Page1;
