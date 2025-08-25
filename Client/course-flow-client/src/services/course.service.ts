import type { ApiResponse } from "@/dto/response/auth.response.dto";
import { endpoint } from "../constants/shared.constant";
import { EndpointService } from "./endpoint.service";
import type { CourseResponse } from "@/dto/response/course.response.dto";
class CourseService {
  private static instance: CourseService;

  //singleton pattern
  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  /** get API for all course */
  public getCourseList() {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.course.v1.getAll;
    return endpointService.getEndpoint<ApiResponse<CourseResponse[]>>(url);
  }
}

const courseService = CourseService.getInstance();
export default courseService;
