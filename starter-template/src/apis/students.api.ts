import { Student } from 'types/student.type'
import http from 'utils/http'

export const getStudents = (page: number | string, limit: number | string, signal?: AbortSignal) => {
  return http.get(`students`, { params: { _page: page, _limit: limit }, signal })
}

export const getStudent = (id: string) => {
  return http.get<Student>(`students/${id}`)
}

export const addStudent = (student: Omit<Student, 'id'>) => {
  return http.post<Student>(`students`, student)
}

export const updateStudent = (id: string, student: Student) => {
  return http.put<Student>(`students/${id}`, student)
}

export const deleteStudent = (id: string | number) => {
  return http.delete<{}>(`students/${id}`)
}
