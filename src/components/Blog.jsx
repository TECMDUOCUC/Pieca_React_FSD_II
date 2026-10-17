import React from "react";
import { Row } from "react-bootstrap";
import { Link } from "react-router";

export default function Blog({title, date, description, uri}) {
    return (<>
        <div className="text-white black blog">
            <div className="column">
                <h3>{title}</h3>
                <h6 >Publicado el {date}</h6>
                <h5>{description}</h5>
                <Link to={uri} className="text-white h6">Ver más...</Link>
            </div>
        </div>

    </>);
}