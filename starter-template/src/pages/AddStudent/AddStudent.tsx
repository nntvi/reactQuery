import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addStudent, getStudent, updateStudent } from 'apis/students.api'
import { useEffect, useMemo, useState } from 'react'
import { useMatch, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Student } from 'types/student.type'
import { isAxiosError } from 'utils/utils'

type FormStateType = Omit<Student, 'id'> | Student
const initialFormState: FormStateType = {
  first_name: '',
  last_name: '',
  email: '',
  gender: 'other',
  country: '',
  avatar: '',
  btc_address: ''
}
type FormError =
  | {
      [key in keyof FormStateType]: string
    }
  | null

const gender = {
  male: 'Male',
  female: 'Female',
  other: 'Other'
}
export default function AddStudent() {
  const addMatch = useMatch('/students/add')
  const isAddMode = Boolean(addMatch)
  const [formState, setFormState] = useState<FormStateType>(initialFormState)
  const { id } = useParams()
  const queryClient = useQueryClient()

  const addStudentMutation = useMutation({
    mutationFn: (body: FormStateType) => {
      return addStudent(body)
    }
  })

  const studentQuery = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudent(id as string),
    enabled: id !== undefined,
    staleTime: 5 * 1000
  })

  useEffect(() => {
    if (studentQuery.data) {
      setFormState(studentQuery.data.data)
    }
  }, [studentQuery.data])
  const updateStudentMutation = useMutation({
    mutationFn: (_) => {
      return updateStudent(id as string, formState as Student)
    },
    onSuccess: (data) => {
      queryClient.setQueriesData(['students', id], data)
    }
  })
  const errorForm: FormError = useMemo(() => {
    const error = isAddMode ? addStudentMutation.error : updateStudentMutation.error
    if (isAxiosError<{ error: FormError }>(error) && error.response?.status === 422) {
      return error.response?.data.error // T bên kia chính là data
    }
    return null
  }, [addStudentMutation.error, updateStudentMutation.error])

  const handleChange = (name: keyof FormStateType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: e.target.value }))
    if (addStudentMutation.data || addStudentMutation.error) {
      addStudentMutation.reset()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isAddMode) {
      addStudentMutation.mutate(formState, {
        onSuccess: () => {
          toast.success('Create successfully!')
          setFormState(initialFormState)
        }
      })
    } else {
      updateStudentMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success('Update successfully!')
        }
      })
    }
  }

  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? 'Add' : 'Edit'} Student</h1>
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            // type='email'
            name='floating_email'
            className='peer block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600'
            placeholder=' '
            required
            value={formState.email}
            onChange={handleChange('email')}
          />
          <label className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'>
            Email address
          </label>
          {errorForm && (
            <p className='mt-3 text-red-600'>
              <span className='font-medium'>{errorForm.email}</span>
            </p>
          )}
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div>
            <div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-1'
                  type='radio'
                  name='gender'
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  value={gender.male}
                  checked={formState.gender === gender.male}
                  onChange={handleChange('gender')}
                />
                <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Male
                </label>
              </div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-2'
                  type='radio'
                  name='gender'
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  value={gender.female}
                  checked={formState.gender === gender.female}
                  onChange={handleChange('gender')}
                />
                <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Female
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='gender-3'
                  type='radio'
                  name='gender'
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  value={gender.other}
                  checked={formState.gender === gender.other}
                  onChange={handleChange('gender')}
                />
                <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            className='peer block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
            placeholder=' '
            required
            value={formState.country}
            onChange={handleChange('country')}
          />
          <label className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'>
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='tel'
              // pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
              name='first_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
              value={formState.first_name}
              onChange={handleChange('first_name')}
            />
            <label className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'>
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 '
              placeholder=' '
              required
              value={formState.last_name}
              onChange={handleChange('last_name')}
            />
            <label className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'>
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
              value={formState.avatar}
              onChange={handleChange('avatar')}
            />
            <label className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'>
              Avatar Base64
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
              value={formState.btc_address}
              onChange={handleChange('btc_address')}
            />
            <label className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'>
              BTC Address
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
        >
          {isAddMode ? 'Add' : 'Update'}
        </button>
      </form>
    </div>
  )
}
