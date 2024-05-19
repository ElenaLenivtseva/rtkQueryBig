import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const api = createApi({
    baseQuery: fetchBaseQuery({baseUrl: '/api'}),
    endpoints: (builder) => ({
        getServices: builder.query({
            query: () => '/services',
        }),
        getService: builder.query({
            query: (id) => '/services/' + id
        }),
        makeContact: builder.mutation({
            query: (body) => ({
                url: 'contact',
                method: 'POST',
                body
            })
        }),
        getDogs: builder.query({
            query: () => '/dogs',
            transformResponse: (dogs) => {
                const allDogs = {};
                for (const id in dogs) {
                    const dog = dogs[id];
                    allDogs[id] = {
                        ...dog,
                        size: getSize(dog.weight),
                        age: getAge(dog.dob)
                    }
                }
                return allDogs
            }
        }),
    }),
})

export const {useGetServicesQuery, useGetServiceQuery, useMakeContactMutation, useGetDogsQuery} = api;
