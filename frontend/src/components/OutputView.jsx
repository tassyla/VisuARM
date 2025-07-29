import React from 'react';

const OutputView = ({ assembly }) => (
  <pre style={{ background: '#222', color: '#0f0', padding: '1rem' }}>
    {assembly || 'Assembly aparecerá aqui'}
  </pre>
);

export default OutputView;
