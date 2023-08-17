export const compareDates = (a: any, b: any) => {
  const dateA = new Date(a.timestamp)
  const dateB = new Date(b.timestamp)
  return dateB.getTime() - dateA.getTime()
}

export const sortData = (data: any[], sortBy: string): any[] => {
  return [...data].sort((a, b) => {
    const fieldA = a[sortBy].toLowerCase();
    const fieldB = b[sortBy].toLowerCase();

    if (fieldA < fieldB) {
      return -1;
    }
    if (fieldA > fieldB) {
      return 1;
    }
    return 0;
  });
};
