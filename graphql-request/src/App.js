import './App.css'
import React from 'react';
import { gql, request } from 'graphql-request';
import { useInfiniteQuery } from '@tanstack/react-query';

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      results {
        id
        name
        status
        species
      }
    }
  }
`;

const queryKey = ['films'];

const queryFn = async ({ pageParam = 1 }) => {
    const vars = { page: pageParam };
    const url =   'https://rickandmortyapi.com/graphql/';
    const response = await request( url, GET_CHARACTERS, vars);
    return response?.characters?.results;
}

const getNextPageParam = (lastPage) => {
    // Return the next page number or null if there are no more pages
    const currentPage = Number(lastPage[lastPage.length - 1]?.id);
    return currentPage ? currentPage + 1 : null;
}

function App() {
  const  { isLoading, isError, data, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({queryKey, queryFn, getNextPageParam})

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div>
      <h2>Rick and Morty Characters</h2>
      <ol type="1">
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.map((character) => (
              <li key={character.id}>
                <strong>{character.name}</strong> ({character.status}, {character.species})
              </li>
            ))}
          </React.Fragment>
        ))}
      </ol>
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )}
    </div>
  )
}

export default App
