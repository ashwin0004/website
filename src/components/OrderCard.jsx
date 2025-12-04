import React from "react";

const OrderCard = ({ order }) => {
    return (
        <div className="card">
            <a>
                <img src={order.img} alt="" />
            </a>

            {order.offer && <p className="offer">{order.offer}</p>}

            <div className="content">
                <p className="heading">
                    {order.name}
                    <span className="num">
                        {order.rating} <i className="fa-solid fa-star"></i>
                    </span>
                </p>

                <p className="text">
                    {order.items}
                    <span className="rupee">{order.price}</span>
                </p>

                <p className="time">{order.time}</p>
            </div>
        </div>
    );
};

export default OrderCard;
