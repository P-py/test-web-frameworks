import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import TodoList from './pages/TodoList/TodoList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<TodoList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;