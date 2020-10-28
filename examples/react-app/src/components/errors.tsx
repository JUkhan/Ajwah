import React from 'react';
import { useStream } from '../states/useStream';
import { error$ } from '../services/todoService';

export default () => {
    const err = useStream(error$, '');
    return <div className="errors">{err}</div>
}