#### step by step

- yarn add @tanstack/react-query

- index.tsx -> `const queryClient = new QueryClient()`

  - ` <React.StrictMode> <BrowserRouter> <QueryClientProvider client={queryClient}> <App /> </QueryClientProvider> </BrowserRouter> </React.StrictMode>`

- handle at students
  `const queryString: { page?: string } = useQueryString() const page = Number(queryString.page) || 1 const { data, isLoading } = useQuery({ queryKey: ['students', page], queryFn: () => getStudents(page, 10) })`

- yarn add @tanstack/react-query-devtools

### isLoading : trạng thái của data

### isFetching: trạng thái load api
