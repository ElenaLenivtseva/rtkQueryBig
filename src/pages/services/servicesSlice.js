import { createSlice, createSelector } from "@reduxjs/toolkit";
import {api} from '../../apiSlice'

const initialState = {
  loading: false,
  hasServices: false,
  services: [],
};

export const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    servicesLoading: (state) => {
      state.loading = true;
    },
    servicesReceived: (state, action) => {
      state.loading = false;
      state.hasServices = true;
      state.services = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { servicesLoading, servicesReceived } = servicesSlice.actions;

export default servicesSlice.reducer;


export const getServicesForLuckyDog = createSelector(
  api.endpoints.getServices.select(),
  api.endpoints.getDogs.select(),
  (state) => state.dogs.luckyDogs,
  ({data: services}, {data: myDogs}, luckyDog) => {
    const dog = myDogs?.[luckyDog];
  if (!dog) {
    return services;
  }

  // filter the services shown based on the currently chosen dog
  return services
    .filter(({ restrictions }) => {
      return restrictions.minAge ? dog.age >= restrictions.minAge : true;
    })
    .filter(({ restrictions }) => {
      return restrictions.breed ? restrictions.breed.includes(dog.breed) : true;
    })
    .filter(({ restrictions }) => {
      return restrictions.breed ? restrictions.size.includes(dog.size) : true;
    });
  }
  
)


export const getServiceById = (state, serviceId) => {
  return state.services.services.find((service) => service.id === serviceId);
};
