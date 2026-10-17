import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Blog from "../components/Blog";
import blogsData from "../data/blogs.json";

export default function Blogs() {
    return (
        <>
        <Header/>
        <main className="flex-grow-1 container py-5 d-flex flex-column align-items-center gap-4">
            <h1 className="text-black"><b>Nuestros posts</b></h1>
            {blogsData.map((item) => (
            <Blog
                key={item.id}
                title={item.title}
                date={item.date}
                description={item.description}
                uri={item.uri}
            />
            ))}
        </main>
        <Footer/>
        </>
    );
}