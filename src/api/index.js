import axios from 'axios'

const API_BASE_URL = '/api'

// 用户相关API
export const fetchServices = () => axios.get(`${API_BASE_URL}/services`)

export const fetchTimeSlots = (serviceId, date) => 
  axios.get(`${API_BASE_URL}/time-slots/${serviceId}/${date}`)

export const createBooking = (bookingData) => 
  axios.post(`${API_BASE_URL}/bookings`, bookingData)

export const processPayment = (paymentData) => 
  axios.post(`${API_BASE_URL}/payments`, paymentData)

// 管理员相关API
export const adminFetchTimeSlots = () => 
  axios.get(`${API_BASE_URL}/admin/time-slots`)

export const adminCreateTimeSlot = (timeSlotData) => 
  axios.post(`${API_BASE_URL}/admin/time-slots`, timeSlotData)

export const adminDeleteTimeSlot = (timeSlotId) => 
  axios.delete(`${API_BASE_URL}/admin/time-slots/${timeSlotId}`)

export const adminFetchServices = () => 
  axios.get(`${API_BASE_URL}/admin/services`)

export const adminCreateService = (serviceData) => 
  axios.post(`${API_BASE_URL}/admin/services`, serviceData)

export const adminDeleteService = (serviceId) => 
  axios.delete(`${API_BASE_URL}/admin/services/${serviceId}`)  