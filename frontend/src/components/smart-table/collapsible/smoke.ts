export const rowsAccounts: DataAccount[] = [
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Ice cream sandwich', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin')
]

export function createDataAccounts(name: string, role: string): DataAccount {
  return {
    name,
    role,
    value: [
      {
        email: 'abc@example.com'
      },
      {
        email: 'abc@example.com'
      }
    ]
  }
}

export type DataAccount = {
  name: string
  role: string
  value: value[]
}

export type value = {
  email: string
}

export const rowsEmployees: DataEmployee[] = [
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Ice cream sandwich'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt')
]

export function createDataEmployees(name: string): DataEmployee {
  return {
    name,
    Objects: [
      {
        objects: ['гмц', 'гмц']
      },
      {
        objects: ['гмц', 'гмц']
      }
    ]
  }
}

export type DataEmployee = {
  name: string
  Objects: Objects[]
}

export type Objects = {
  objects: string[]
}

export const rowsAdmissions: DataAdmission[] = [
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt')
]

export function createDataAdmissions(type: string, name: string): DataAdmission {
  return {
    type,
    name,
    value: [
      {
        passType: 'Временный',
        dete: '01.01.2023-01.01.2024',
        note: 'хороший человек'
      },
      {
        passType: 'Временный',
        dete: '01.01.2023-01.01.2024',
        note: 'хороший человек'
      },
      {
        passType: 'Временный',
        dete: '01.01.2023-01.01.2024',
        note: 'хороший человек'
      }
    ]
  }
}

export type DataAdmission = {
  type: string
  name: string
  value: AdmissionsValue[]
}

export type AdmissionsValue = {
  passType: string
  dete: string
  note: string
}
