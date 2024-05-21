import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ["Services", "Dogs"],
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/services",
    }),
    getService: builder.query({
      query: (id) => "/services/" + id,
    }),
    makeContact: builder.mutation({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),
    getDogs: builder.query({
      query: () => "/dogs",
      transformResponse: (dogs) => {
        const allDogs = {};
        for (const id in dogs) {
          const dog = dogs[id];
          allDogs[id] = {
            ...dog,
            size: getSize(dog.weight),
            age: getAge(dog.dob),
          };
        }
        return allDogs;
      },
      providesTags: ["Dogs"],
    }),
    addDog: builder.mutation({
      query: (body) => ({
        url: "/dogs",
        method: "POST",
        body,
      }),
    }),
    invalidatesTags: ["Dogs"],
  }),
  removeDog: builder.mutation({
    query: (id) => ({
      url: "/dogs/" + id,
      method: "DELETE",
    }),
    invalidatesTags: ["Dogs"],
    onQueryStarted(id, {dispatch, queryFullfilled}){
       const update = dispatch(api.util.updateQueryData('getDogs', undefined, (dogs)=>{
            delete dogs[id]
        }));
        queryFullfilled.catch(()=>{
            update.undo()
        })
    }
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useMakeContactMutation,
  useGetDogsQuery,
  useAddDogMutation,
  useRemoveDogMutation
} = api;

export function getSize(weight) {
  weight = parseInt(weight, 10);
  if (weight <= 10) return "teacup";
  if (weight <= 25) return "small";
  if (weight <= 50) return "medium";
  if (weight <= 80) return "large";
  if (weight <= 125) return "x-large";
  return "jumbo";
}

const YEAR = 3.156e10;
export function getAge(dob) {
  const date = +new Date(dob);
  return Math.floor((Date.now() - date) / YEAR);
}
