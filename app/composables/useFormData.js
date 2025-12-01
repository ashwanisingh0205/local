import { checkbox } from "#build/ui"


export const useFormData = () => {
  const loading = ref(false)
  const error = ref(null)


  const fetchFormConfig = async () => {
    loading.value = true
    error.value = null
    
    try {
  
      
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Dummy API response - labels/titles come from API
      return {
        fields: [
          {
            id: "name",
            label: "Name",  // Title comes from API
            type: "text"
          },
          {
            id: "password",
            label: "Password",  
            type: "password"
          },
          {
            id: "email",
            label: "Email",  
            type: "email",
            required: true
          },
          {
            id: "phone",
            label: "Phone Number",  // Title comes from API
            type: "tel"
          },
          {
            id: "age",
            label: "Age",  // Title comes from API
            type: "number"
          },
          {
            id: "hasAllergies",
            label: "Has Allergies",  // Title comes from API
            type: "checkbox",
            options: ["Yes", "No"]
          },
          {
            id: "bloodType",
            label: "Blood Type",  // Title comes from API
            type: "select",
            options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
          },
          {
            id: "gender",
            label: "Gender",  // Title comes from API
            type: "radio",
            options: ["Male", "Female", "Other"]
          },
          {
            id: "address",
            label: "Address",  // Title comes from API
            type: "textarea",
            rows: 4
          },
          
        ]
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch form config'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch form data from API
  const fetchFormData = async () => {
    try {
     
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return {
        // name: "John Doe",
        // password: "",
        // email: "john@example.com",
        // phone: "+1234567890",
        // age: 35,
        // hasAllergies: false,
        // bloodType: "O+",
        // gender: "Male",
        // address: "123 Main Street, City, State"
      }
    } catch (err) {
      return {}
    }
  }

  // Load both config and data
  const loadFormData = async () => {
    const config = await fetchFormConfig()
    const data = await fetchFormData()
    return { config, data }
  }

  return {
    loading,
    error,
    loadFormData
  }
}
