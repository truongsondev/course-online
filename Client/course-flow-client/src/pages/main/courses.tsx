import { useEffect, useState, type FunctionComponent } from "react";
import HeaderPage from "@/components/pages/header";
import SliderPage from "@/components/pages/slider";
import ListCourses from "@/components/pages/list-courses";
import type { CourseResponse } from "@/dto/response/course.response.dto";
import courseService from "@/services/course.service";
import CourseLoading from "@/components/loads/course-loading";
interface HomeProps {}

const Courses: FunctionComponent<HomeProps> = () => {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourese = async () => {
      try {
        setLoading(true);

        const res = await courseService.getCourseList();

        const couresesRes = res.data?.data;
        setCourses(couresesRes);
        setLoading(false);
        console.log(loading);
      } catch (e) {
        setLoading(false);
        console.log(loading);
      }
    };
    fetchCourese();
  }, []);
  return (
    <div className="flex flex-col items-start justify-start h-screen w-full gap-4">
      <div className="w-full">
        <HeaderPage />
      </div>
      <div className="w-full h-auto mt-4 ">
        <SliderPage />
      </div>
      {loading ? (
        <div className="flex flex-wrap items-start gap-4 max-sm:justify-center">
          {Array.from({ length: 8 }).map((_) => (
            <CourseLoading></CourseLoading>
          ))}
        </div>
      ) : (
        <ListCourses courses={courses} />
      )}
    </div>
  );
};

export default Courses;
