Please provide any comments you may have about your solution here.

Everything went well during the development , i had to take some architectural decisions to make things decoupled and easier to maintain.

For data fetching i wanted to manage the 3 states a network call can have: loading, success and error. in recent versions of react you can do it completely declarative using `Suspense` nad `ErrorBoundary` in this case as current react version doesn't have this i decided to implement a similar approach defining 2 more components that each of them manage one of the network states.
- *TransactionTable*: This is the component in charge of render the data when is ready.
- *TransactionTableSkeleton*: This is the component in charge of render the loading state, when no data available it shows a skeleton so we don't flash the screen (better UX in this case), when refetching data, this shows an overlay with a spinner.
- *TransactionTableError*: This is the component in charge of render the error state if the network request fails.


I also decided to create a custom `apiClient` that makes the network request and handles the retry logic in case of failure, this also log the error in case of failure to help debugging (in an ideal world we will send this to a analytics service).

Related to the form i decided to add `react-hook-form` it wasn't necessary at all because it could have been implemented with a simple `useState` but i think the validation process with `zod` in combination with `react-hook-form` i much more robust and easier to maintain.

I thought on adding an optimistic update to the table when new transaction added but UI felt very flickering because it had a lot of state changes:
- go to page
- loading indicator
- highlight

I decided to implement the refetching in the `useTransactions` hook because it's the one in charge of get the data, this refetch could be disabled as this gets a parameter with the refresh interval in milliseconds but if you use `0` it won't refetch.

In general i wanted to keep components without logic. The `repositories` folder is the one in charge of managing the data, this helps me to make components agnostic of the data source, component doesn't know if data comes from `redux`, `context`, `react-query` or a simple `useState`. This helps me to make components more reusable and easier to test. One improvement could be to extract the `useTransactions` from the `TransactionsTable` so this table would be just a simple presentation component and be reusable in other places but i wasn't sure if you wanted me to change the root structure of the components.

**Different approach**

If the project would use a newer react version the implementation from my side would be different, i would use a more declarative way for data fetching using `react-query` or `SWR` in combination with `Suspense` and `ErrorBoundary`. This is a more declarative way to handle data fetching that the one used that is an imperative approach. The current approach with `redux` could have **race conditions** this means that if we use some filtering system and we make 2 network requests (lets thing a search input, even with debounce), we could have the first network request resolved the second one (yeah sometimes SQL queries are faster when more precise search) so in this case you will have a response from the first request but the ui state is other. There are come options here as cancelling requests. But with libraries like `react-query` you resolve this problem by default and 0 boilerplate.  