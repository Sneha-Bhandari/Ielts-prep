import { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  PlayCircle,
  Clock,
  Play,
  SkipForward
} from "lucide-react";
import { useAppQuery } from "../../lib/react-query";
import type {
  IeltsCourse,
  Lesson,
  Section,
} from "../../interfaces/ielts.interface";

export default function StudentCoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: courses = [], isLoading: courseLoading } =
    useAppQuery<IeltsCourse[]>({
      url: "/ielts/",
      queryKey: ["ielts"],
    });

  const { data: sections = [], isLoading: sectionLoading } =
    useAppQuery<Section[]>({
      url: "/sections/",
      queryKey: ["sections"],
    });

  const { data: lessons = [], isLoading: lessonLoading } =
    useAppQuery<Lesson[]>({
      url: "/lessons/",
      queryKey: ["lessons"],
    });

  const selectedCourse = useMemo(() => {
    return courses.find(
      (course) => course.id === courseId
    );
  }, [courses, courseId]);

  const courseSections = useMemo(() => {
    return sections
      .filter(
        (section) =>
          section.ielts?.id === courseId
      )
      .sort((a, b) => a.orderNo - b.orderNo)
      .map((section) => ({
        ...section,
        lessons: lessons
          .filter(
            (lesson) =>
              lesson.section?.id === section.id
          )
          .sort((a, b) => a.order - b.order),
      }));
  }, [sections, lessons, courseId]);

  // Get all lessons in order
  const allLessons = useMemo(() => {
    return courseSections.flatMap(section => section.lessons);
  }, [courseSections]);

  const currentIndex = useMemo(() => {
    if (!selectedLesson) return -1;
    return allLessons.findIndex(lesson => lesson.id === selectedLesson.id);
  }, [allLessons, selectedLesson]);

  const nextLesson = useMemo(() => {
    if (currentIndex === -1 || currentIndex === allLessons.length - 1) return null;
    return allLessons[currentIndex + 1];
  }, [allLessons, currentIndex]);

  // Handle video time update to show next button when 10 seconds remaining
  const handleTimeUpdate = () => {
    if (!videoRef.current || !nextLesson) return;
    
    const currentTime = videoRef.current.currentTime;
    const duration = videoDuration || videoRef.current.duration;
    
    // Show next button when 10 seconds or less remaining
    if (duration - currentTime <= 10 && duration - currentTime > 0) {
      setShowNextButton(true);
    } else {
      setShowNextButton(false);
    }
  };

  // Set video duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    if (nextLesson) {
      setSelectedLesson(nextLesson);
      setShowNextButton(false);
    }
  };

  const handleNextClick = () => {
    if (nextLesson) {
      setSelectedLesson(nextLesson);
      setShowNextButton(false);
    }
  };

  // Reset showNextButton when lesson changes
  useEffect(() => {
    setShowNextButton(false);
    setVideoDuration(0);
  }, [selectedLesson]);

  useEffect(() => {
    if (
      !selectedLesson &&
      courseSections.length > 0 &&
      courseSections[0].lessons?.length
    ) {
      setSelectedLesson(
        courseSections[0].lessons[0]
      );
    }
  }, [courseSections, selectedLesson]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [selectedLesson]);

  if (
    courseLoading ||
    sectionLoading ||
    lessonLoading
  ) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-sm font-medium text-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased flex flex-col lg:flex-row max-w-[1750px] mx-auto p-4 lg:p-6 gap-6">
      
      {/* LEFT COLUMN: VIDEO & PRIMARY CONTENT */}
      <div className="flex-1 space-y-4">
        {selectedLesson ? (
          <div className="w-full">
            {/* YouTube Cinema Video Frame */}
            <div className="bg-black rounded-xl overflow-hidden shadow-sm aspect-video w-full max-h-[680px] relative">
              <video
                ref={videoRef}
                key={selectedLesson.id}
                controls
                autoPlay
                className="w-full h-full object-contain"
                src={selectedLesson.videoId?.url || ""}
                onEnded={handleVideoEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
              
              {/* Next Video Button Overlay - appears when 10 seconds remaining */}
              {nextLesson && showNextButton && (
                <button
                  onClick={handleNextClick}
                  className="absolute bottom-20 right-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:scale-105 font-medium text-sm animate-pulse"
                >
                  <span>Next Video</span>
                  <SkipForward size={18} />
                </button>
              )}
            </div>

            {/* Title Metadata */}
            <div className="mt-4 space-y-2">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight leading-snug">
                {selectedLesson.title}
              </h1>
              <div className="flex items-center text-sm text-slate-500 font-medium pb-2">
                <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 flex items-center gap-1.5 text-xs">
                  <Clock size={14} />
                  {selectedLesson.duration} minutes
                </span>
                {nextLesson && (
                  <span className="ml-3 text-xs text-indigo-600 font-medium">
                    Next: {nextLesson.title}
                  </span>
                )}
              </div>
            </div>

            {/* Video Description Box Container */}
            <div className="bg-slate-100 hover:bg-slate-200/70 transition-colors rounded-xl p-4 mt-4 text-sm">
              <h3 className="font-semibold text-slate-800 mb-1">Description</h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedLesson.content || "No metadata description provided for this lesson item."}
              </p>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-center p-6">
            <div className="space-y-3">
              <PlayCircle size={56} className="mx-auto text-slate-700 stroke-[1.5]" />
              <h2 className="text-lg font-semibold text-white">Select a lesson from the playlist queue</h2>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: YOUTUBE PLAYLIST COMPONENT */}
      <div className="w-full lg:w-[400px] xl:w-[420px] shrink-0">
        <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-3rem)] max-h-[820px] bg-slate-50">
          
          {/* Playlist Static Top Header */}
          <div className="p-4 bg-white border-b border-slate-200 space-y-1">
            <h2 className="font-bold text-base text-slate-900 line-clamp-1">
              {selectedCourse?.title}
            </h2>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {selectedCourse?.description}
            </p>
          </div>

          {/* Scrolling Sections Queue */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
            {courseSections.length === 0 ? (
              <div className="text-center py-12 text-xs font-medium text-slate-400 italic">
                No pipeline items found
              </div>
            ) : (
              courseSections.map((section) => (
                <div key={section.id} className="bg-white border border-slate-200/60 rounded-lg overflow-hidden shadow-2xs">
                  
                  {/* YouTube Section Dynamic Module */}
                  <div className="bg-slate-50 px-3 py-2.5 flex items-center justify-between border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 truncate">
                      {section.title}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                      {section.lessons?.length || 0} items
                    </span>
                  </div>

                  {/* Nested Lesson Play Rows */}
                  <div className="divide-y divide-slate-100">
                    {section.lessons?.length ? (
                      section.lessons.map((lesson) => {
                        const isCurrent = selectedLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full text-left p-3 flex gap-3 transition-colors items-start relative group ${
                              isCurrent 
                                ? "bg-slate-100 text-slate-900 font-semibold" 
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            {/* Visual Indicator Prefix Block */}
                            <div className="w-4 shrink-0 flex justify-center mt-0.5">
                              {isCurrent ? (
                                <Play size={12} className="text-slate-900 fill-slate-900 animate-pulse" />
                              ) : (
                                <BookOpen size={13} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                              )}
                            </div>

                            <div className="space-y-1 min-w-0 flex-1">
                              <p className={`text-xs leading-snug line-clamp-2 ${
                                isCurrent ? "font-semibold text-slate-900" : "font-medium text-slate-800"
                              }`}>
                                {lesson.title}
                              </p>
                              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                <span>{lesson.duration} min</span>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-3 text-[11px] font-medium text-slate-400 bg-slate-50/50 italic">
                        Empty workspace
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}