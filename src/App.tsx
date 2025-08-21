import { useEffect } from 'react';
import { useStore } from './store';
import OrderPage from './components/OrderPage';
import './App.css';

function App() {
  const { theme } = useStore();

  useEffect(() => {
    // Apply the current theme to the document
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'light' ? '' : theme
    );
  }, [theme]);

  return <OrderPage />;
}

export default App;
