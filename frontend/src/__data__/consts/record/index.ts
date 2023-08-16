export const RECORD_FIELDS = {
  type: 'Тип',
  first_name: 'Имя',
  last_name: 'Фамилия',
  surname: 'Отчество',
  car_number: 'Гос. номер',
  car_brand: 'Бренд',
  car_model: 'Модель',
  from_date: 'с',
  to_date: 'по',
  note: 'Примечание'
}

type RECORD_TYPE = {
  for_long_time: string
  for_once: string
}

export const RECORD_TYPE: RECORD_TYPE = {
  for_long_time: 'Временный',
  for_once: 'Разовый'
}

export const getObjectValueByKey = (key: string, obj: any) => {
  if (key in obj) {
    return obj[key]
  }
  return 'Key not found'
}
