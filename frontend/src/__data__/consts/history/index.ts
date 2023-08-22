import { dateParser } from '../../../utils/date-parser'
import { ACCOUNT_ROLES } from '../account-roles'
import { getObjectValueByKey, RECORD_TYPE } from '../record'

export const actionTranslations: { [key: string]: string } = {
  modified: 'Измененные данные',
  deleted: 'Удаление',
  canceled: 'Аннулирование',
  outdated: 'Истек срок действия',
  created: 'Создание',
  closed: 'Погашение',
  password_changed: 'Изменение пароля'
}

export const getActionTranslation = (action: string): string => {
  return actionTranslations[action] || action
}

export const keyTranslations: { [key: string]: string } = {
  name: 'Название',
  role: 'Тип учетной записи',
  first_name: 'Имя',
  surname: 'Отчество',
  last_name: 'Фамилия',
  username: 'Логин',
  objects: 'Объект(-ы)',
  object: 'Объект(-ы)',
  type: 'Тип',
  from_date: 'Дата(от)',
  to_date: 'Дата(до)',
  note: 'Примечание',
  car_number: 'Гос.номер',
  car_brand: 'Марка',
  car_model: 'Модель'
}

export const getKeyTranslation = (key: string): string => {
  return keyTranslations[key] || key
}

export const formatValue = (value: number | string | string[], key: string) => {
  if (Array.isArray(value)) {
    return value.join(', ')
  } else if (value === null) {
    return '-'
  } else if (key === 'to_date' || key === 'from_date') {
    return typeof value !== 'number' ? dateParser(value) : value
  } else if (key === 'role') {
    const role = ACCOUNT_ROLES[value as keyof typeof ACCOUNT_ROLES]
    return role ? role.ru : ''
  } else if (key === 'type') {
    return typeof value !== 'number' ? getObjectValueByKey(value, RECORD_TYPE) : value
  }
  return value
}
