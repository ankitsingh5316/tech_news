// context creation
// provider
// consumer length remove useContext hooks
// useContext hooks
import React, {useContext, useReducer, useEffect} from "react";
import reducer from "./reducer"

let API = "http://hn.algolia.com/api/v1/search?";

const initialState = {
     isLoading: true,
    query: "html",
    nbPage: 0,
    page: 0,
    hits: [],
};



const AppContext = React.createContext();

// to create a provider function
const Appprovider = ({ children }) => {

    //const [state, setstate] = useState(initialState);

    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchApiData = async (URL) => {

      dispatch( {type: "SET_LOADING"});

       try {
           const res = await fetch(URL);
           const data = await res.json();
           console.log(data);
           dispatch({type:"GET_STORIES",
            payload: {
                hits: data.hits,
                nbPages: data.nbPages,
            },
        });
         //  isLoading = false;
       } catch (error) {
           console.log(error);
       }
    };
    // to remove the post
        const removePost =  (post_ID) => {
            dispatch ({ type: "REMOVE_POST", payload: post_ID});
        };

        //search

        const searchPost = (searchQuery) => {
            dispatch({
                type: "SEARCH_QUERY",
                payload: searchQuery,
            });
        };

        //pagination

        const getNextPage = () => {
            dispatch({
                type: "NEXT_PAGE",
            });
        };
        const getPrevPage = () => {
            dispatch({
                type: "PREV_PAGE",
            });
        };

// TO CALL TECH API FUNCTION
        useEffect (() => {
            fetchApiData(`${API}query=${state.query}&page=${state.page}`);
        }, [state.query, state.page]);

        return (
            <AppContext.Provider 
            value={{...state, removePost,searchPost, getNextPage, getPrevPage}}>
            {children}
            </AppContext.Provider>
        );
};

// custome hook create
const useGlobalContext = () => {
    return  useContext(AppContext);
};

export {  AppContext, Appprovider, useGlobalContext };