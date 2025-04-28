// lib/api/index.ts
// Main export file for API modules

import api from "./axios-instance"
import authAPI from "./auth"
import catalogAPI from "./catalog"
import borrowAPI from "./borrow"
import finesAPI from "./fines"
import requestAPI from "./request"

// Export all API modules
export { authAPI, catalogAPI, borrowAPI, finesAPI, requestAPI }

// Export the base API instance as default
export default api
