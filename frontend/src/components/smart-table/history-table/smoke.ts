export type DataObject = {
  name: string
  version: number
  timestamp: string
  action: string
  modified_by: string
}

export type DataAccounts = {
  role: string
  first_name: string
  surname: string
  last_name: string
  username: string
  timestamp: string
  action: string
  modified_by: string
}

export type DataEmployees = {
  role: string
  first_name: string
  surname: string
  last_name: string
  username: string
  timestamp: string
  action: string
  modified_by: string
  objects: string[]
}

export type DataAdmissions = {
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

export const dataAccount: DataAccounts[] = [
  {
    role: 'Администратор',
    first_name: 'Иван',
    surname: 'Иванов',
    last_name: 'Петрушка',
    username: 'vanyaPopov',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1'
  },
  {
    role: 'Руководитель',
    first_name: 'Олег',
    surname: 'Олегов',
    last_name: 'Петрушка',
    username: 'Olegoleg',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1'
  },
  {
    role: 'Руководитель',
    first_name: 'Олег',
    surname: 'Олегов',
    last_name: 'Петрушка',
    username: 'Olegoleg',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'cancel',
    modified_by: 'username1'
  },
  {
    role: 'Руководитель',
    first_name: 'Олег',
    surname: 'Олегов',
    last_name: 'Петрушка',
    username: 'Olegoleg',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1'
  },
  {
    role: 'Руководитель',
    first_name: 'Олег',
    surname: 'Олегов',
    last_name: 'Петрушка',
    username: 'Olegoleg',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1'
  },
  {
    role: 'Руководитель',
    first_name: 'Олег',
    surname: 'Олегов',
    last_name: 'Петрушка',
    username: 'Olegoleg',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1'
  },
  {
    role: 'Руководитель',
    first_name: 'Олег',
    surname: 'Олегов',
    last_name: 'Петрушка',
    username: 'Olegoleg',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1'
  },
  {
    role: 'Руководитель',
    first_name: 'Олег',
    surname: 'Олегов',
    last_name: 'Петрушка',
    username: 'Olegoleg',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1'
  },
  {
    role: 'Руководитель',
    first_name: 'Олег',
    surname: 'Олегов',
    last_name: 'Петрушка',
    username: 'Olegoleg',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1'
  }
]

export const dataAdmissions: DataAdmissions[] = [
  {
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    car_number: 'У569ТО',
    car_brand: 'someCarBrand',
    car_model: 'someCarModel',
    modified_by: 'username1',
    object: 'ГМЦ',
    type: 'разовый',
    first_name: 'Иван',
    surname: 'Иванов',
    last_name: 'Петрушка',
    from_date: '2023-09-08 09:12:12.473393',
    to_date: '2023-09-08 09:12:12.473393',
    note: 'SomeNote'
  },
  {
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    car_number: 'У569ТО',
    car_brand: 'someCarBrand',
    car_model: 'someCarModel',
    modified_by: 'username1',
    object: 'ГМЦ',
    type: 'разовый',
    first_name: 'Иван',
    surname: 'Иванов',
    last_name: 'Петрушка',
    from_date: '2023-09-08 09:12:12.473393',
    to_date: '2023-09-08 09:12:12.473393',
    note: 'SomeNote'
  },
  {
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'toRepay',
    car_number: 'У569ТО',
    car_brand: 'someCarBrand',
    car_model: 'someCarModel',
    modified_by: 'username1',
    object: 'ГМЦ',
    type: 'разовый',
    first_name: 'Иван',
    surname: 'Иванов',
    last_name: 'Петрушка',
    from_date: '2023-09-08 09:12:12.473393',
    to_date: '2023-09-08 09:12:12.473393',
    note: 'SomeNote'
  },
  {
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'cancel',
    car_number: 'У569ТО',
    car_brand: 'someCarBrand',
    car_model: 'someCarModel',
    modified_by: 'username1',
    object: 'ГМЦ',
    type: 'разовый',
    first_name: 'Иван',
    surname: 'Иванов',
    last_name: 'Петрушка',
    from_date: '2023-09-08 09:12:12.473393',
    to_date: '2023-09-08 09:12:12.473393',
    note: 'SomeNote'
  }
]

export const dataEmployees: DataEmployees[] = [
  {
    role: 'Администратор',
    first_name: 'Иван',
    surname: 'Иванов',
    last_name: 'Петрушка',
    username: 'vanyaPopov',
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1',
    objects: ['ГМЦ', 'ГМЦ2']
  }
]

export const dataObject: DataObject[] = [
  {
    name: 'ГМЦ',
    version: 3,
    timestamp: '2019-09-08 09:12:12.473393',
    action: 'edit',
    modified_by: 'username1'
  }
]

export function createData(id: string, timestamp: string, modifiedBy: string, action: string, data: object) {
  return { id, timestamp, modifiedBy, action, data }
}

export const rowsAccount = dataAccount.map((item, index) => {
  const { timestamp, modified_by, action, ...restData } = item

  return createData(`row-${index}`, timestamp.split('.')[0], modified_by, action, restData)
})

export const rowsObject = dataObject.map((item, index) => {
  const { timestamp, modified_by, action, ...restData } = item

  return createData(`row-${index}`, timestamp.split('.')[0], modified_by, action, restData)
})

export const rowsEmployee = dataEmployees.map((item, index) => {
  const { timestamp, modified_by, action, ...restData } = item

  return createData(`row-${index}`, timestamp.split('.')[0], modified_by, action, restData)
})

export const rowsAdmission = dataAdmissions.map((item, index) => {
  const { timestamp, modified_by, action, ...restData } = item

  return createData(`row-${index}`, timestamp.split('.')[0], modified_by, action, restData)
})
