import axiosClient from "./axiosClient"

const authorApi = {

    getAll: ({page, limit}) => {
        const url = 'authors/'
        return axiosClient.get(url, { params: {page, limit}})
    }

   
}

export default authorApi