import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudent, getStudents } from 'apis/students.api'
import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Student, typeStudents } from 'types/student.type'
import { useQueryString } from 'utils/utils'

const LIMIT = 10
export default function Students() {
  // ======================= cach 1: hay lam, de su dung nhat nhung khong hay ====================
  // const [students, setStudents] = useState<typeStudents[]>([])
  // const [isLoading, setIsLoading] = useState<boolean>(false)

  // useEffect(() => {
  //   setIsLoading(true)
  //   getStudents(1, 10)
  //     .then((res: any) => {
  //       setStudents(res.data)
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [])

  // ==================== cach 2: sd useQuery =====================
  const queryString: { page?: string } = useQueryString() // watch query url
  const page = Number(queryString.page) || 1
  const queryClient = useQueryClient()

  // cả queryString và queryClient đều quan sát url vd: { page: '3' }
  console.log('queryClient là gì', queryString)

  const studentsQuery = useQuery({
    queryKey: ['students', page],
    queryFn: () => {
      const controller = new AbortController()
      // sau 1 khoảng time tự huỷ
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return getStudents(page, LIMIT, controller.signal)
    },
    // staleTime: 60 * 1000,
    // cacheTime: 5 * 1000
    keepPreviousData: true,
    retry: 0
  })
  const totalStudentCount = Number(studentsQuery.data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalStudentCount / LIMIT)

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string | number) => {
      return deleteStudent(id)
    },
    onSuccess: (_, id) => {
      toast.success(`Delete successfully item ${id}`)
      // thêm exact vào để chính xác hơn
      queryClient.invalidateQueries({ queryKey: ['students', page], exact: true })
    }
  })

  const handleDelete = (id: number) => {
    deleteStudentMutation.mutate(id)
  }

  const handlePrefetchStudent = (id: number) => {
    // queryClient.prefetchQuery(['student', String(id)], {
    //   queryFn: () => getStudent(id as unknown as string),
    //   staleTime: 3 * 1000
    // })
  }

  const fetchStudent = (second: number) => {
    const id = '7'
    queryClient.prefetchQuery(['student', String(id)], {
      queryFn: () => getStudent(id as unknown as string),
      staleTime: second * 1000
    })
  }

  const refetchStudents = () => {
    studentsQuery.refetch()
  }

  const cancelStudents = () => {
    queryClient.cancelQueries({ queryKey: ['students', page] })
  }
  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div>
        <button className='mt-5 bg-blue-500 px-5 py-2 text-white' onClick={() => fetchStudent(10)}>
          Click 10s
        </button>
      </div>
      <div>
        <button className='mt-5 bg-blue-500 px-5 py-2 text-white' onClick={() => fetchStudent(2)}>
          Click 2s
        </button>
      </div>
      <div>
        <button className='mt-5 bg-pink-500 px-5 py-2 text-white' onClick={cancelStudents}>
          Refetch Students
        </button>
      </div>
      <div>
        <button className='mt-5 bg-pink-500 px-5 py-2 text-white' onClick={refetchStudents}>
          Cancel Request Students
        </button>
      </div>
      <Link
        to={'/students/add'}
        type='button'
        className='mt-6 rounded-lg border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200'
      >
        Add Student
      </Link>
      {studentsQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}

      {!studentsQuery.isLoading && (
        <Fragment>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsQuery.data?.data?.map((std: Student, i: number) => (
                  <tr
                    key={std.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                    onMouseEnter={() => handlePrefetchStudent(std.id)}
                  >
                    <td className='py-4 px-6'>{std.id}</td>
                    <td className='py-4 px-6'>
                      <img src={std?.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {std?.last_name}
                    </th>
                    <td className='py-4 px-6'>{std?.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link
                        to={`/students/${std.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        className='font-medium text-red-600 dark:text-red-500'
                        onClick={() => handleDelete(std.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Previous
                    </span>
                  ) : (
                    <Link
                      to={`/students?page=${page - 1}`}
                      className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = page === pageNumber
                    return (
                      <li key={index}>
                        <Link
                          className={classNames(
                            `border border-gray-300 py-2 px-3 leading-tight  hover:bg-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:text-gray-700`,
                            {
                              'bg-gray-200 text-gray-700': isActive,
                              'bg-white text-gray-500': !isActive
                            }
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}

                <li>
                  {page === totalPage ? (
                    <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Next
                    </span>
                  ) : (
                    <Link
                      to={`/students?page=${page + 1}`}
                      className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </Fragment>
      )}
    </div>
  )
}
