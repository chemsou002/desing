export interface Course {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  fullDesc: { ar: string; en: string };
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: number;
  hours: number;
  price: number;
  image: string;
  instructor: string;
  curriculum: Lesson[];
}

export interface Lesson {
  id: string;
  title: { ar: string; en: string };
  duration: string;
  type: 'video' | 'quiz' | 'simulation';
}

export const courses: Course[] = [
  {
    id: 'plc-basics',
    title: { ar: 'برمجة PLC للمبتدئين', en: 'PLC Programming for Beginners' },
    description: {
      ar: 'تعلم أساسيات برمجة المتحكمات المنطقية القابلة للبرمجة (PLC) من الصفر. تغطي الدورة المفاهيم الأساسية، لغة البرمجة Ladder Logic، والتطبيقات العملية.',
      en: 'Learn the basics of Programmable Logic Controller (PLC) programming from scratch. This course covers fundamental concepts, Ladder Logic programming language, and practical applications.',
    },
    fullDesc: {
      ar: 'هذه الدورة الشاملة تُؤهلك لفهم وبرمجة أنظمة PLC المستخدمة على نطاق واسع في الصناعة. ستتعلم من خلال دروس نظرية وتمارين عملية ومحاكاة تفاعلية. تغطي الدورة: المقدمة في الأتمتة الصناعية، أساسيات PLC، لغة Ladder Logic، التimers والCounters، المدخلات والمخرجات، وأكثر من 10 مشاريع عملية.',
      en: 'This comprehensive course qualifies you to understand and program PLC systems widely used in industry. You will learn through theoretical lessons, practical exercises, and interactive simulation. Covers: Introduction to industrial automation, PLC basics, Ladder Logic language, Timers and Counters, I/O systems, and more than 10 practical projects.',
    },
    level: 'beginner',
    lessons: 24,
    hours: 12,
    price: 49,
    image: '/course-plc.jpg',
    instructor: 'أحمد الخالدي',
    curriculum: [
      { id: '1', title: { ar: 'مقدمة في الأتمتة الصناعية', en: 'Introduction to Industrial Automation' }, duration: '15:00', type: 'video' },
      { id: '2', title: { ar: 'ما هو PLC وكيف يعمل', en: 'What is PLC and How It Works' }, duration: '20:00', type: 'video' },
      { id: '3', title: { ar: 'مكونات النظام PLC', en: 'PLC System Components' }, duration: '18:00', type: 'video' },
      { id: '4', title: { ar: 'لغة Ladder Logic - الجزء 1', en: 'Ladder Logic Language - Part 1' }, duration: '25:00', type: 'video' },
      { id: '5', title: { ar: 'لغة Ladder Logic - الجزء 2', en: 'Ladder Logic Language - Part 2' }, duration: '22:00', type: 'video' },
      { id: '6', title: { ar: 'تمارين عملية على Ladder Logic', en: 'Practical Exercises on Ladder Logic' }, duration: '30:00', type: 'simulation' },
      { id: '7', title: { ar: 'Timers و Counters', en: 'Timers and Counters' }, duration: '28:00', type: 'video' },
      { id: '8', title: { ar: 'اختبار مرحلي', en: 'Mid-term Quiz' }, duration: '15:00', type: 'quiz' },
      { id: '9', title: { ar: 'المدخلات والمخرجات الرقمية', en: 'Digital Inputs and Outputs' }, duration: '20:00', type: 'video' },
      { id: '10', title: { ar: 'المدخلات والمخرجات التناظرية', en: 'Analog Inputs and Outputs' }, duration: '24:00', type: 'video' },
      { id: '11', title: { ar: 'محاكاة: نظام الإضاءة الذكي', en: 'Simulation: Smart Lighting System' }, duration: '35:00', type: 'simulation' },
      { id: '12', title: { ar: 'مشروع نهائي: خط الإنتاج الآلي', en: 'Final Project: Automated Production Line' }, duration: '45:00', type: 'simulation' },
    ],
  },
  {
    id: 'power-electronics',
    title: { ar: 'إلكترونيات القوة', en: 'Power Electronics' },
    description: {
      ar: 'استكشف عالم إلكترونيات القوة من المحولات والمحولات إلى أنظمة التحكم في المحركات. دورة متكاملة للمهندسين والفنيين.',
      en: 'Explore the world of power electronics from transformers and converters to motor control systems. A comprehensive course for engineers and technicians.',
    },
    fullDesc: {
      ar: 'دورة متعمقة في إلكترونيات القوة تغطي المحولات، المقومات، العاكسات، وأنظمة التحكم في السرعة. مناسبة للمهندسين الكهربائيين والفنيين. ستتعلم تصميم وتحليل دوائر القدرة وكيفية استخدامها في التطبيقات الصناعية.',
      en: 'An in-depth course in power electronics covering transformers, rectifiers, inverters, and speed control systems. Suitable for electrical engineers and technicians. You will learn to design and analyze power circuits and how to use them in industrial applications.',
    },
    level: 'intermediate',
    lessons: 18,
    hours: 9,
    price: 69,
    image: '/course-power.jpg',
    instructor: 'محمد العمري',
    curriculum: [
      { id: '1', title: { ar: 'مقدمة في إلكترونيات القوة', en: 'Introduction to Power Electronics' }, duration: '15:00', type: 'video' },
      { id: '2', title: { ar: 'أشباه الموصلات ودوائر القوة', en: 'Semiconductors and Power Circuits' }, duration: '22:00', type: 'video' },
      { id: '3', title: { ar: 'المحولات (Rectifiers)', en: 'Rectifiers' }, duration: '25:00', type: 'video' },
      { id: '4', title: { ar: 'العاكسات (Inverters)', en: 'Inverters' }, duration: '28:00', type: 'video' },
      { id: '5', title: { ar: 'المحولات DC-DC', en: 'DC-DC Converters' }, duration: '20:00', type: 'video' },
      { id: '6', title: { ar: 'اختبار مرحلي', en: 'Mid-term Quiz' }, duration: '15:00', type: 'quiz' },
      { id: '7', title: { ar: 'التحكم في المحركات AC', en: 'AC Motor Control' }, duration: '30:00', type: 'video' },
      { id: '8', title: { ar: 'التحكم في المحركات DC', en: 'DC Motor Control' }, duration: '28:00', type: 'video' },
      { id: '9', title: { ar: 'محاكاة: نظام تحكم في السرعة', en: 'Simulation: Speed Control System' }, duration: '35:00', type: 'simulation' },
    ],
  },
  {
    id: 'robotics-arm',
    title: { ar: 'روبوتكس وARM', en: 'Robotics & ARM' },
    description: {
      ar: 'ادخل إلى عالم الروبوتيكس المتقدم وتعلم برمجة ذراع الروبوت ومعالجات ARM. دورة متقدمة للمهندسين الميكانيكيين.',
      en: 'Enter the world of advanced robotics and learn robot arm programming and ARM processors. An advanced course for mechanical engineers.',
    },
    fullDesc: {
      ar: 'دورة متقدمة في الروبوتيكس ومعالجات ARM. ستتعلم ميكانيكا الروبوت، الحساسات، المحركات، وبرمجة الذراع الصناعي. تشمل الدورة مشاريع عملية على الروبوتات الصناعية وأنظمة التحكم المتقدمة.',
      en: 'An advanced course in robotics and ARM processors. You will learn robot mechanics, sensors, motors, and industrial arm programming. The course includes practical projects on industrial robots and advanced control systems.',
    },
    level: 'advanced',
    lessons: 32,
    hours: 16,
    price: 99,
    image: '/course-robotics.jpg',
    instructor: 'سارة القحطاني',
    curriculum: [
      { id: '1', title: { ar: 'مقدمة في الروبوتيكس', en: 'Introduction to Robotics' }, duration: '18:00', type: 'video' },
      { id: '2', title: { ar: 'ميكانيكا الروبوت', en: 'Robot Mechanics' }, duration: '25:00', type: 'video' },
      { id: '3', title: { ar: 'الحساسات في الروبوتات', en: 'Sensors in Robotics' }, duration: '22:00', type: 'video' },
      { id: '4', title: { ar: 'المحركات والمحركات', en: 'Actuators and Motors' }, duration: '28:00', type: 'video' },
      { id: '5', title: { ar: 'معالجات ARM - الأساسيات', en: 'ARM Processors - Basics' }, duration: '30:00', type: 'video' },
      { id: '6', title: { ar: 'برمجة الذراع الصناعي', en: 'Industrial Arm Programming' }, duration: '35:00', type: 'video' },
      { id: '7', title: { ar: 'اختبار مرحلي', en: 'Mid-term Quiz' }, duration: '15:00', type: 'quiz' },
      { id: '8', title: { ar: 'الرؤية الحاسوبية للروبوتات', en: 'Computer Vision for Robotics' }, duration: '32:00', type: 'video' },
      { id: '9', title: { ar: 'محاكاة: ذراع روبوت صناعي', en: 'Simulation: Industrial Robot Arm' }, duration: '40:00', type: 'simulation' },
      { id: '10', title: { ar: 'مشروع نهائي: خلية إنتاج روبوتية', en: 'Final Project: Robotic Production Cell' }, duration: '50:00', type: 'simulation' },
    ],
  },
];

export const getCourseById = (id: string): Course | undefined => {
  return courses.find((c) => c.id === id);
};
