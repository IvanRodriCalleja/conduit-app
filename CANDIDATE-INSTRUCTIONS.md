
# Candidate Instructions

Conduit asks that every candidate for an engineering role complete a take-home exercise as a way of preparing for the technical interview. When you speak with our engineering team as part of the technical interview process, you will be asked to talk about your take-home exercise and to extend the code you wrote.

You will be working on an application to track financial transactions, adding missing logic and extending its features.

## General requirements

Prepare the solution as if you were coding for an actual application, having in mind extensibility and readability. Assume other developers will have to work on that code in the future.

* You may use any 3rd party packages should they be necessary to effectively meet task requirements,
* You are free to use external sources such as official documentation or Stack Overflow,
* You are expected to provide standard UX features, such as loading indicators or error display,
* Once you have completed the exercise, **push your solution to a GitHub repository** and share the link with us for review. Please ensure your repository includes all necessary files to run the project (e.g. `README.md`, `package.json`, etc.).

Should you have any comments about your implemented solution, please use the `CANDIDATE-COMMENTS.md` file to provide them.

## Required features

Features below are ordered by their importance for this assignment, starting from the highest.

### 1. Fetch and display the list of transactions

1. Transactions can be fetched by making a `GET` request to `/api/transactions`.
2. Fetched transactions should be displayed in the `TransactionsTable` table, ordered by their dates.
3. Dates should be displayed in a Y-m-d H:i format.
4. Transactions of negative values should have their amounts shown in red color.
5. Add display of optional `memo` field, between columns.

### 2. Add new transaction feature

1. It should be possible to add a new transaction entry using the `AddRecordForm` component.

2. Transactions can be added by making a `POST` request to `/api/transactions` containing JSON with the following attributes:

   ```js
   {
     amount: number;
     memo?: string;
     payee: string;
     timestamp: number;
   }
   ```

3. The form should clear after successful submission.

4. Newly added record should have its row background highlighted for 1s using `#f7ffe8` color.

5. Add optional `memo` field.

### 3. Periodically refresh the list of transactions

1. Make the list of transactions refresh every 5 seconds.
2. Show a clear indication that the list of transactions is refreshing.

### 4. Paginate the results

1. Show pagination allowing users to jump to the next and previous page of the results.
2. Limit the amount of results per page to 10.
3. When a new record is added, switch page to the one that includes it.
