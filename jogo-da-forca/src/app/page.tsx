'use client'

import React, { useState, useEffect } from 'react';

const JogoRoletaRussa = () => {
  // Lista de frutas (mais de 30)
  const frutas = [
    'ABACAXI', 'BANANA', 'LARANJA', 'MAÇÃ', 'UVA', 'MANGA', 'KIWI',
    'MORANGO', 'PÊSSEGO', 'LIMÃO', 'MELANCIA', 'MELÃO', 'ABACATE',
    'COCO', 'MAMÃO', 'GOIABA', 'MARACUJÁ', 'JABUTICABA', 'CAJU',
    'AÇAÍ', 'PITANGA', 'ROMÃ', 'FIGO', 'AMORA', 'FRAMBOESA',
    'CEREJA', 'AMEIXA', 'PERA', 'CAQUI', 'CARAMBOLA', 'JACA',
    'CUPUAÇU', 'GRAVIOLA', 'TAMARINDO', 'BURITI', 'CAJÁ', 'SAPOTI',
    'BACABA', 'MURICI', 'PEQUI', 'MANGABA', 'ARATICUM'
  ];

  const [palavraAtual, setPalavraAtual] = useState('');
  const [letrasAdivinhadas, setLetrasAdivinhadas] = useState(new Set());
  const [tentativasErradas, setTentativasErradas] = useState(0);
  const [jogoTerminado, setJogoTerminado] = useState(false);
  const [venceu, setVenceu] = useState(false);
  const [balaFatal, setBalaFatal] = useState(6); // Bala que mata é sempre a 6ª
  const maxTentativas = 6;

  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const iniciarNovoJogo = () => {
    const frutaAleatoria = frutas[Math.floor(Math.random() * frutas.length)];
    setPalavraAtual(frutaAleatoria);
    setLetrasAdivinhadas(new Set());
    setTentativasErradas(0);
    setJogoTerminado(false);
    setVenceu(false);
    setBalaFatal(6); // Sempre na 6ª tentativa errada
  };

  useEffect(() => {
    iniciarNovoJogo();
  }, []);

  useEffect(() => {
    if (palavraAtual) {
      const todasLetrasAdivinhadas = palavraAtual.split('').every(letra => letrasAdivinhadas.has(letra));
      if (todasLetrasAdivinhadas) {
        setVenceu(true);
        setJogoTerminado(true);
      } else if (tentativasErradas >= maxTentativas) {
        setJogoTerminado(true);
      }
    }
  }, [letrasAdivinhadas, tentativasErradas, palavraAtual]);

  const tentarLetra = (letra) => {
    if (letrasAdivinhadas.has(letra) || jogoTerminado) return;

    const novasLetrasAdivinhadas = new Set(letrasAdivinhadas);
    novasLetrasAdivinhadas.add(letra);
    setLetrasAdivinhadas(novasLetrasAdivinhadas);

    if (!palavraAtual.includes(letra)) {
      setTentativasErradas(tentativasErradas + 1);
    }
  };

  const renderizarPalavra = () => {
    return palavraAtual.split('').map((letra, index) => (
      <div key={index} className="inline-flex items-center justify-center w-12 h-12 mx-1 border-b-2 border-gray-700">
        <span className="text-2xl font-mono font-bold text-gray-800">
          {letrasAdivinhadas.has(letra) ? letra : ''}
        </span>
      </div>
    ));
  };

  const RoletaRussaSVG = ({ tentativas, morreu }) => {
    // Boneco de fundo
    const renderBoneco = () => (
      <g>
        {/* Cabeça do boneco */}
        <circle 
          cx="200" 
          cy="60" 
          r="15" 
          fill="none" 
          stroke={morreu ? "#dc2626" : "#6b7280"} 
          strokeWidth="2"
        />
        {/* Buraco de bala se morreu */}
        {morreu && (
          <circle cx="205" cy="55" r="2" fill="#dc2626" />
        )}
        {/* X nos olhos se morreu */}
        {morreu && (
          <g stroke="#dc2626" strokeWidth="1">
            <line x1="195" y1="55" x2="200" y2="60" />
            <line x1="200" y1="55" x2="195" y2="60" />
            <line x1="205" y1="55" x2="210" y2="60" />
            <line x1="210" y1="55" x2="205" y2="60" />
          </g>
        )}
        {/* Corpo do boneco */}
        <line x1="200" y1="75" x2="200" y2="130" stroke={morreu ? "#dc2626" : "#6b7280"} strokeWidth="2" />
        {/* Braços */}
        <line x1="200" y1="90" x2="180" y2="110" stroke={morreu ? "#dc2626" : "#6b7280"} strokeWidth="2" />
        <line x1="200" y1="90" x2="220" y2="110" stroke={morreu ? "#dc2626" : "#6b7280"} strokeWidth="2" />
        {/* Pernas */}
        <line x1="200" y1="130" x2="180" y2="160" stroke={morreu ? "#dc2626" : "#6b7280"} strokeWidth="2" />
        <line x1="200" y1="130" x2="220" y2="160" stroke={morreu ? "#dc2626" : "#6b7280"} strokeWidth="2" />
      </g>
    );

    // Tambor do revólver
    const renderTambor = () => {
      const raio = 40;
      const centroX = 100;
      const centroY = 100;
      
      return (
        <g>
          {/* Círculo principal do tambor */}
          <circle 
            cx={centroX} 
            cy={centroY} 
            r={raio} 
            fill="#e5e7eb" 
            stroke="#374151" 
            strokeWidth="3"
          />
          
          {/* 6 câmaras do tambor */}
          {[...Array(6)].map((_, index) => {
            const angulo = (index * 60) - 90; // -90 para começar no topo
            const anguloRad = (angulo * Math.PI) / 180;
            const x = centroX + (raio - 15) * Math.cos(anguloRad);
            const y = centroY + (raio - 15) * Math.sin(anguloRad);
            
            const jaFoiUsada = index < tentativas;
            const eBalaFatal = index === balaFatal - 1 && jaFoiUsada;
            
            return (
              <g key={index}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r="6" 
                  fill={jaFoiUsada ? (eBalaFatal ? "#dc2626" : "#9ca3af") : "#f3f4f6"}
                  stroke="#374151" 
                  strokeWidth="1"
                />
                {/* Bala fatal */}
                {eBalaFatal && (
                  <circle cx={x} cy={y} r="3" fill="#991b1b" />
                )}
                {/* Balas vazias */}
                {jaFoiUsada && !eBalaFatal && (
                  <circle cx={x} cy={y} r="2" fill="#6b7280" />
                )}
              </g>
            );
          })}
          
          {/* Centro do tambor */}
          <circle 
            cx={centroX} 
            cy={centroY} 
            r="8" 
            fill="#9ca3af" 
            stroke="#374151" 
            strokeWidth="2"
          />
        </g>
      );
    };

    return (
      <div className="flex justify-center">
        <svg width="300" height="200" className="border border-gray-300 bg-gray-50">
          {renderTambor()}
          {renderBoneco()}
          
          {/* Texto indicativo */}
          <text x="100" y="180" textAnchor="middle" className="text-xs fill-gray-600">
            Tambor: {tentativas}/6
          </text>
        </svg>
      </div>
    );
  };

  const letrasCorretas = Array.from(letrasAdivinhadas).filter(letra => palavraAtual.includes(letra));
  const letrasErradas = Array.from(letrasAdivinhadas).filter(letra => !palavraAtual.includes(letra));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Jogo da Forca diferenciado</h1>
          <p className="text-gray-600">Adivinhe ou morra Hahahahahaa.</p>
        </header>

        {/* Layout principal */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Coluna esquerda - Roleta e estatísticas */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8 border">
              <RoletaRussaSVG tentativas={tentativasErradas} morreu={!venceu && jogoTerminado} />
              
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <span className="text-sm text-gray-500">Tentativas até ser morto</span>
                  <div className="text-2xl font-bold text-gray-800">{maxTentativas - tentativasErradas}</div>
                </div>
                
                <div className="border-t pt-4">
                  {letrasCorretas.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Corretas</span>
                      <div className="text-sm font-mono text-gray-700">{letrasCorretas.join(' ')}</div>
                    </div>
                  )}
                  
                  {letrasErradas.length > 0 && (
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Erradas (disparos)</span>
                      <div className="text-sm font-mono text-gray-700">{letrasErradas.join(' ')}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna direita - Palavra e controles */}
          <div className="space-y-8">
            
            {/* Palavra */}
            <div className="bg-white rounded-lg shadow-sm p-8 border">
              <div className="text-center">
                <div className="flex flex-wrap justify-center mb-8">
                  {renderizarPalavra()}
                </div>

                {/* Estado do jogo */}
                {jogoTerminado && (
                  <div className="mb-6">
                    {venceu ? (
                      <div className="text-center">
                        <h2 className="text-xl font-bold text-green-700 mb-2">Sobreviveu!</h2>
                        <p className="text-gray-600">Você descobriu: <strong>{palavraAtual}</strong></p>
                        <p className="text-sm text-gray-500 mt-1">A bala estava na {balaFatal}ª câmara</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h2 className="text-xl font-bold text-red-700 mb-2">BANG! Você morreu</h2>
                        <p className="text-gray-600">A fruta era: <strong>{palavraAtual}</strong></p>
                        <p className="text-sm text-gray-500 mt-1">A bala fatal estava na {balaFatal}ª câmara</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={iniciarNovoJogo}
                  className="px-6 py-2 bg-gray-800 text-white font-medium rounded hover:bg-gray-700 transition-colors"
                >
                  Nova Partida
                </button>
              </div>
            </div>

            {/* Teclado */}
            <div className="bg-white rounded-lg shadow-sm p-8 border">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-4 text-center">Teclado</h3>
              
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-9 gap-2">
                {alfabeto.map(letra => {
                  const foiTentada = letrasAdivinhadas.has(letra);
                  const estaCorreta = foiTentada && palavraAtual.includes(letra);
                  const estaErrada = foiTentada && !palavraAtual.includes(letra);

                  return (
                    <button
                      key={letra}
                      onClick={() => tentarLetra(letra)}
                      disabled={foiTentada || jogoTerminado}
                      className={`
                        h-10 w-10 rounded font-mono font-medium text-sm transition-all
                        ${estaCorreta 
                          ? 'bg-green-600 text-white' 
                          : estaErrada 
                          ? 'bg-red-600 text-white' 
                          : foiTentada 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }
                        ${jogoTerminado && !foiTentada ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {letra}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12">
          <p className="text-sm text-gray-500">Cada letra errada é um disparo... A 6ª é fatal</p>
        </footer>
      </div>
    </div>
  );
};

export default JogoRoletaRussa;