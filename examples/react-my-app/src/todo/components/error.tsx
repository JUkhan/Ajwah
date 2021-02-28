import React, { FC } from 'react';
import { TodoStateController } from "../services/todoStateController";
import { StreamBuilder } from 'ajwah-reactive-form';

export interface Props {
    controller: TodoStateController
}
const error: FC<Props> = ({ controller }) =>
    <StreamBuilder
        initialData=""
        stream={controller.error$}
        render={(errorMessage) => <div className="errors">{errorMessage}</div>} />


export default error;