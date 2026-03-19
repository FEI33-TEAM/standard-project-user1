import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Header       from './components/Header';
import Footer       from './components/Footer';
import HomePage     from './pages/HomePage';
import CustomsDutyPage from './pages/CustomsDutyPage';
import ExciseTaxPage   from './pages/ExciseTaxPage';
import TotalCostPage   from './pages/TotalCostPage';
import AboutPage    from './pages/AboutPage';
import FaqPage      from './pages/FaqPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/customs-duty" element={<CustomsDutyPage />} />
        <Route path="/excise-tax"   element={<ExciseTaxPage />} />
        <Route path="/total-cost"   element={<TotalCostPage />} />
        <Route path="/about"        element={<AboutPage />} />
        <Route path="/faq"          element={<FaqPage />} />
        <Route path="*"             element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
