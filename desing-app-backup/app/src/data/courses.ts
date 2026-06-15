export interface Course {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: number;
  hours: number;
  category: string;
}

export const courses: Course[] = [
  {
    id: 'plc-basics',
    title: {
      ar: 'برمجة PLC للمبتدئين',
      en: 'PLC Programming for Beginners'
    },
    description: {
      ar: 'تعلم أساسيات برمجة المتحكمات المنطقية القابلة للبرمجة (PLC) من الصفر حتى الاحتراف',
      en: 'Learn the basics of Programmable Logic Controllers (PLC) programming from scratch to pro'
    },
    image: '/course-plc.jpg',
    level: 'beginner',
    lessons: 24,
    hours: 18,
    category: 'plc'
  },
  {
    id: 'power-electronics',
    title: {
      ar: 'إلكترونيات القوى',
      en: 'Power Electronics'
    },
    description: {
      ar: 'استكشف عالم إلكترونيات القوى وتعلم عن الدوائر الكهربائية والتحويلات',
      en: 'Explore the world of power electronics and learn about electrical circuits and converters'
    },
    image: '/course-power.jpg',
    level: 'intermediate',
    lessons: 32,
    hours: 24,
    category: 'electronics'
  },
  {
    id: 'industrial-robotics',
    title: {
      ar: 'الروبوتات الصناعية',
      en: 'Industrial Robotics'
    },
    description: {
      ar: 'تعلم تصميم وبرمجة الروبوتات الصناعية المستخدمة في خطوط الإنتاج',
      en: 'Learn to design and program industrial robots used in production lines'
    },
    image: '/course-robotics.jpg',
    level: 'advanced',
    lessons: 40,
    hours: 32,
    category: 'robotics'
  },
  {
    id: 'scada-systems',
    title: {
      ar: 'أنظمة SCADA',
      en: 'SCADA Systems'
    },
    description: {
      ar: 'تعلم أنظمة المراقبة والتحكم في العمليات الصناعية',
      en: 'Learn industrial process monitoring and control systems'
    },
    image: '/course-scada.jpg',
    level: 'intermediate',
    lessons: 28,
    hours: 20,
    category: 'scada'
  },
  {
    id: 'hmi-design',
    title: {
      ar: 'تصميم واجهات HMI',
      en: 'HMI Interface Design'
    },
    description: {
      ar: 'تعلم تصميم واجهات الآلة البشرية للتحكم الصناعي',
      en: 'Learn to design Human-Machine Interfaces for industrial control'
    },
    image: '/course-hmi.jpg',
    level: 'beginner',
    lessons: 20,
    hours: 15,
    category: 'hmi'
  },
  {
    id: 'sensors-actuators',
    title: {
      ar: 'المستشعرات والمشغلات',
      en: 'Sensors and Actuators'
    },
    description: {
      ar: 'تعرف على أنواع المستشعرات والمشغلات المستخدمة في الأتمتة الصناعية',
      en: 'Learn about types of sensors and actuators used in industrial automation'
    },
    image: '/course-sensors.jpg',
    level: 'beginner',
    lessons: 22,
    hours: 16,
    category: 'sensors'
  }
];
