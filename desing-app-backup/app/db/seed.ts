import { getDb } from "../api/queries/connection";
import { paths, lessons, users } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  /* ================================================================ */
  /*  1. Seed Paths                                                    */
  /* ================================================================ */
  console.log("Inserting paths...");

  const insertedPaths = await db.insert(paths).values([
    {
      slug: "automation-basics",
      nameAr: "أساسيات الأتمتة",
      nameEn: "Automation Basics",
      descriptionAr: "اكتسب المفاهيم الأساسية في الأتمتة الصناعية",
      descriptionEn: "Gain fundamental concepts in industrial automation",
      level: "beginner",
      image: "/course-plc.jpg",
      order: 1,
    },
    {
      slug: "plc-programming",
      nameAr: "برمجة PLC",
      nameEn: "PLC Programming",
      descriptionAr: "تعلم برمجة المتحكمات المنطقية القابلة للبرمجة",
      descriptionEn: "Learn Programmable Logic Controller programming",
      level: "beginner",
      image: "/course-plc.jpg",
      order: 2,
    },
    {
      slug: "power-electronics",
      nameAr: "إلكترونيات القوة",
      nameEn: "Power Electronics",
      descriptionAr: "استكشف عالم إلكترونيات القوة والمحولات",
      descriptionEn: "Explore the world of power electronics and converters",
      level: "intermediate",
      image: "/course-power.jpg",
      order: 3,
    },
    {
      slug: "robotics-arm",
      nameAr: "ARM روبوتكس",
      nameEn: "Robotics & ARM",
      descriptionAr: "ادخل إلى عالم الروبوتيكس ومعالجات ARM",
      descriptionEn: "Enter the world of robotics and ARM processors",
      level: "advanced",
      image: "/course-robotics.jpg",
      order: 4,
    },
  ]);

  // Fetch inserted paths to get their IDs
  const allPaths = await db.select().from(paths);

  /* ================================================================ */
  /*  2. Seed Lessons for each Path                                    */
  /* ================================================================ */
  console.log("Inserting lessons...");

  const automationBasicsPath = allPaths.find((p) => p.slug === "automation-basics");
  const plcPath = allPaths.find((p) => p.slug === "plc-programming");
  const powerPath = allPaths.find((p) => p.slug === "power-electronics");
  const roboticsPath = allPaths.find((p) => p.slug === "robotics-arm");

  // --- Automation Basics (6 lessons) ---
  if (automationBasicsPath) {
    await db.insert(lessons).values([
      {
        pathId: automationBasicsPath.id,
        titleAr: "مقدمة في الأتمتة الصناعية",
        titleEn: "Introduction to Industrial Automation",
        type: "video",
        durationMinutes: 15,
        xpReward: 50,
        order: 1,
      },
      {
        pathId: automationBasicsPath.id,
        titleAr: "مكونات أنظمة التحكم",
        titleEn: "Control System Components",
        type: "video",
        durationMinutes: 20,
        xpReward: 50,
        order: 2,
      },
      {
        pathId: automationBasicsPath.id,
        titleAr: "قراءة المخططات الكهربية",
        titleEn: "Reading Electrical Diagrams",
        type: "video",
        durationMinutes: 25,
        xpReward: 75,
        order: 3,
      },
      {
        pathId: automationBasicsPath.id,
        titleAr: "أجهزة الاستشعار والمشغلات",
        titleEn: "Sensors and Actuators",
        type: "video",
        durationMinutes: 22,
        xpReward: 50,
        order: 4,
      },
      {
        pathId: automationBasicsPath.id,
        titleAr: "اختبار الأساسيات",
        titleEn: "Basics Quiz",
        type: "quiz",
        durationMinutes: 15,
        xpReward: 100,
        order: 5,
      },
      {
        pathId: automationBasicsPath.id,
        titleAr: "محاكاة: نظام الإضاءة الذكي",
        titleEn: "Simulation: Smart Lighting System",
        type: "simulation",
        durationMinutes: 30,
        xpReward: 150,
        order: 6,
      },
    ]);
  }

  // --- PLC Programming (8 lessons) ---
  if (plcPath) {
    await db.insert(lessons).values([
      {
        pathId: plcPath.id,
        titleAr: "مفاهيم PLC الأساسية",
        titleEn: "Basic PLC Concepts",
        type: "video",
        durationMinutes: 18,
        xpReward: 50,
        order: 1,
      },
      {
        pathId: plcPath.id,
        titleAr: "لغة Ladder Logic - الجزء 1",
        titleEn: "Ladder Logic Language - Part 1",
        type: "video",
        durationMinutes: 25,
        xpReward: 75,
        order: 2,
      },
      {
        pathId: plcPath.id,
        titleAr: "لغة Ladder Logic - الجزء 2",
        titleEn: "Ladder Logic Language - Part 2",
        type: "video",
        durationMinutes: 22,
        xpReward: 75,
        order: 3,
      },
      {
        pathId: plcPath.id,
        titleAr: "Timers و Counters",
        titleEn: "Timers and Counters",
        type: "video",
        durationMinutes: 28,
        xpReward: 75,
        order: 4,
      },
      {
        pathId: plcPath.id,
        titleAr: "المدخلات والمخرجات الرقمية",
        titleEn: "Digital Inputs and Outputs",
        type: "video",
        durationMinutes: 20,
        xpReward: 50,
        order: 5,
      },
      {
        pathId: plcPath.id,
        titleAr: "المدخلات والمخرجات التناظرية",
        titleEn: "Analog Inputs and Outputs",
        type: "video",
        durationMinutes: 24,
        xpReward: 50,
        order: 6,
      },
      {
        pathId: plcPath.id,
        titleAr: "اختبار مرحلي",
        titleEn: "Mid-term Quiz",
        type: "quiz",
        durationMinutes: 15,
        xpReward: 100,
        order: 7,
      },
      {
        pathId: plcPath.id,
        titleAr: "مشروع نهائي: خط الإنتاج الآلي",
        titleEn: "Final Project: Automated Production Line",
        type: "simulation",
        durationMinutes: 45,
        xpReward: 200,
        order: 8,
      },
    ]);
  }

  // --- Power Electronics (7 lessons) ---
  if (powerPath) {
    await db.insert(lessons).values([
      {
        pathId: powerPath.id,
        titleAr: "مقدمة في إلكترونيات القوة",
        titleEn: "Introduction to Power Electronics",
        type: "video",
        durationMinutes: 15,
        xpReward: 50,
        order: 1,
      },
      {
        pathId: powerPath.id,
        titleAr: "أشباه الموصلات ودوائر القوة",
        titleEn: "Semiconductors and Power Circuits",
        type: "video",
        durationMinutes: 22,
        xpReward: 75,
        order: 2,
      },
      {
        pathId: powerPath.id,
        titleAr: "المحولات (Rectifiers)",
        titleEn: "Rectifiers",
        type: "video",
        durationMinutes: 25,
        xpReward: 75,
        order: 3,
      },
      {
        pathId: powerPath.id,
        titleAr: "العاكسات (Inverters)",
        titleEn: "Inverters",
        type: "video",
        durationMinutes: 28,
        xpReward: 75,
        order: 4,
      },
      {
        pathId: powerPath.id,
        titleAr: "المحولات DC-DC",
        titleEn: "DC-DC Converters",
        type: "video",
        durationMinutes: 20,
        xpReward: 75,
        order: 5,
      },
      {
        pathId: powerPath.id,
        titleAr: "اختبار مرحلي",
        titleEn: "Mid-term Quiz",
        type: "quiz",
        durationMinutes: 15,
        xpReward: 100,
        order: 6,
      },
      {
        pathId: powerPath.id,
        titleAr: "محاكاة: نظام تحكم في السرعة",
        titleEn: "Simulation: Speed Control System",
        type: "simulation",
        durationMinutes: 35,
        xpReward: 150,
        order: 7,
      },
    ]);
  }

  // --- Robotics & ARM (8 lessons) ---
  if (roboticsPath) {
    await db.insert(lessons).values([
      {
        pathId: roboticsPath.id,
        titleAr: "مقدمة في الروبوتيكس",
        titleEn: "Introduction to Robotics",
        type: "video",
        durationMinutes: 18,
        xpReward: 50,
        order: 1,
      },
      {
        pathId: roboticsPath.id,
        titleAr: "ميكانيكا الروبوت",
        titleEn: "Robot Mechanics",
        type: "video",
        durationMinutes: 25,
        xpReward: 75,
        order: 2,
      },
      {
        pathId: roboticsPath.id,
        titleAr: "الحساسات في الروبوتات",
        titleEn: "Sensors in Robotics",
        type: "video",
        durationMinutes: 22,
        xpReward: 75,
        order: 3,
      },
      {
        pathId: roboticsPath.id,
        titleAr: "المحركات والمشغلات",
        titleEn: "Actuators and Motors",
        type: "video",
        durationMinutes: 28,
        xpReward: 75,
        order: 4,
      },
      {
        pathId: roboticsPath.id,
        titleAr: "معالجات ARM - الأساسيات",
        titleEn: "ARM Processors - Basics",
        type: "video",
        durationMinutes: 30,
        xpReward: 100,
        order: 5,
      },
      {
        pathId: roboticsPath.id,
        titleAr: "برمجة الذراع الصناعي",
        titleEn: "Industrial Arm Programming",
        type: "video",
        durationMinutes: 35,
        xpReward: 100,
        order: 6,
      },
      {
        pathId: roboticsPath.id,
        titleAr: "اختبار مرحلي",
        titleEn: "Mid-term Quiz",
        type: "quiz",
        durationMinutes: 15,
        xpReward: 100,
        order: 7,
      },
      {
        pathId: roboticsPath.id,
        titleAr: "محاكاة: ذراع روبوت صناعي",
        titleEn: "Simulation: Industrial Robot Arm",
        type: "simulation",
        durationMinutes: 40,
        xpReward: 200,
        order: 8,
      },
    ]);
  }

  /* ================================================================ */
  /*  3. Seed a demo user                                              */
  /* ================================================================ */
  console.log("Inserting demo user...");

  await db.insert(users).values([
    {
      unionId: "demo_user_001",
      name: "متعلم تجريبي",
      email: "demo@electrohub.com",
      avatar: null,
      role: "user",
      xp: 1850,
      level: 2,
    },
  ]);

  console.log("Seed complete!");
  console.log(`- ${allPaths.length} paths inserted`);
  console.log("- 29 lessons inserted (6 + 8 + 7 + 8)");
  console.log("- 1 demo user inserted");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
