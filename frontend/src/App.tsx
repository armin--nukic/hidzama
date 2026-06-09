import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Booking } from './pages/Booking';
import { Blog, BlogDetail } from './pages/Blog';
import { Faq } from './pages/Faq';
import { Contact } from './pages/Contact';
import { Login } from './pages/admin/Login';
import { Appointments, ContactsAdmin, Dashboard, PostsAdmin, Protected, ServicesAdmin, TestimonialsAdmin, UsersAdmin } from './pages/admin/AdminPages';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="booking" element={<Booking />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="posts" element={<PostsAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="contacts" element={<ContactsAdmin />} />
        <Route path="users" element={<UsersAdmin />} />
      </Route>
    </Routes>
  );
}
