import type { Event } from "../types/event";

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Culto de Adoração — Janeiro",
    date: "2024-01-21T09:00:00Z",
    status: "locked",
    owner: "Carlos Silva",
    description:
      "Culto dominical com foco em adoração e louvor. Equipe completa escalada.",
    eventSetlist: [
      {
        id: "s1",
        title: "Oceans (Where Feet May Fail)",
        author: "Hillsong United",
        key: "D",
        youtubeUrl: "https://www.youtube.com/watch?v=dy9nwe9_xzw",
      },
      {
        id: "s2",
        title: "Goodness of God",
        author: "Bethel Music",
        key: "A",
        youtubeUrl: "https://www.youtube.com/watch?v=XrmgI6-QSKI",
      },
    ],
  },
  {
    id: "2",
    title: "Encontro de Jovens — Fevereiro",
    date: "2024-02-11T19:00:00Z",
    status: "scheduled",
    owner: "Ana Oliveira",
    description: "Evento especial para a juventude com dinâmicas e louvor.",
    eventSetlist: [
      {
        id: "s3",
        title: "Reckless Love",
        author: "Cory Asbury",
        key: "E",
        youtubeUrl: "https://www.youtube.com/watch?v=Sc6SSHuZvQE",
      },
    ],
  },
  {
    id: "3",
    title: "Culto de Células — Rascunho",
    date: "2099-03-05T19:30:00Z",
    status: "draft",
    owner: "Paulo Mendes",
    description: "Planejamento inicial do culto de células. Em rascunho.",
    eventSetlist: [],
  },
  {
    id: "4",
    title: "Culto de Páscoa",
    date: "2099-04-20T10:00:00Z",
    status: "scheduled",
    owner: "Mariana Costa",
    description:
      "Celebração especial de Páscoa com toda a congregação. Equipe de louvor e drama.",
    eventSetlist: [
      {
        id: "s4",
        title: "Way Maker",
        author: "Sinach",
        key: "G",
        youtubeUrl: "https://www.youtube.com/watch?v=iLOEsOxe8gE",
      },
      {
        id: "s5",
        title: "O Praise the Name (Anastasis)",
        author: "Hillsong Worship",
        key: "C",
        youtubeUrl: "https://www.youtube.com/watch?v=HLJFvNy4iIU",
      },
      {
        id: "s6",
        title: "King of Kings",
        author: "Hillsong Worship",
        key: "B",
        youtubeUrl: "https://www.youtube.com/watch?v=6BJAQWMxkLA",
      },
    ],
  },
  {
    id: "5",
    title: "Conferência de Adoração",
    date: "2099-06-15T18:00:00Z",
    status: "locked",
    owner: "Carlos Silva",
    description:
      "Conferência anual focada em capacitar adoradores. Speakers convidados e workshops.",
    eventSetlist: [
      {
        id: "s7",
        title: "What A Beautiful Name",
        author: "Hillsong Worship",
        key: "D",
        youtubeUrl: "https://www.youtube.com/watch?v=nQWFzMvCfLE",
      },
    ],
  },
];
