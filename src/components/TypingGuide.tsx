import React from 'react';
import { Keyboard, Type, AlertCircle, Hand } from 'lucide-react';

const TypingGuide: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 mt-4 sm:mt-8 space-y-8 pb-20 animate-fade-in">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400 pb-2">
          Master Typing | टाइपिंग गाइड
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Learn the fundamentals of fast and accurate typing in both English and Hindi. <br/>
          (अंग्रेजी और हिंदी दोनों में तेज और सटीक टाइपिंग के मूल सिद्धांत सीखें।)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* English Guide Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Type className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">English Typing</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">1. The Home Row (होम रो)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Always rest your fingers on the middle row of the keyboard: 
                <strong className="text-blue-500 dark:text-blue-400 mx-1">A S D F</strong> for the left hand and 
                <strong className="text-blue-500 dark:text-blue-400 mx-1">J K L ;</strong> for the right hand. 
                Your thumbs should rest on the Spacebar.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm leading-relaxed mt-1 font-medium">
                (अपनी उंगलियों को हमेशा कीबोर्ड की बीच वाली पंक्ति (Home Row) पर रखें: बाएं हाथ के लिए A S D F और दाएं हाथ के लिए J K L ;। अंगूठे स्पेसबार पर होने चाहिए।)
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">2. Finger Movement (उंगलियों का मूवमेंट)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Each finger is responsible for a diagonal column of keys. Never look at the keyboard. Feel the raised bumps on the <strong>F</strong> and <strong>J</strong> keys to center yourself.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm leading-relaxed mt-1 font-medium">
                (हर उंगली कुछ खास बटनों के लिए जिम्मेदार होती है। कीबोर्ड को कभी न देखें। 'F' और 'J' बटनों पर उभरे हुए निशानों को महसूस करके अपनी उंगलियों को सेट करें।)
              </p>
            </div>
          </div>
        </div>

        {/* Hindi Guide Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <Keyboard className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Hindi Typing (हिंदी टाइपिंग)</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">1. Hindi Layouts (हिंदी लेआउट)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                In India, two main layouts are used: <strong>Kruti Dev (Remington)</strong> and <strong>Mangal (Inscript)</strong>. Mangal is the standard Unicode font used in government exams, while Kruti Dev is popular in traditional DTP work.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm leading-relaxed mt-1 font-medium">
                (भारत में मुख्य रूप से दो लेआउट इस्तेमाल होते हैं: कृति देव (Kruti Dev) और मंगल (Mangal Inscript)। सरकारी परीक्षाओं में मंगल (Unicode) का उपयोग होता है, जबकि कृति देव पुराने टाइपिंग कार्यों में लोकप्रिय है।)
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">2. Mangal Inscript Basics (मंगल लेआउट के मूल नियम)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                In Inscript layout, the left side of the keyboard contains vowels (स्वर) and their matras (मात्राएं), while the right side contains consonants (व्यंजन). 
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm leading-relaxed mt-1 font-medium">
                (इनस्क्रिप्ट लेआउट में, कीबोर्ड के बायीं तरफ स्वर (अ, आ, इ) और उनकी मात्राएं होती हैं, जबकि दायीं तरफ व्यंजन (क, ख, ग) होते हैं।)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="glass-panel p-8 rounded-3xl mt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Hand className="w-6 h-6 text-sky-500" />
          Pro Tips for Both Languages (सुझाव)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
            <h4 className="font-bold mb-2">Posture (पोस्चर)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sit straight with your back supported. Keep your elbows bent at a 90-degree angle. (सीधे बैठें, कोहनी 90 डिग्री पर रखें।)</p>
          </div>
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
            <h4 className="font-bold mb-2">Accuracy First (सटीकता)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Do not rush! Focus on typing correctly without looking down. Speed will come naturally. (जल्दबाजी न करें, पहले बिना देखे सही टाइप करने पर ध्यान दें।)</p>
          </div>
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
            <h4 className="font-bold mb-2">Daily Practice (अभ्यास)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Practice for at least 15-20 minutes daily. Consistency is the key to muscle memory. (रोजाना 15-20 मिनट अभ्यास करें, निरंतरता सबसे जरूरी है।)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingGuide;
