import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Map,
  ChevronDown,
  ChevronUp,
  Lock,
  Star,
  TrendingUp,
  Award,
  PlayCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SkillData {
  name: string;
  value: number;
}

interface RoadmapStage {
  id: number;
  name: string;
  description: string;
  status: "completed" | "current" | "locked";
  topics: { name: string; locked: boolean }[];
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockDashboard = {
  level: 5,
  xpProgress: 65,
  xp: 1250,
  currentXp: 1250,
  nextXp: 2000,
  levelLabel: "متوسط",
  overallProgress: 72,
  totalCourses: 12,
  totalCompletedCourses: 8,
  totalStudyHours: 48,
  skills: [
    { name: "PLC", value: 85 },
    { name: "Electronics", value: 70 },
    { name: "Robotics", value: 60 },
    { name: "SCADA", value: 45 },
    { name: "HMI", value: 55 },
  ],
  pathProgress: [
    { name: "PLC Basics", progressPercent: 85 },
    { name: "Power Electronics", progressPercent: 60 },
    { name: "Industrial Robotics", progressPercent: 40 },
    { name: "SCADA Systems", progressPercent: 25 },
  ],
  roadmap: [
    {
      id: 1,
      name: "Electronics Fundamentals",
      description: "Learn basic electronics and circuit design",
      status: "completed" as const,
      topics: [
        { name: "Ohm's Law", locked: false },
        { name: "Circuit Analysis", locked: false },
        { name: "Digital Logic", locked: false },
      ],
    },
    {
      id: 2,
      name: "PLC Programming",
      description: "Master PLC programming fundamentals",
      status: "current" as const,
      topics: [
        { name: "Ladder Logic", locked: false },
        { name: "Timers & Counters", locked: false },
        { name: "Advanced PLC", locked: true },
      ],
    },
    {
      id: 3,
      name: "Industrial Robotics",
      description: "Program and operate industrial robots",
      status: "locked" as const,
      topics: [
        { name: "Robot Kinematics", locked: true },
        { name: "Programming", locked: true },
        { name: "Integration", locked: true },
      ],
    },
  ],
  activities: [
    {
      id: 1,
      text: "Completed PLC Basics Lesson 5",
      time: "2025-01-15T10:30:00",
      color: "#006D77",
    },
    {
      id: 2,
      text: "Earned 50 XP points",
      time: "2025-01-15T09:15:00",
      color: "#E9C46A",
    },
    {
      id: 3,
      text: "Started Power Electronics course",
      time: "2025-01-14T14:00:00",
      color: "#0D1B2A",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const AnimatedNumber: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
}> = ({ value, duration = 800, suffix = "" }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * value);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className="font-mono-tech">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

const LevelBadge: React.FC<{ level: number; progress: number }> = ({
  level,
  progress,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-44 h-44 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(#006D77 ${animatedProgress * 3.6}deg, #E5E5E5 0deg)`,
          transition: "background 1.2s ease-out",
        }}
      >
        <div className="w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
          <span className="text-5xl font-extrabold text-[#1A1A1A] font-mono-tech">
            {level}
          </span>
        </div>
      </div>
      <span className="text-sm text-[#1A1A1A]/50 font-medium">Level</span>
    </div>
  );
};

const ProgressRing: React.FC<{ progress: number; size?: number }> = ({
  progress,
  size = 160,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 200);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex flex-col items-center gap-2 relative">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E5E5"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#006D77"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${(animatedProgress / 100) * circumference} ${circumference}`}
          style={{ transition: "stroke-dasharray 1s ease-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-bold text-[#1A1A1A] font-mono-tech">
          {animatedProgress}%
        </span>
      </div>
      <span className="text-xs text-[#1A1A1A]/50 mt-1">Overall Progress</span>
    </div>
  );
};

const RadarChart: React.FC<{ skills: SkillData[] }> = ({ skills }) => {
  const size = 220;
  const center = size / 2;
  const maxRadius = 80;
  const levels = 4;

  const angleFor = (i: number) => (Math.PI * 2 * i) / 5 - Math.PI / 2;

  const pointFor = (i: number, value: number) => {
    const angle = angleFor(i);
    const r = (value / 100) * maxRadius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const gridPolygons = useMemo(() => {
    const polygons = [];
    for (let l = 1; l <= levels; l++) {
      const points = [];
      for (let i = 0; i < 5; i++) {
        const p = pointFor(i, (l / levels) * 100);
        points.push(`${p.x},${p.y}`);
      }
      polygons.push(points.join(" "));
    }
    return polygons;
  }, []);

  const dataPoints = useMemo(() => {
    return skills.map((s, i) => pointFor(i, s.value));
  }, [skills]);

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const labelPositions = useMemo(() => {
    return skills.map((s, i) => {
      const angle = angleFor(i);
      const r = maxRadius + 22;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        name: s.name,
      };
    });
  }, [skills]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size + 20} viewBox={`0 0 ${size} ${size + 20}`}>
        {gridPolygons.map((points, idx) => (
          <polygon
            key={idx}
            points={points}
            fill="none"
            stroke="#E5E5E5"
            strokeWidth={1}
          />
        ))}
        <polygon
          points={dataPolygon}
          fill="rgba(0,109,119,0.15)"
          stroke="#006D77"
          strokeWidth={2}
          style={{ transition: "all 0.8s ease-out" }}
        />
        {dataPoints.map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r={5} fill="#006D77" />
        ))}
        {labelPositions.map((l, idx) => (
          <text
            key={idx}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[11px] fill-[#1A1A1A]/50"
            style={{ fontSize: 11, fontFamily: "Cairo, sans-serif" }}
          >
            {l.name}
          </text>
        ))}
      </svg>
    </div>
  );
};

const RoadmapStageCard: React.FC<{
  stage: RoadmapStage;
  index: number;
  isLast: boolean;
}> = ({ stage, index, isLast }) => {
  const [open, setOpen] = useState(stage.status === "current");

  const iconBg =
    stage.status === "completed"
      ? "bg-[#006D77] text-white"
      : stage.status === "current"
        ? "bg-white border-2 border-[#006D77] text-[#006D77]"
        : "bg-[#E5E5E5] text-[#1A1A1A]/30";

  const nameColor =
    stage.status === "completed"
      ? "text-[#1A1A1A]"
      : stage.status === "current"
        ? "text-[#006D77]"
        : "text-[#1A1A1A]/30";

  const lineColor = stage.status === "completed" ? "#006D77" : "#E5E5E5";

  const badge =
    stage.status === "completed" ? (
      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-medium">
        Completed
      </span>
    ) : stage.status === "current" ? (
      <span className="px-2 py-0.5 rounded-full bg-[#006D77]/10 text-[#006D77] text-[10px] font-medium">
        In Progress
      </span>
    ) : (
      <span className="px-2 py-0.5 rounded-full bg-[#E5E5E5] text-[#1A1A1A]/30 text-[10px] font-medium">
        Locked
      </span>
    );

  return (
    <div className="relative flex gap-4" style={{ animationDelay: `${index * 100}ms` }}>
      {!isLast && (
        <div
          className="absolute w-0.5"
          style={{
            top: 40,
            right: 19,
            height: "calc(100% - 20px)",
            backgroundColor: lineColor,
          }}
        />
      )}

      <div className="relative z-10 shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} transition-all duration-300`}
        >
          {stage.status === "locked" ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Star className="w-4 h-4" />
          )}
        </div>
        {stage.status === "current" && (
          <div className="absolute inset-0 rounded-full border-2 border-[#006D77]/30 animate-ping" />
        )}
      </div>

      <div className="flex-1 min-w-0 pb-4">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between gap-2 text-right hover:bg-[#FDFBF5] rounded-xl p-2 -m-2 transition-colors">
              <div className="flex items-center gap-2">
                {badge}
                <h4 className={`font-semibold text-base ${nameColor}`}>
                  {stage.name}
                </h4>
              </div>
              {open ? (
                <ChevronUp className="w-4 h-4 text-[#1A1A1A]/30 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#1A1A1A]/30 shrink-0" />
              )}
            </button>
          </CollapsibleTrigger>

          <p className="text-xs text-[#1A1A1A]/50 mt-1 px-2">
            {stage.description}
          </p>

          <CollapsibleContent className="mt-3 space-y-2">
            {stage.topics.map((topic, tIdx) => (
              <div
                key={tIdx}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#FDFBF5] border border-[#E5E5E5] hover:bg-[#006D77]/5 transition-colors cursor-default"
              >
                <BookOpen className="w-4 h-4 text-[#006D77]/60 shrink-0" />
                <span className="text-sm text-[#1A1A1A]/70 flex-1">
                  {topic.name}
                </span>
                {topic.locked ? (
                  <Lock className="w-3.5 h-3.5 text-[#1A1A1A]/20" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                )}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                     */
/* ------------------------------------------------------------------ */

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';

  const dashboard = mockDashboard;

  /* ---- entrance animation state ---- */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const userName = "Ahmed";

  return (
    <div className="min-h-screen pt-20 pb-12 bg-[#FDFBF5] relative overflow-hidden" dir={direction}>
      {/* Decorative background blobs */}
      <div
        className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,109,119,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,109,119,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Level Hero */}
        <section
          className={`mb-8 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left — Level Badge */}
              <div className="flex justify-center">
                <LevelBadge
                  level={dashboard.level}
                  progress={dashboard.xpProgress}
                />
              </div>

              {/* Center — Welcome + XP + Stats */}
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#1A1A1A]">
                    {t('dashboardPage.welcome')}, {userName}!
                  </h1>
                  <p className="text-sm text-[#1A1A1A]/50 mt-1">
                    {t('dashboardPage.trackProgress')}
                  </p>
                </div>

                {/* XP Badge */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E9C46A]/20">
                    <Zap className="w-5 h-5 text-[#B8860B]" />
                    <span className="font-mono-tech font-bold text-[#B8860B] text-lg">
                      <AnimatedNumber value={dashboard.xp} />
                    </span>
                    <span className="text-xs text-[#B8860B]/70">
                      {t('dashboardPage.xpPoints')}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#006D77]/10 text-[#006D77] text-sm font-medium">
                    {dashboard.levelLabel}
                  </span>
                </div>

                {/* XP Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#1A1A1A]/40 mb-1">
                    <span>{dashboard.currentXp} XP</span>
                    <span>{dashboard.nextXp} XP</span>
                  </div>
                  <div className="h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#006D77]"
                      style={{
                        width: `${dashboard.xpProgress}%`,
                        transition: "width 1.2s ease-out",
                      }}
                    />
                  </div>
                </div>

                {/* Mini Stat Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#FDFBF5] rounded-xl border border-[#E5E5E5] p-3 text-center">
                    <BookOpen className="w-5 h-5 text-[#006D77] mx-auto mb-1" />
                    <span className="text-xs text-[#1A1A1A]/50 block">
                      {t('courses')}
                    </span>
                    <span className="font-mono-tech font-bold text-[#1A1A1A]">
                      <AnimatedNumber value={dashboard.totalCourses} />
                    </span>
                  </div>
                  <div className="bg-[#FDFBF5] rounded-xl border border-[#E5E5E5] p-3 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <span className="text-xs text-[#1A1A1A]/50 block">
                      {t('completed')}
                    </span>
                    <span className="font-mono-tech font-bold text-[#1A1A1A]">
                      <AnimatedNumber value={dashboard.totalCompletedCourses} />
                    </span>
                  </div>
                  <div className="bg-[#FDFBF5] rounded-xl border border-[#E5E5E5] p-3 text-center">
                    <Clock className="w-5 h-5 text-[#F59E0B] mx-auto mb-1" />
                    <span className="text-xs text-[#1A1A1A]/50 block">
                      {t('hours')}
                    </span>
                    <span className="font-mono-tech font-bold text-[#1A1A1A]">
                      <AnimatedNumber value={dashboard.totalStudyHours} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — Overall Progress Ring */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <ProgressRing progress={dashboard.overallProgress} />
                </div>

                <div className="w-full max-w-[200px] space-y-2">
                  {dashboard.pathProgress.map((c, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-[#1A1A1A]/60 truncate">
                          {c.name}
                        </span>
                        <span className="font-mono-tech text-[#006D77]">
                          {c.progressPercent}%
                        </span>
                      </div>
                      <div className="h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#006D77] rounded-full"
                          style={{
                            width: `${c.progressPercent}%`,
                            transition: "width 1s ease-out",
                            transitionDelay: `${0.3 + idx * 0.15}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skill Breakdown + Roadmap */}
        <section
          className={`grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 transition-all duration-500 delay-150 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Left — Skill Breakdown (2/5) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-5 h-5 text-[#006D77]" />
                <h2 className="text-lg font-semibold text-[#1A1A1A]">
                  {t('dashboardPage.skillAnalysis')}
                </h2>
              </div>
              <p className="text-xs text-[#1A1A1A]/50 mb-4">
                {t('dashboardPage.skillAnalysisDesc')}
              </p>

              <RadarChart skills={dashboard.skills} />

              <div className="mt-5 space-y-3">
                {dashboard.skills.map((skill, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#1A1A1A]/70">{skill.name}</span>
                      <span className="font-mono-tech text-[#006D77]">
                        {skill.value}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#006D77] rounded-full"
                        style={{
                          width: `${skill.value}%`,
                          transition: "width 0.8s ease-out",
                          transitionDelay: `${0.5 + idx * 0.1}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Learning Roadmap (3/5) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <Map className="w-5 h-5 text-[#006D77]" />
                <h2 className="text-lg font-semibold text-[#1A1A1A]">
                  {t('roadmap')}
                </h2>
              </div>
              <p className="text-xs text-[#1A1A1A]/50 mb-5">
                {t('dashboardPage.roadmapDesc')}
              </p>

              <div className="space-y-1 pr-2">
                {dashboard.roadmap.map((stage, idx) => (
                  <RoadmapStageCard
                    key={stage.id}
                    stage={stage}
                    index={idx}
                    isLast={idx === dashboard.roadmap.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activity + Quick Actions */}
        <section
          className={`grid grid-cols-1 lg:grid-cols-5 gap-6 transition-all duration-500 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Left — Activity Timeline (3/5) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-5 h-5 text-[#006D77]" />
                <h2 className="text-lg font-semibold text-[#1A1A1A]">
                  {t('dashboardPage.recentActivities')}
                </h2>
              </div>

              <div className="relative pr-4">
                <div className="absolute right-[7px] top-2 bottom-2 w-0.5 bg-[#E5E5E5]" />

                <div className="space-y-5">
                  {dashboard.activities.length > 0 ? (
                    dashboard.activities.map((activity, idx) => (
                      <div
                        key={activity.id}
                        className="relative flex gap-3 items-start"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div
                          className="relative z-10 w-4 h-4 rounded-full mt-1 shrink-0 border-2 border-white shadow-sm"
                          style={{ backgroundColor: activity.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#1A1A1A] leading-relaxed">
                            {activity.text}
                          </p>
                          <span className="text-[11px] text-[#1A1A1A]/40">
                            {new Date(activity.time).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#1A1A1A]/40 text-sm">
                      {t('dashboardPage.noActivities')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Quick Actions (2/5) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-5 h-5 text-[#006D77]" />
                <h2 className="text-lg font-semibold text-[#1A1A1A]">
                  {t('quickActions')}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: PlayCircle,
                    label: t('dashboardPage.continueLearning'),
                    action: () => {
                      const currentPath = dashboard.pathProgress.find(
                        (p) => p.progressPercent < 100
                      );
                      if (currentPath) {
                        alert(`${t('dashboardPage.continueIn')}: ${currentPath.name}`);
                      }
                    },
                    color: "#006D77",
                  },
                  {
                    icon: Award,
                    label: t('dashboardPage.completeLesson'),
                    action: () => {
                      const lessonToComplete = dashboard.roadmap[0]?.topics[0];
                      if (lessonToComplete) {
                        alert(t('dashboardPage.completingLesson'));
                      }
                    },
                    color: "#B8860B",
                  },
                  {
                    icon: TrendingUp,
                    label: t('dashboardPage.viewPaths'),
                    action: () => {
                      alert(t('dashboardPage.allPaths'));
                    },
                    color: "#006D77",
                  },
                  {
                    icon: BookOpen,
                    label: t('dashboardPage.interactiveSim'),
                    action: () => {
                      alert(t('dashboardPage.openSim'));
                    },
                    color: "#006D77",
                  },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.action}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E5E5E5] bg-[#FDFBF5] hover:bg-[#006D77]/5 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200"
                  >
                    <action.icon
                      className="w-6 h-6"
                      style={{ color: action.color }}
                    />
                    <span className="text-xs text-[#1A1A1A]/70 text-center leading-tight">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
