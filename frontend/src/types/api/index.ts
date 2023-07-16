import { AuthState } from '../../states/auth'

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

export type ExpandSearchAdmissionsBody = {
  role?: string
  first_name?: string
  surname?: string
  last_name?: string
  username?: string
}

export type ChangePasswordData = {
  status: string
  current_password: string
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
  userId: string
  access: string
  refresh: string
  access_exp: number
  refresh_exp: number
}

export type Objects = {
  id: string
  name: string
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

export type Admissions = {
  id: string
  timestemp: string
  code: string
}

export type AdmissionsHistory = {
  id: string
  timestemp: string
  status: string
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
  object: string
  type: string
  first_name: string
  surname: string
  last_name: string
  from_date: string
  to_date: string
  note: string
}

export type RootState = {
  auth: AuthState
}
