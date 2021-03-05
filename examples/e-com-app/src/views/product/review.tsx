
import React, { useRef, useState, FC } from 'react';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import { get, post } from '../../api';
import { usePullData } from '../hooks';
import { dispatch } from 'ajwah-reactive-form';
import { actionType as at } from '../../models';
import { RxForm, Field, Submit } from 'ajwah-reactive-form';

interface Props {
    productId: number
}
interface Review {
    rating: number,
    review: string
}
export const Review: FC<Props> = ({ productId }) => {

    const rxForm = useRef({} as RxForm);
    const [reviews, addReview] = usePullData<Review[]>(`products/${productId}/reviews`, []);

    function sendReview(data: any) {
        post(`products/${productId}/reviews`, data).subscribe(res => {
            rxForm.current.setState({ review: '', rating: 0 })
            addReview(reviews => ([data, ...reviews]))
        },
            err => dispatch(at.InfoMessage, 'You are not authorized to leave a review.')
        );

    }

    return (
        <React.Fragment>
            <div className="p-text-center p-mt-2">
                <h3>Leave a review</h3>
                <RxForm ref={rxForm}
                    initialValues={{ rating: 0 }}
                    onSubmit={sendReview}
                    render={({ handleSubmit, observer }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="p-fluid">
                                <Field name="review" observer={observer} render={({ value, setValue }) => (
                                    <div className="p-field">
                                        <InputTextarea value={value} onChange={(e: any) => setValue(e.target.value)} rows={5} />
                                    </div>
                                )} />
                                <Field name="rating" observer={observer} render={({ value, setValue }) => (
                                    <div className="p-field">
                                        <Rating cancel={false} value={value} onChange={e => setValue(+e.value)} />
                                    </div>
                                )} />


                            </div>
                            <div className="p-text-center">

                                <Submit observer={observer}
                                    render={(valid, data) =>
                                        <Button
                                            disabled={!(data.rating > 0 || data.review?.length > 0)} type="submit">Leave review</Button>}
                                />
                            </div>
                        </form>
                    )}

                />

                <Divider />
                <div className="reviews">

                    {reviews.map((item, index) => <div className="p-mt-4" key={index}>
                        <div className="p-mb-2">{item.review}</div>
                        <Rating readOnly cancel={false} value={item.rating} />
                    </div>)}
                </div>
            </div>
        </React.Fragment>
    )
}