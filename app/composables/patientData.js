import axios from 'axios'

export const usePatientData = () => {
  const users = ref([])
  const pending = ref(false)
  const error = ref(null)

  const fetchUsers = async () => {
    pending.value = true
    error.value = null
    try {
      const response = await axios.get('http://localhost:4000/marc/admission')
      users.value = response.data
    } catch (err) {
      error.value = err.response?.data || err.message || err
    } finally {
      pending.value = false
    }
  }

  // Auto fetch on composable use
  fetchUsers()

  return {
    users,
    pending,
    error,
    fetchUsers
  }
}



///// Statistics
      
export const usePatientStatistics = () => {
  const statistics = ref([])
  const pending = ref(false)
  const error = ref(null)

  const fetchStatistics = async () => {
    pending.value = true
    error.value = null
    try {
      const response = await axios.get('http://localhost:4000/marc/admission_highlight')
      statistics.value = response.data
    } catch (err){
      error.value = err.response?.data || err.message || err
    } finally {
      pending.value = false
    }
  }

  // Auto fetch on composable use
  fetchStatistics()

  return {
    statistics,
    pending,
    error,
    fetchStatistics
    
  }
}


export const usePatient = () => {
  const patients = ref([])
  const pending = ref(false)
  const error = ref(null)

  const fetchPatients = async () => {
    pending.value = true
    error.value = null
    try {
      const response = await axios.get('http://localhost:4000/marc/patient_list')
      patients.value = response.data
    } catch (err){
      error.value = err.response?.data || err.message || err
    } finally {
      pending.value = false
    }
  }

  // Auto fetch on composable use
  fetchPatients()
  return {
    patients,
    pending,
    error,
    fetchPatients
    
  }
}
