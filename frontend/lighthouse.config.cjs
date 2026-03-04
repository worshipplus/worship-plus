module.exports = {
  ci: {
    collect: {
      startServerCommand:
      'npm --prefix frontend run preview -- --strictPort --port 4173',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 120000,
      url: ['http://127.0.0.1:4173/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
