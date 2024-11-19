import React, { useState, useEffect } from 'react';
import { Copy, Check, AlertCircle, Search } from 'lucide-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const SAMPLE_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'richquack', name: 'RichQuack', symbol: 'QUACK' }
];

export default function ConfigInterface() {
  const [coins] = useState(SAMPLE_COINS);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [theme, setTheme] = useState<'light' | 'dark' | 'custom'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [accentColor, setAccentColor] = useState('#4F46E5');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isResponsive, setIsResponsive] = useState(false);
  const [embedWidth, setEmbedWidth] = useState(480);
  const [embedHeight, setEmbedHeight] = useState(700);
  const [embedPadding, setEmbedPadding] = useState(16);

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const iframeCode = `<iframe
  width="${embedWidth}"
  height="${embedHeight}"
  frameborder="0"
  src="${window.location.origin}/widget/${selectedCoin}?theme=${theme}&accent=${encodeURIComponent(accentColor)}&background=${encodeURIComponent(backgroundColor)}&padding=${embedPadding}&responsive=${isResponsive}"
></iframe>`;

  const previewStyle = {
    width: isResponsive ? '100%' : `${embedWidth}px`,
    height: `${embedHeight}px`,
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Coin</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, symbol, or API ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
              />
            </div>
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              size={5}
            >
              {filteredCoins.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol.toUpperCase()}) - {coin.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Theme</h2>
            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-lg">
              <button
                className={`p-2 rounded ${theme === 'light' ? 'bg-white shadow' : ''}`}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
              <button
                className={`p-2 rounded ${theme === 'dark' ? 'bg-white shadow' : ''}`}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
              <button
                className={`p-2 rounded ${theme === 'custom' ? 'bg-white shadow' : ''}`}
                onClick={() => setTheme('custom')}
              >
                Custom
              </button>
            </div>
          </div>

          {theme === 'custom' && (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-4">Accent Color</h2>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Background Color</h2>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            </>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Responsive Width</h2>
              <button
                onClick={() => setIsResponsive(!isResponsive)}
                className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ${
                  isResponsive ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                    isResponsive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Embed Width</h2>
            <input
              type="range"
              min="300"
              max="800"
              value={embedWidth}
              onChange={(e) => setEmbedWidth(Number(e.target.value))}
              className="w-full"
              disabled={isResponsive}
            />
            <div className="text-right">{embedWidth}px</div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Embed Height</h2>
            <input
              type="range"
              min="200"
              max="1000"
              value={embedHeight}
              onChange={(e) => setEmbedHeight(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-right">{embedHeight}px</div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Embed Padding</h2>
            <input
              type="range"
              min="0"
              max="32"
              value={embedPadding}
              onChange={(e) => setEmbedPadding(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-right">{embedPadding}px</div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Embed Code</h2>
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {iframeCode}
              </pre>
              <CopyToClipboard text={iframeCode} onCopy={handleCopy}>
                <button className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  {copied ? (
                    <>
                      <Check className="mr-2" size={20} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2" size={20} />
                      Copy Embed Code
                    </>
                  )}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div style={{ width: isResponsive ? '100%' : `${embedWidth}px`, margin: '0 auto' }}>
              <iframe
                src={`/widget/${selectedCoin}?theme=${theme}&accent=${encodeURIComponent(accentColor)}&background=${encodeURIComponent(backgroundColor)}&padding=${embedPadding}&responsive=${isResponsive}`}
                style={previewStyle}
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}