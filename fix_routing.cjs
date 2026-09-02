const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Initial State from URL
code = code.replace(
  "const [currentView, setCurrentView] = useState<ViewState>('home');",
  `const [currentView, setCurrentView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace('/', '');
      const validViews = ['home', 'practice', 'meteor', 'sprint', 'bubble', 'about', 'help', 'contact', 'stats', 'guide', 'lessons', 'lesson-practice', 'privacy', 'terms'];
      if (validViews.includes(path)) return path as ViewState;
    }
    return 'home';
  });`
);

// 2. Add useEffect for SEO and Routing
const seoEffect = `
  // SEO & Routing Effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Update URL
    const path = currentView === 'home' ? '/' : \`/\${currentView}\`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    // Update Title and Meta
    const titles: Record<string, string> = {
      home: 'TypeVelocity - Best Online Typing Tutor & Speed Test',
      practice: 'Typing Practice - Test your WPM | TypeVelocity',
      meteor: 'Meteor Drop - Typing Game | TypeVelocity',
      sprint: 'Neon Sprint - Typing Game | TypeVelocity',
      bubble: 'Spirit Catch - Typing Game | TypeVelocity',
      guide: 'Typing Guide - Learn Touch Typing | TypeVelocity',
      about: 'About Us | TypeVelocity',
      privacy: 'Privacy Policy | TypeVelocity',
      terms: 'Terms & Conditions | TypeVelocity'
    };
    
    const descriptions: Record<string, string> = {
      home: 'Master your typing speed with TypeVelocity. Free online typing tutor, WPM tests, and typing games.',
      practice: 'Take a free typing test to find out your WPM and accuracy. Practice English and Hindi typing.',
      meteor: 'Defend against falling words in this fast-paced typing survival game.',
      sprint: 'Race against the clock in short, high-intensity typing bursts to maximize speed.',
      guide: 'Learn the fundamentals of touch typing, finger placement, and posture to type faster.'
    };

    document.title = titles[currentView] || 'TypeVelocity - Typing Tutor';
    
    const desc = descriptions[currentView] || descriptions.home;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
    
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', document.title);
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

  }, [currentView]);

  // Handle Popstate (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      const validViews = ['home', 'practice', 'meteor', 'sprint', 'bubble', 'about', 'help', 'contact', 'stats', 'guide', 'lessons', 'lesson-practice', 'privacy', 'terms'];
      if (validViews.includes(path)) {
        setCurrentView(path as ViewState);
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
`;

// Insert after the first useEffect (or just before the return)
code = code.replace(
  "return (",
  seoEffect + "\n  return ("
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched for SEO routing.');
