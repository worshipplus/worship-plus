// Generate avatar as inline SVG with initials (no external requests)
function generateAvatar(name) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#7B112F', '#9F1D3E', '#C3294D', '#E7355C', '#A51D42'] // Burgundy variations
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const color = colors[colorIndex % colors.length]
  
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="${color}"/><text x="75" y="95" font-family="system-ui,-apple-system,sans-serif" font-size="56" font-weight="600" fill="#F8F6F0" text-anchor="middle">${initials}</text></svg>`)}`
}

export const TEAM = [
  { id: 'u1', name: 'Ana Silva', avatar: generateAvatar('Ana Silva'), instrument: 'Voz', role: 'cantor', congregation: 'AD Central', email: 'ana@email.com' },
  { id: 'u2', name: 'Carlos Souza', avatar: generateAvatar('Carlos Souza'), instrument: 'Violão', role: 'musico', congregation: 'AD Jardins', email: 'carlos@email.com' },
  { id: 'u3', name: 'Marina Costa', avatar: generateAvatar('Marina Costa'), instrument: 'Teclado', role: 'musico', congregation: 'AD Central', email: 'marina@email.com' },
  { id: 'u4', name: 'Rafael Lima', avatar: generateAvatar('Rafael Lima'), instrument: 'Bateria', role: 'musico', congregation: 'AD Norte', email: 'rafael@email.com' },
  { id: 'u5', name: 'Juliana Rocha', avatar: generateAvatar('Juliana Rocha'), instrument: 'Baixo', role: 'musico', congregation: 'AD Central', email: 'juliana@email.com' },
  { id: 'u6', name: 'Pedro Alves', avatar: generateAvatar('Pedro Alves'), instrument: 'Projeção', role: 'midia', congregation: 'AD Jardins', email: 'pedro@email.com' },
  { id: 'u7', name: 'Fernanda Melo', avatar: generateAvatar('Fernanda Melo'), instrument: 'Voz', role: 'cantor', congregation: 'AD Central', email: 'fernanda@email.com' },
  { id: 'u8', name: 'Lucas Ferreira', avatar: generateAvatar('Lucas Ferreira'), instrument: 'Mesa de Som', role: 'som', congregation: 'AD Norte', email: 'lucas@email.com' },
]

export const EVENTS = [
  { id: 'e1', title: 'Culto Dominical',       date: '2026-03-01', description: 'Culto das 10h — manhã',  scale: ['u1', 'u2', 'u6', 'u8'],              songs: ['m1', 'm3', 'm5'] },
  { id: 'e2', title: 'Culto Noturno',          date: '2026-03-01', description: 'Culto das 19h — noite',  scale: ['u7', 'u3', 'u5'],                    songs: ['m2', 'm4', 'm6'] },
  { id: 'e3', title: 'Ensaio Geral',           date: '2026-03-05', description: 'Ensaio às 19h30',        scale: ['u1', 'u2', 'u3', 'u4', 'u7'],        songs: [] },
  { id: 'e4', title: 'Conferência de Jovens',  date: '2026-03-15', description: 'Sábado à noite',         scale: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'], songs: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'] },
  { id: 'e5', title: 'Culto de Oração',        date: '2026-02-10', description: 'Quarta-feira às 19h30',  scale: ['u2', 'u7', 'u8'],                    songs: ['m5', 'm6'] },
]

// Note: Media URLs removed for POC performance (external requests slowed initial load by 12s)
// In production, these will be served from S3 + CloudFront CDN
export const SETLIST = [
  { id: 'm1', title: 'Grandioso És Tu', author: 'Carl Gustav Boberg', link: 'https://example.com/partitura1', media: null },
  { id: 'm2', title: 'Cântico de Louvor', author: 'Autor B', link: 'https://example.com/partitura2', media: null },
  { id: 'm3', title: 'Oceans', author: 'Hillsong UNITED', link: 'https://example.com/partitura3', media: null },
  { id: 'm4', title: 'Way Maker', author: 'Hillsong United', link: 'https://example.com/partitura4', media: null },
  { id: 'm5', title: 'Tua Graça Me Basta', author: 'Toque no Altar', link: null, media: null },
  { id: 'm6', title: 'Ousado Amor', author: 'Isaías Saad', link: 'https://example.com/partitura6', media: null },
]
