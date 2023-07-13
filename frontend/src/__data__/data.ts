// export const RECORDS_PROPERTIES: Properties = {
//   directories: {
//     accounts: {
//       fullName: 'ФИО',
//       role: 'Роль',
//       email: 'Электронная почта'
//     },
//     objects: {
//       title: 'Наименование'
//     },
//     employees: {
//       fullName: 'ФИО'
//     }
//   },
//   admissions: {}
// }
export const RECORDS_PROPERTIES: Properties = {
  directories: {
    accounts: {
      fullName: 'ФИО',
      role: 'Роль',
      email: 'Электронная почта'
    }
  }
}

export type Properties = {
  [key: string]: string | Properties
}
