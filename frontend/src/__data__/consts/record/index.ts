export const RECORD_FIELDS = {
  type: 'Тип',
  first_name: 'Имя',
  last_name: 'Фамилия',
  car_number: 'Гос. номер',
  car_brand: 'Бренд',
  car_model: 'Модель',
  from_date: 'с',
  to_date: 'по',
  note: 'примечание'
}

export const RECORD_TYPE: { [key: string]: string } = {
  for_long_time: 'Временный',
  for_once: 'Разовый'
}

export const getObjectValueByKey = (key: string, obj: any) => {
  if (key in obj) {
    return obj[key]
  }
  return 'Key not found'
}
