import Footer from '../components/Footer';
import Header from '../components/Header';
import Blog from '../components/Blog';
import blogsData from '../data/blogs.json';

export default function Blogs() {
  return (
    <div className="app-container">
      <Header />
      <main className="container py-5 flex-grow-1">
        <h1 className="mb-4">Nuestros posts</h1>
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
      <Footer />
    </div>
  );
}