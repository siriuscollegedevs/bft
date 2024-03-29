import { CurrentAccountId } from '../../__data__/states/account'
import { AdmissionTechnical } from '../../__data__/states/admission-technical'
import { AuthState } from '../../__data__/states/auth'
import { FiltersState } from '../../__data__/states/filters'
import { SearchState } from '../../__data__/states/search'
import { TechnicalState } from '../../__data__/states/technical'

export type Accounts = {
  id: string
  role: string
  first_name: string
  surname: string
  last_name: string
  username: string
}

export type Account = {
  role: string
  first_name: string
  surname: string
  last_name: string
  username: string
  password: string
}

export type AccountExpandSearch = {
  role: string
  first_name: string
  surname: string
  last_name: string
  username: string
}

export type ExpandSearchAdmissionsBody = {
  role?: string
  first_name?: string
  surname?: string
  last_name?: string
  username?: string
}

export type ChangePasswordData = {
  status: string | null
  current_password: string | null
  new_password: string
}

export type AccountHistory = {
  role: string
  first_name: string
  surname: string
  last_name: string
  username: string
  timestamp: string
  action: string
  modified_by: string
}

export type Login = {
  account_id: string
  access: string
  refresh: string
  access_exp: number
  refresh_exp: number
}

export type Objects = {
  id: string
  name: string
}

export type ObjectsMatch = {
  id: string
  name: string
  match_id: string
}

export type soloObject = {
  name: string
}

export type ObjectHistory = {
  name: string
  version: number
  timestamp: string
  action: string
  modified_by: string
}

export type Status = {
  status: string
  reason: string
}

export type AdmissionRecord = {
  id: string
  timestamp: string
  action: string
  car_number: string
  car_brand: string
  car_model: string
  type: string
  first_name: string
  surname: string
  last_name: string
  from_date: string
  to_date: string
  note: string
}

export type Human = {
  first_name: string
  surname: string
  last_name: string
  type: string
  from_date: string
  to_date: string
  note: string
}

export type Car = {
  type: string
  car_number: string
  car_brand: string
  car_model: string
  from_date: string
  to_date: string
  note: string
}

export type UpdateRecord = {
  car_number: string
  car_brand: string
  car_model: string
  type: string
  first_name: string
  surname: string
  last_name: string
  from_date: string
  to_date: string
  note: string
}

export type Admissions = {
  id: string
  timestamp: string
  code: string
  object_ids: string[]
}

export type CreateAdmission = {
  id: string
  timestamp: string
  code: number
}

export type AdmissionsHistory = {
  id: string
  timestamp: string
  action: string
  car_number: string
  car_brand: string
  car_model: string
  modified_by: string
  object: string
  type: string
  first_name: string
  surname: string
  last_name: string
  from_date: string
  to_date: string
  note: string
}

export type SearchOfAdmissions = {
  car_number: string
  car_brand: string
  car_model: string
  objects: string[]
  type: string
  first_name: string
  surname: string
  last_name: string
  from_date: string
  to_date: string
  note: string
}

export type SearchOfAdmissionsResponse = {
  id: string
  request_id: string
  code: number
  car_number: string
  car_brand: string
  car_model: string
  objects: string[]
  type: string
  first_name: string
  surname: string
  last_name: string
  from_date: string
  to_date: string
  note: string
}

export type RootState = {
  currentAccount: CurrentAccountId & Account & { accountObjects: Objects[] }
  auth: AuthState
  filters: FiltersState
  search: SearchState
  admissionTechnical: AdmissionTechnical
  technical: TechnicalState
}

export type ObjectInArray = {
  match_id: string
  name: string
}

export type AccountToObject = {
  id: string
  role: string
  first_name?: string
  surname?: string
  last_name: string
  username: string
  objects: string[]
}

export type AccountToObjectSearch = {
  first_name?: string
  surname?: string
  last_name: string
  objects: string[]
}

export type AccountToObjectCreate = {
  account_id: string
  object_ids: string[]
}
