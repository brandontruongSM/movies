import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LeftArrow } from '@styled-icons/boxicons-solid/LeftArrow';
import { RightArrow } from '@styled-icons/boxicons-solid/RightArrow';
import movieType from '../../types';

import Card from '../Card';

const Container = styled.div`
  padding: 1em;
  @media (min-width: 1024px), { 
    flex-basis: 33.33%; 
  }
`;
const StyledUL = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const StyledLI = styled.li`
  margin: 1em 0;
`;
const SearchBox = styled.input`
  width: 100%;
  font-size: 1em;
  margin: 0.5em 0;
  box-sizing: border-box;
  padding: 1em;
  border: 1px solid grey;
  border-radius: 12px;
  outline: none;
`;

const Pagination = styled.div`
  display: flex;
  padding: 1em 0;
`;

const TotalResult = styled.div`
  flex-grow: 1;
  text-align: center;
`;

const StyledButton = styled.button`
  text-align: inherit;
  border: none;
  padding: 0;
  margin: 0;
  outline: none;
  cursor: pointer;
  background-color: #FFF;
`;

const MaxItemsPerPage = 10;

const Search = ({ moviesResult, movieSelected, doSearch }) => {
  const [selectedId, setSelectedId] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState();

  const { totalResults, Search: movies, Response, Error } = moviesResult;

  useEffect(() => {
    // if (!searchText) return;
    // doSearch(`&s=${searchText}&page=${pageNumber}`);
    doSearch(searchText, pageNumber);
  }, [searchText, pageNumber]);

  const onCardClicked = (imdbID) => () => {
    setSelectedId(imdbID);
    movieSelected(movies.find((movie) => movie.imdbID === imdbID));
  };

  const onSearchTextChanged = (event) => {
    setSearchText(event.target.value.trim());
  };

  const previousPage = () => {
    if (pageNumber <= 1) return;
    setPageNumber(pageNumber - 1);
  };

  const nextPage = () => {
    if ((pageNumber * MaxItemsPerPage) > totalResults) return;
    setPageNumber(pageNumber + 1);
  };

  return (
    <Container>
      <SearchBox type="text" name="search" aria-label="Search" onChange={onSearchTextChanged} />
      {(Response === 'False') && (<div>{Error}</div>)}
      { movies && (
        <StyledUL>
          { movies.map((movie) => (
            <StyledLI key={`movie-${movie.imdbID}`}>
              <Card title={movie.Title} year={movie.Year} imdbID={movie.imdbID} onClick={onCardClicked} isselected={movie.imdbID === selectedId} />
            </StyledLI>
          ))}
        </StyledUL>
      )}
      { (totalResults && totalResults > MaxItemsPerPage) && (
      <Pagination>
        <StyledButton onClick={previousPage}><LeftArrow width={20} /></StyledButton>
        <TotalResult>
          <div>
            {`Page ${pageNumber}`}
          </div>
          <div>{`${totalResults} result`}</div>
        </TotalResult>
        <StyledButton onClick={nextPage}><RightArrow width={20} /></StyledButton>
      </Pagination>
      )}

    </Container>
  );
};

Search.propTypes = {
  moviesResult: PropTypes.shape({
    totalResults: PropTypes.string.isRequired,
    Search: PropTypes.arrayOf(movieType).isRequired,
    Response: PropTypes.string.isRequired,
    Error: PropTypes.string,
  }).isRequired,
  movieSelected: PropTypes.func.isRequired,
  doSearch: PropTypes.func.isRequired,
};

export default Search;
