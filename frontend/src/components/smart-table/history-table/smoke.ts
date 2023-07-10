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
  }
]

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

export function createData(id: string, date: string, user: string, data: string) {
  return { id, date, user, data }
}

export const rowsAccount = [
  createData('12345678', dataAccount[0].timestamp.split('.')[0], dataAccount[0].modified_by, dataAccount[0].action),
  createData('12345679', '02.03.2023', 'admin', 'edit'),
  createData('12345777', '02.03.2023', 'admin', 'edit'),
  createData('12345670', '02.03.2023', 'admin', 'edit'),
  createData('12345671', '02.03.2023', 'admin', 'edit'),
  createData('12345674', '02.03.2023', 'admin', 'edit')
]

export const rowsObject = [
  createData('12345678', dataObject[0].timestamp.split('.')[0], dataObject[0].modified_by, dataObject[0].action),
  createData('12345679', '02.03.2023', 'admin', 'edit'),
  createData('12345777', '02.03.2023', 'admin', 'edit'),
  createData('12345670', '02.03.2023', 'admin', 'edit'),
  createData('12345671', '02.03.2023', 'admin', 'edit'),
  createData('12345674', '02.03.2023', 'admin', 'edit')
]

export const rowsEmployee = [
  createData(
    '12345678',
    dataEmployees[0].timestamp.split('.')[0],
    dataEmployees[0].modified_by,
    dataEmployees[0].action
  ),
  createData('12345679', '02.03.2023', 'admin', 'edit'),
  createData('12345777', '02.03.2023', 'admin', 'edit'),
  createData('12345670', '02.03.2023', 'admin', 'edit'),
  createData('12345671', '02.03.2023', 'admin', 'edit'),
  createData('12345674', '02.03.2023', 'admin', 'edit')
]

export const rowsAdmission = [
  createData(
    '12345678',
    dataAdmissions[0].timestamp.split('.')[0],
    dataAdmissions[0].modified_by,
    dataAdmissions[0].action
  ),
  createData('12345679', '02.03.2023', 'admin', 'cancel'),
  createData('12345777', '02.03.2023', 'admin', 'edit'),
  createData('12345670', '02.03.2023', 'admin', 'toRepay'),
  createData('12345671', '02.03.2023', 'admin', 'edit'),
  createData('12345674', '02.03.2023', 'admin', 'cancel')
]
