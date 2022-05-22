const initialState = {
    currentUser: {
        email: '',
        fullName: '',
        avatar: '',
        userId: '',
    }
};
const userReducer = (state = initialState, action) => {
    switch (action.type) {

        case "LOGIN": {
            console.log({
                ...state,
                currentUser: action.payload,
            })
            return {
                ...state,
                currentUser: action.payload,
            };
        }

        case "UPDATE_FULLNAME": {
            console.log({
                ...state,
                currentUser: {...state.currentUser, fullName: action.payload.fullName},
            })
            return {
                ...state,
                currentUser: {...state.currentUser, fullName: action.payload.fullName},
            };
        }

        case "LOGOUT": {
            return {
                ...state,
                currentUser: {},
            };
        }

        default: {
            return state;
        }
    }
};
  
export default userReducer;
  