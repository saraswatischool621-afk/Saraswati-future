/**
 * EDIT SCHOOL INFORMATION HERE
 *
 * This file is bundled into the static site at build time. Updating these
 * values does not require changing the page layout or any backend service.
 */
export const schoolContent = {
  identity: {
    name: 'Saraswati Primary English Medium School',
    shortName: 'Saraswati',
    location: 'Jalgaon',
    board: 'Maharashtra State Board',
    medium: 'English',
    management: 'Lewa Educational Union',
    registration: 'Reg. No. A-410, Jalgaon',
    founded: '1985',
    levels: 'Pre-Primary, Primary and Middle School (Classes 1–10)',
    academicYear: '2026–27',
    logo: '/school-logo.jpg',
    metaDescription:
      'Saraswati Primary English Medium School, Jalgaon — a State Board school under Lewa Educational Union, supporting confident learning from Pre-Primary to Class 10.',
    ogDescription:
      'A welcoming State Board school in Jalgaon, nurturing curious minds, confident expression, and active, balanced lives.',
  },

  contact: {
    address: 'P-52, Ajintha Road, Near Lokmat Office, M.I.D.C. Area, Jalgaon',
    shortAddress: 'P-52, Ajintha Road · Jalgaon',
    phone: '0257-2211814',
    phoneHref: 'tel:+912572211814',
    whatsappNumber: '919975249949',
    whatsappDisplay: '+91 99752 49949',
    whatsappGreeting:
      'Namaste Saraswati School, I would like to know more about admissions.',
    email: 'lewaedusaraswati@gmail.com',
    instagram:
      'https://www.instagram.com/saraswatischool2016?igsi=N2szeHhuN214Z3Rp',
    facebook: 'https://www.facebook.com/share/1EigafJA4U/',
    meetingHours: {
      principal: 'Principal: 10:00 AM–11:00 AM',
      office: 'Working days or by appointment',
      teachers: 'Teachers: Saturdays after school hours',
    },
  },

  admissions: {
    deadlines:
      'End of April for Pre-Primary; end of May for Classes 1st to 9th & 11th.',
    visitNote:
      'Please bring originals for verification. The office team will guide you through the remaining steps.',
    requiredDocuments: [
      'Original Birth Certificate / Transfer Certificate (T.C./L.C.)',
      'Parent & Child Identity Proof Xerox (1 copy)',
      "Father's Caste Certificate Xerox (1 copy)",
      '1 passport-size photo each (parent & child)',
      'Previous school marksheet',
    ],
  },

  fees: {
    columns: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4', 'Annual total'],
    rows: [
      {
        programme: 'Nursery to Class 4th',
        quarters: ['₹ 3,010', '₹ 3,010', '₹ 3,010', '₹ 3,010'],
        annualTotal: '₹ 12,040',
      },
      {
        programme: 'Class 5th to Class 10th',
        quarters: ['₹ 3,750', '₹ 3,750', '₹ 3,750', '₹ 3,750'],
        annualTotal: '₹ 15,000',
      },
    ],
    note:
      'Fees are payable at the beginning of each quarter. Books, uniform, transport and optional activities are charged separately where applicable.',
  },

  about: {
    description:
      'Saraswati Primary English Medium School is a premier educational institution run under the aegis of Lewa Educational Union (Reg. No. A-410, Jalgaon). Committed to nurturing young minds in a safe, vibrant, and supportive environment, our school proudly caters to over 850 students with the support of a dedicated team of more than 40 experienced teachers. We are equipped with modern learning infrastructure, including a well-designed Science lab, a modern Computer lab, and dedicated music and dance rooms to foster technical skills and creative expression. With comprehensive facilities for both indoor and outdoor sports, we ensure a balanced blend of academic excellence, holistic growth, and physical well-being for every child.',
    values: [
      ['01', 'Know every learner', 'Small acts of attention make room for brave questions and steady progress.'],
      ['02', 'Learn by doing', 'From a seed in the science lab to a rhythm in the music room, ideas become real.'],
      ['03', 'Grow together', 'Families, teachers and children are partners in the work of becoming.'],
      ['04', 'Stand tall locally', 'Proud of Jalgaon, open to the world — our roots make our horizons wider.'],
    ],
    stats: [
      ['850+', 'students'],
      ['40+', 'teachers'],
      ['1985', 'founded'],
      ['1', 'shared purpose'],
    ],
  },

  programmes: [
    {
      num: '01',
      name: 'Pre-Primary',
      ages: 'Foundations · Nursery to UKG',
      tone: 'saffron',
      icon: 'sparkles',
      copy: 'A gentle, joyful start where play is purposeful and every new word, shape and friendship matters.',
      points: ['English', 'Maths', 'Marathi', 'EVS', 'Hindi Rhymes', 'Art & Craft', 'Educational Toys', 'Audio-visual learning', 'Storytelling', 'Etiquette training'],
    },
    {
      num: '02',
      name: 'Primary',
      ages: 'Classes 1–4',
      tone: 'teal',
      icon: 'book',
      copy: 'Children build strong foundations in English, Mathematics, EVS and the creative arts — with the confidence to ask why.',
      points: ['English', 'Hindi', 'Marathi', 'Mathematics', 'General Science', 'EVS', 'Drawing', 'Work Experience', 'Computer', 'GK', 'Physical Education', 'Fine Arts', 'Yoga / Meditation'],
    },
    {
      num: '03',
      name: 'Middle School',
      ages: 'Classes 5–10',
      tone: 'coral',
      icon: 'award',
      copy: 'A wider world opens up. Subject depth, thoughtful mentors and real responsibilities prepare students for the State Board journey ahead.',
      points: ['English', 'Hindi', 'Marathi', 'Maths', 'Science', 'SST / EVS', 'Work Experience', 'Computer', 'Life Skills', 'Dramatization', 'Environment Studies'],
    },
  ],

  facilities: [
    { title: 'Science Lab', copy: 'Observe, test, wonder and try again.', tone: 'saffron', icon: 'flask' },
    { title: 'Computer Lab', copy: 'Digital fluency with a human touch.', tone: 'teal', icon: 'laptop' },
    { title: 'Music & Dance Rooms', copy: 'A beat, a breath, a brave first performance.', tone: 'coral', icon: 'music' },
  ],

  gallery: [
    { src: '/gallery/sports-band.webp', title: 'Precision, pride, and a steady beat', label: 'Sports Day', text: 'Our students lead with discipline, teamwork and the joy of performing together.' },
    { src: '/gallery/cultural-performance.webp', title: 'Every voice belongs on stage', label: 'Cultural programme', text: 'Music and dance give young learners a confident language for expression.' },
    { src: '/gallery/sports-day.webp', title: 'Play is part of growing', label: 'Sports & games', text: 'Outdoor activity builds balance, friendship and a love of moving well.' },
    { src: '/gallery/team-spirit.webp', title: 'Team spirit, brightly expressed', label: 'School community', text: 'Shared celebration, active play and a proud sense of belonging.' },
  ],

  disclosure: [
    ['School name', 'Saraswati Primary English Medium School, Jalgaon'],
    ['Management', 'Lewa Educational Union'],
    ['Board', 'Maharashtra State Board'],
    ['Medium of instruction', 'English'],
    ['School level', 'Pre-Primary, Primary and Middle School (Classes 1–10)'],
  ],

  disclosureHighlights: [
    ['Recognition', 'A proud State Board school serving the Jalgaon community.'],
    ['Leadership', 'A committed teaching team of 40+ educators.'],
    ['Belonging', 'A growing school family of 850+ students.'],
  ],
} as const;