import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConfigInterface from './components/ConfigInterface';
import Widget from './components/Widget';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConfigInterface />} />
        <Route
          path="/widget/:coinId"
          element={
            <Widget
              coinId={window.location.pathname.split('/')[2]}
              theme={new URLSearchParams(window.location.search).get('theme') as 'light' | 'dark' | 'custom' || 'light'}
              accentColor={decodeURIComponent(new URLSearchParams(window.location.search).get('accent') || '#4F46E5')}
              backgroundColor={decodeURIComponent(new URLSearchParams(window.location.search).get('background') || '#FFFFFF')}
              padding={Number(new URLSearchParams(window.location.search).get('padding')) || 16}
              responsive={new URLSearchParams(window.location.search).get('responsive') === 'true'}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;